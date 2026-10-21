"use client";

import { useState } from "react";
import { cleanPhone, inviteMessage } from "@/lib/util";

/** Buka WhatsApp dengan pesan undangan untuk satu tamu. Tanpa nomor, WhatsApp meminta memilih kontak. */
export function openWhatsApp(opts: { path: string; guestName: string; phone: string; couple: string; template: string }) {
  const link = `${window.location.origin}${opts.path}`;
  const text = inviteMessage(opts.template, { nama: opts.guestName, pasangan: opts.couple, link });
  const target = opts.phone ? cleanPhone(opts.phone) : "";
  window.open(`https://wa.me/${target}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

export default function ShareButtons({
  path,
  guestName,
  phone,
  couple,
  template,
  onSent,
}: {
  path: string;
  guestName: string;
  phone: string;
  couple: string;
  template: string;
  onSent?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const fullUrl = () => `${window.location.origin}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Salin link ini:", fullUrl());
    }
  };

  return (
    <span className="row">
      <button type="button" className="btn small" onClick={copy}>
        {copied ? "Tersalin" : "Salin link"}
      </button>
      <button
        type="button"
        className="btn small alt"
        onClick={() => {
          openWhatsApp({ path, guestName, phone, couple, template });
          onSent?.();
        }}
      >
        WhatsApp
      </button>
    </span>
  );
}
