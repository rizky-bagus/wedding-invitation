"use client";

import { useEffect, useRef, useState } from "react";

export type Column = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "time" | "color" | "textarea";
  /** Lebar relatif kolom (grid fr). */
  fr?: number;
};

type Row = Record<string, string>;

/**
 * Editor baris dinamis (tambah/hapus). Nilainya dikirim sebagai JSON lewat input tersembunyi
 * bernama `name`, jadi server action cukup membaca satu field.
 */
export default function RowsField({
  name,
  label,
  columns,
  defaultValue,
  addLabel = "Tambah baris",
  max = 12,
  hint,
}: {
  name: string;
  label: string;
  columns: Column[];
  defaultValue: Row[] | string[];
  addLabel?: string;
  max?: number;
  hint?: string;
}) {
  // Daftar warna (array string) dibungkus agar bisa memakai satu kolom bernama "value".
  const flat = columns.length === 1 && columns[0].key === "value";
  const initial: Row[] = flat ? (defaultValue as string[]).map((v) => ({ value: v })) : (defaultValue as Row[]);
  const [rows, setRows] = useState<Row[]>(initial);

  const json = JSON.stringify(flat ? rows.map((r) => r.value) : rows);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.dispatchEvent(new Event("inv-form-change"));
  }, [json]);

  const blank = (): Row => Object.fromEntries(columns.map((c) => [c.key, c.type === "color" ? "#8a9a78" : ""]));
  const update = (i: number, key: string, value: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));

  return (
    <div className="span2 rows-field">
      <span className="rows-label">{label}</span>
      {hint && <p className="hint" style={{ margin: "0 0 0.4rem" }}>{hint}</p>}
      <input type="hidden" name={name} value={json} />
      {rows.map((row, i) => (
        <div
          key={i}
          className="rows-row"
          style={{ gridTemplateColumns: `${columns.map((c) => `${c.fr ?? 1}fr`).join(" ")} auto` }}
        >
          {columns.map((c) =>
            c.type === "textarea" ? (
              <textarea
                key={c.key}
                rows={3}
                value={row[c.key] ?? ""}
                placeholder={c.placeholder ?? c.label}
                aria-label={c.label}
                onChange={(e) => update(i, c.key, e.target.value)}
              />
            ) : (
              <input
                key={c.key}
                type={c.type ?? "text"}
                value={row[c.key] ?? ""}
                placeholder={c.placeholder ?? c.label}
                aria-label={c.label}
                onChange={(e) => update(i, c.key, e.target.value)}
              />
            ),
          )}
          <button type="button" className="btn small ghost" onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))} aria-label="Hapus baris">
            ×
          </button>
        </div>
      ))}
      {rows.length < max && (
        <button type="button" className="btn small ghost" onClick={() => setRows((rs) => [...rs, blank()])}>
          + {addLabel}
        </button>
      )}
    </div>
  );
}
