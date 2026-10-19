"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  label: string;
  kind: "image" | "audio";
  defaultValue?: string;
  /** Galeri: textarea berisi satu URL per baris, upload menambah baris baru. */
  multiple?: boolean;
  wide?: boolean;
  placeholder?: string;
};

const ACCEPT = { image: ".jpg,.jpeg,.png,.webp,.gif", audio: ".mp3,.m4a,.ogg,.wav" };

async function upload(file: File, kind: string): Promise<{ url: string; note?: string }> {
  const body = new FormData();
  body.set("file", file);
  body.set("kind", kind);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Upload gagal.");
  return { url: json.url as string, note: json.note as string | undefined };
}

export default function UploadField({ name, label, kind, defaultValue = "", multiple, wide, placeholder }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const picker = useRef<HTMLInputElement>(null);

  // Hasil upload / tombol Kosongkan mengubah nilai lewat state: beri tahu pratinjau.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.dispatchEvent(new Event("inv-form-change"));
  }, [value]);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const urls: string[] = [];
      let lastNote: string | undefined;
      for (const f of files) {
        const res = await upload(f, kind);
        urls.push(res.url);
        lastNote = res.note;
      }
      setValue((prev) => (multiple ? [prev.trim(), ...urls].filter(Boolean).join("\n") : urls[0]));
      if (lastNote) setInfo(files.length > 1 ? `${files.length} foto dioptimalkan` : lastNote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setBusy(false);
    }
  };

  const first = multiple ? "" : value;
  return (
    <div className={wide ? "span2" : undefined}>
      <label>
        {label}
        {multiple ? (
          <textarea name={name} rows={4} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
        ) : (
          <input name={name} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
        )}
      </label>
      <div className="row" style={{ marginTop: "0.4rem" }}>
        <button type="button" className="btn small alt" disabled={busy} onClick={() => picker.current?.click()}>
          {busy ? "Mengunggah..." : multiple ? "Unggah foto" : "Unggah file"}
        </button>
        {!multiple && value && (
          <button type="button" className="btn small" onClick={() => setValue("")}>
            Kosongkan
          </button>
        )}
        <input ref={picker} type="file" accept={ACCEPT[kind]} multiple={multiple} hidden onChange={onPick} />
        {error && <span className="msg err">{error}</span>}
        {info && !error && <span className="msg">{info}</span>}
      </div>
      {kind === "image" && first && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={first} alt="" style={{ marginTop: "0.5rem", maxHeight: 90, borderRadius: 6 }} />
      )}
      {kind === "audio" && first && <audio src={first} controls preload="none" style={{ marginTop: "0.5rem", width: "100%" }} />}
    </div>
  );
}
