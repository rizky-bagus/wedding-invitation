"use client";

import { useState } from "react";

/** Pratinjau undangan dalam bingkai HP. Muat ulang setelah menyimpan perubahan. */
export default function PreviewFrame({ path }: { path: string }) {
  const [version, setVersion] = useState(0);
  return (
    <div className="preview">
      <div className="preview-bar">
        <strong>Pratinjau</strong>
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
        <iframe key={version} src={path} title="Pratinjau undangan" />
      </div>
      <p className="hint">Simpan perubahan, lalu klik Muat ulang.</p>
    </div>
  );
}
