"use client";

import { useEffect, useState } from "react";

/** Tiket masuk: kode QR berisi link personal tamu; dipindai di meja penerima tamu pada hari acara. */
export default function GuestTicket({ name, title, hint }: { name: string; title: string; hint: string }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let alive = true;
    const url = `${window.location.origin}${window.location.pathname}?${new URLSearchParams({ to: name })}`;
    import("qrcode")
      .then((QR) => QR.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" }))
      .then((s) => alive && setSvg(s))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [name]);

  if (!svg) return null;
  return (
    <div className="inv-ticket">
      <h3>{title}</h3>
      <div className="inv-ticket-qr" role="img" aria-label="QR" dangerouslySetInnerHTML={{ __html: svg }} />
      <strong>{name}</strong>
      <small>{hint}</small>
    </div>
  );
}
