"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { markOpened, submitRsvp, type RsvpState } from "@/app/actions/public";
import "./invitation.css";

export type InvitationData = {
  id: string;
  title: string;
  groomName: string;
  brideName: string;
  groomParents: string;
  brideParents: string;
  eventISO: string;
  dateText: string;
  timeText: string;
  venueName: string;
  venueAddress: string;
  mapEmbedUrl: string;
  openingText: string;
  closingText: string;
  coverPhoto: string;
  groomPhoto: string;
  bridePhoto: string;
  gallery: string[];
  musicUrl: string;
  template: string;
  primaryColor: string;
  bgColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
};
export type GuestData = { id: string; name: string; rsvp: string; pax: number } | null;
export type WishData = { id: string; name: string; message: string; when: string };

function Countdown({ target }: { target: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [target]);

  const ms = left ?? 0;
  const units = [
    ["Hari", Math.floor(ms / 86400000)],
    ["Jam", Math.floor(ms / 3600000) % 24],
    ["Menit", Math.floor(ms / 60000) % 60],
    ["Detik", Math.floor(ms / 1000) % 60],
  ] as const;
  return (
    <div className="inv-count">
      {units.map(([label, value]) => (
        <div key={label} className="inv-count-box">
          <strong>{left === null ? "--" : String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function RsvpForm({ invitationId, guest }: { invitationId: string; guest: GuestData }) {
  const [state, action, pending] = useActionState<RsvpState | null, FormData>(
    submitRsvp.bind(null, invitationId, guest?.id ?? null),
    null,
  );
  return (
    <form action={action} className="inv-form">
      {guest ? (
        <p className="inv-form-name">
          Dari: <strong>{guest.name}</strong>
        </p>
      ) : (
        <input name="name" placeholder="Nama Anda" required maxLength={80} />
      )}
      {guest && (
        <>
          <div className="inv-radio">
            <label>
              <input type="radio" name="attendance" value="yes" defaultChecked={guest.rsvp === "yes"} required /> Hadir
            </label>
            <label>
              <input type="radio" name="attendance" value="no" defaultChecked={guest.rsvp === "no"} /> Tidak hadir
            </label>
          </div>
          <label className="inv-pax">
            Jumlah tamu
            <input type="number" name="pax" min={1} max={10} defaultValue={guest.pax || 1} />
          </label>
        </>
      )}
      <textarea name="message" placeholder="Tulis ucapan & doa" rows={4} maxLength={500} />
      <button type="submit" disabled={pending}>
        {pending ? "Mengirim..." : "Kirim"}
      </button>
      {state && <p className={state.ok ? "inv-ok" : "inv-err"}>{state.message}</p>}
    </form>
  );
}

export default function Invitation({
  inv,
  guest,
  wishes,
}: {
  inv: InvitationData;
  guest: GuestData;
  wishes: WishData[];
}) {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  const open = () => {
    setOpened(true);
    window.scrollTo({ top: 0 });
    if (guest) void markOpened(guest.id);
    if (audio.current) {
      audio.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };
  const toggleMusic = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else {
      a.pause();
      setPlaying(false);
    }
  };

  const style = {
    "--primary": inv.primaryColor,
    "--bg": inv.bgColor,
    "--text": inv.textColor,
    "--font-heading": `"${inv.headingFont}", serif`,
    "--font-body": `"${inv.bodyFont}", sans-serif`,
  } as React.CSSProperties;

  const fontQuery = [inv.headingFont, inv.bodyFont]
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;700`)
    .join("&");

  return (
    <div className="inv" data-template={inv.template} data-opened={opened} style={style}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fontQuery}&display=swap`} />
      {inv.musicUrl && <audio ref={audio} src={inv.musicUrl} loop preload="none" />}

      <section
        className="inv-cover"
        style={inv.coverPhoto ? { backgroundImage: `url("${inv.coverPhoto.replace(/["\\\n]/g, encodeURIComponent)}")` } : undefined}
      >
        <div className="inv-cover-inner">
          <p className="inv-eyebrow">{inv.title}</p>
          <h1>
            {inv.groomName} <span>&amp;</span> {inv.brideName}
          </h1>
          <p>{inv.dateText}</p>
          {guest ? (
            <div className="inv-to">
              <small>Kepada Yth. Bapak/Ibu/Saudara/i</small>
              <strong>{guest.name}</strong>
            </div>
          ) : (
            <div className="inv-to">
              <small>Anda diundang ke acara kami</small>
            </div>
          )}
          {!opened && (
            <button className="inv-open" onClick={open}>
              Buka Undangan
            </button>
          )}
        </div>
      </section>

      {opened && (
        <main className="inv-main">
          {inv.musicUrl && (
            <button className="inv-music" onClick={toggleMusic} aria-label="Putar atau jeda musik">
              {playing ? "❚❚" : "♪"}
            </button>
          )}

          <section className="inv-section inv-opening">
            <p className="inv-eyebrow">Save the Date</p>
            <p>{inv.openingText}</p>
          </section>

          <section className="inv-section inv-couple">
            <div>
              {inv.groomPhoto && <img src={inv.groomPhoto} alt={inv.groomName} />}
              <h2>{inv.groomName}</h2>
              {inv.groomParents && <p>{inv.groomParents}</p>}
            </div>
            <div className="inv-amp">&amp;</div>
            <div>
              {inv.bridePhoto && <img src={inv.bridePhoto} alt={inv.brideName} />}
              <h2>{inv.brideName}</h2>
              {inv.brideParents && <p>{inv.brideParents}</p>}
            </div>
          </section>

          <section className="inv-section inv-event">
            <p className="inv-eyebrow">Hari Bahagia</p>
            <h2>{inv.dateText}</h2>
            <p>{inv.timeText}</p>
            {inv.venueName && <p className="inv-venue">{inv.venueName}</p>}
            {inv.venueAddress && <p>{inv.venueAddress}</p>}
            <Countdown target={inv.eventISO} />
            {inv.mapEmbedUrl && (
              <iframe
                className="inv-map"
                src={inv.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta lokasi acara"
              />
            )}
          </section>

          {inv.gallery.length > 0 && (
            <section className="inv-section inv-gallery">
              <p className="inv-eyebrow">Galeri</p>
              <div className="inv-grid">
                {inv.gallery.map((src) => (
                  <img key={src} src={src} alt="" loading="lazy" />
                ))}
              </div>
            </section>
          )}

          <section className="inv-section inv-rsvp">
            <p className="inv-eyebrow">{guest ? "RSVP & Ucapan" : "Ucapan & Doa"}</p>
            <RsvpForm invitationId={inv.id} guest={guest} />
            <ul className="inv-wishes">
              {wishes.map((w) => (
                <li key={w.id}>
                  <strong>{w.name}</strong>
                  <small>{w.when}</small>
                  <p>{w.message}</p>
                </li>
              ))}
            </ul>
          </section>

          <footer className="inv-section inv-footer">
            <p>{inv.closingText}</p>
            <h2>
              {inv.groomName} &amp; {inv.brideName}
            </h2>
          </footer>
        </main>
      )}
    </div>
  );
}
