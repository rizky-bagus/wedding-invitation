"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteGuest, markSent } from "@/app/actions/admin";
import { DEFAULT_INVITE_TEMPLATE, guestPath } from "@/lib/util";
import ShareButtons, { openWhatsApp } from "./ShareButtons";

export type GuestRow = {
  id: string;
  name: string;
  phone: string;
  rsvp: string;
  pax: number;
  opened: boolean;
  sent: boolean;
  checkedIn: boolean;
};

const FILTERS = [
  ["all", "Semua"],
  ["unsent", "Belum dikirim"],
  ["unopened", "Belum dibuka"],
  ["pending", "Belum konfirmasi"],
  ["yes", "Hadir"],
  ["no", "Tidak hadir"],
  ["in", "Sudah check-in"],
] as const;

type Filter = (typeof FILTERS)[number][0];
const STORAGE_KEY = "inv-wa-template";

export default function GuestTable({ invId, slug, couple, guests }: { invId: string; slug: string; couple: string; guests: GuestRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [template, setTemplate] = useState(DEFAULT_INVITE_TEMPLATE);
  const [sentNow, setSentNow] = useState<string[]>([]); // ditandai lokal sampai data server menyusul

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setTemplate(saved);
    } catch {}
  }, []);
  const changeTemplate = (v: string) => {
    setTemplate(v);
    try {
      window.localStorage.setItem(STORAGE_KEY, v);
    } catch {}
  };

  const isSent = (g: GuestRow) => g.sent || sentNow.includes(g.id);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests.filter((g) => {
      if (q && !g.name.toLowerCase().includes(q) && !g.phone.includes(q)) return false;
      switch (filter) {
        case "unsent":
          return !(g.sent || sentNow.includes(g.id));
        case "unopened":
          return !g.opened;
        case "pending":
          return g.rsvp === "pending";
        case "yes":
          return g.rsvp === "yes";
        case "no":
          return g.rsvp === "no";
        case "in":
          return g.checkedIn;
        default:
          return true;
      }
    });
  }, [guests, query, filter, sentNow]);

  const queue = shown.filter((g) => !isSent(g));
  const next = queue[0];

  const mark = (id: string) => {
    setSentNow((s) => (s.includes(id) ? s : [...s, id]));
    void markSent(invId, id);
  };
  const sendNext = () => {
    if (!next) return;
    openWhatsApp({ path: guestPath(slug, next.name), guestName: next.name, phone: next.phone, couple, template });
    mark(next.id);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <div className="guest-tools">
        <input type="search" placeholder="Cari nama atau nomor..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Cari tamu" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} aria-label="Saring tamu">
          {FILTERS.map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
        <span className="hint">
          {shown.length} dari {guests.length} tamu
        </span>
      </div>

      <details className="bulk">
        <summary>Kirim massal lewat WhatsApp</summary>
        <p className="hint">
          Browser hanya mengizinkan satu jendela WhatsApp per klik, jadi tamu dikirim bergantian: klik tombol, kirim pesannya di WhatsApp, kembali ke sini, klik lagi.
          Antrean mengikuti pencarian dan filter di atas. Tamu tanpa nomor tetap bisa dikirim: WhatsApp akan meminta Anda memilih kontak.
        </p>
        <label>
          Isi pesan (penanda: {"{nama}"}, {"{pasangan}"}, {"{link}"})
          <textarea rows={6} value={template} onChange={(e) => changeTemplate(e.target.value)} />
        </label>
        <div className="row">
          <button type="button" className="btn alt" onClick={sendNext} disabled={!next}>
            {next ? `Kirim ke ${next.name}` : "Antrean kosong"}
          </button>
          {next && (
            <button type="button" className="btn small ghost" onClick={() => mark(next.id)}>
              Lewati
            </button>
          )}
          <span className="hint">{queue.length} tamu belum dikirim</span>
          <button type="button" className="btn small ghost" onClick={() => changeTemplate(DEFAULT_INVITE_TEMPLATE)}>
            Pesan bawaan
          </button>
        </div>
      </details>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Status</th>
              <th>RSVP</th>
              <th>Bagikan</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {shown.map((g) => {
              const path = guestPath(slug, g.name);
              return (
                <tr key={g.id}>
                  <td>
                    <span className="who">
                      <span className="avatar">{g.name.charAt(0).toUpperCase()}</span>
                      <span>
                        {g.name}
                        {g.phone && <small className="hint"> · {g.phone}</small>}
                        <br />
                        <a href={path} target="_blank" rel="noreferrer">
                          <code>{path}</code>
                        </a>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="flags">
                      {isSent(g) && <span className="pill sent">Terkirim</span>}
                      {g.opened && <span className="pill opened">Dibuka</span>}
                      {g.checkedIn && <span className="pill yes">Check-in</span>}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${g.rsvp}`}>{g.rsvp === "yes" ? `Hadir (${g.pax})` : g.rsvp === "no" ? "Tidak hadir" : "Belum"}</span>
                  </td>
                  <td>
                    <ShareButtons path={path} guestName={g.name} phone={g.phone} couple={couple} template={template} onSent={() => mark(g.id)} />
                  </td>
                  <td>
                    <form action={deleteGuest.bind(null, invId, g.id)}>
                      <button className="btn small danger" type="submit">
                        Hapus
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="hint">
                  Tidak ada tamu yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
