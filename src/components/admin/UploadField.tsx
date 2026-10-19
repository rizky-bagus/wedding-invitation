"use client";

import { useRef, useState } from "react";

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

async function upload(file: File, kind: string): Promise<string> {
  const body = new FormData();
  body.set("file", file);
  body.set("kind", kind);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Upload gagal.");
  return json.url as string;
}

export default function UploadField({ name, label, kind, defaultValue = "", multiple, wide, placeholder }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const picker = useRef<HTMLInputElement>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const f of files) urls.push(await upload(f, kind));
      setValue((prev) => (multiple ? [prev.trim(), ...urls].filter(Boolean).join("\n") : urls[0]));
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
        {error && <span className="msg" style={{ color: "#b3382c" }}>{error}</span>}
      </div>
      {kind === "image" && first && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={first} alt="" style={{ marginTop: "0.5rem", maxHeight: 90, borderRadius: 6 }} />
      )}
      {kind === "audio" && first && <audio src={first} controls preload="none" style={{ marginTop: "0.5rem", width: "100%" }} />}
    </div>
  );
}
