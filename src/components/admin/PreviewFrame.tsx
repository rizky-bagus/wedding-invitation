"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Nama event yang dikirim komponen form (palet, upload) saat nilainya berubah lewat state. */
export const FORM_CHANGE_EVENT = "inv-form-change";

/**
 * Pratinjau undangan dalam bingkai HP. Isi form dikirim ke iframe lewat postMessage,
 * jadi perubahan langsung terlihat tanpa menyimpan.
 */
export default function PreviewFrame({ path, formId }: { path: string; formId: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [version, setVersion] = useState(0);

  const send = useCallback(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    const win = frame.current?.contentWindow;
    if (!form || !win) return;
    const fields: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") fields[key] = value;
    });
    win.postMessage({ type: "inv-preview", fields }, window.location.origin);
  }, [formId]);

  useEffect(() => {
    const form = document.getElementById(formId);
    let timer: ReturnType<typeof setTimeout>;
    const queue = () => {
      clearTimeout(timer);
      timer = setTimeout(send, 150);
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.source === frame.current?.contentWindow && e.data?.type === "inv-preview-ready") {
        send();
      }
    };
    form?.addEventListener("input", queue);
    form?.addEventListener("change", queue);
    form?.addEventListener("reset", queue);
    window.addEventListener(FORM_CHANGE_EVENT, queue);
    window.addEventListener("message", onMessage);
    return () => {
      clearTimeout(timer);
      form?.removeEventListener("input", queue);
      form?.removeEventListener("change", queue);
      form?.removeEventListener("reset", queue);
      window.removeEventListener(FORM_CHANGE_EVENT, queue);
      window.removeEventListener("message", onMessage);
    };
  }, [formId, send]);

  return (
    <div className="preview">
      <div className="preview-bar">
        <strong>Pratinjau langsung</strong>
        <span className="row" style={{ margin: 0 }}>
          <button type="button" className="btn small ghost" onClick={() => setVersion((v) => v + 1)}>
            Muat ulang
          </button>
          <a className="btn small ghost" href={path} target="_blank" rel="noreferrer">
            Buka
          </a>
        </span>
      </div>
      <div className="phone">
        <iframe ref={frame} key={version} src={path} title="Pratinjau undangan" />
      </div>
      <p className="hint">Perubahan tampil di sini langsung. Klik Simpan perubahan agar tamu juga melihatnya.</p>
    </div>
  );
}
