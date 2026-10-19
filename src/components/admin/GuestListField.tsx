"use client";

import { useEffect, useRef, useState } from "react";

const PHONE = /^\+?[\d\s\-().]{6,}$/;

/** Pecah satu baris CSV dengan pemisah tertentu, menghormati tanda kutip ganda. */
function splitLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else quoted = !quoted;
    } else if (ch === delim && !quoted) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/** CSV/TXT/tempelan Excel -> baris "Nama | WhatsApp". Kolom pertama = nama, kolom kedua dipakai jika mirip nomor telepon. */
export function parseGuestFile(text: string): string[] {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  const delim = lines.some((l) => l.includes("\t")) ? "\t" : lines.some((l) => l.includes(";")) ? ";" : lines.some((l) => l.includes("|")) ? "|" : ",";
  const rows = lines.map((l) => splitLine(l, delim));
  if (/^(nama|name|tamu|nama tamu)$/i.test(rows[0][0] ?? "")) rows.shift(); // buang baris judul
  return rows
    .map(([name, second = ""]) => {
      if (!name) return "";
      return PHONE.test(second) ? `${name} | ${second}` : name;
    })
    .filter(Boolean);
}

export default function GuestListField({ placeholder }: { placeholder: string }) {
  const [value, setValue] = useState("");
  const [info, setInfo] = useState("");
  const area = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);

  // Form dikosongkan setelah berhasil dikirim; state terkontrol ikut dikosongkan.
  useEffect(() => {
    const form = area.current?.form;
    const clear = () => setValue("");
    form?.addEventListener("reset", clear);
    return () => form?.removeEventListener("reset", clear);
  }, []);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const parsed = parseGuestFile(await file.text());
    if (!parsed.length) {
      setInfo("Tidak ada nama yang terbaca di file itu.");
      return;
    }
    setValue((v) => [v.trim(), ...parsed].filter(Boolean).join("\n"));
    setInfo(`${parsed.length} baris dari "${file.name}" ditambahkan ke kotak. Periksa lalu klik Tambah tamu.`);
  };

  return (
    <div>
      <label>
        Satu tamu per baris, nama harus unik. Nomor WhatsApp opsional, pisahkan dengan |
        <textarea ref={area} name="guests" rows={4} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
      </label>
      <div className="row" style={{ marginTop: "0.5rem" }}>
        <button type="button" className="btn small ghost" onClick={() => picker.current?.click()}>
          Impor dari CSV / TXT
        </button>
        <input ref={picker} type="file" accept=".csv,.txt,text/csv,text/plain" hidden onChange={onFile} />
        {info && <span className="hint">{info}</span>}
      </div>
    </div>
  );
}
