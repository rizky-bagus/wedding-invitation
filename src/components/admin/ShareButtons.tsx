"use client";

import { useState } from "react";
import { cleanPhone } from "@/lib/util";

export default function ShareButtons({
  path,
  guestName,
  phone,
  couple,
}: {
  path: string;
  guestName: string;
  phone: string;
  couple: string;
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

  const whatsapp = () => {
    const text =
      `Kepada Yth. ${guestName},\n\n` +
      `Dengan penuh kebahagiaan, kami mengundang Anda ke pernikahan ${couple}.\n` +
      `Detail undangan dapat dibuka di sini:\n${fullUrl()}\n\nTerima kasih.`;
    const target = phone ? cleanPhone(phone) : "";
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <span className="row">
      <button type="button" className="btn small" onClick={copy}>
        {copied ? "Tersalin" : "Salin link"}
      </button>
      <button type="button" className="btn small alt" onClick={whatsapp}>
        WhatsApp
      </button>
    </span>
  );
}
