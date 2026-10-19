"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { markOpened, submitRsvp, type RsvpState } from "@/app/actions/public";
import { previewOverrides } from "@/lib/preview";
import { Corner, Divider, Flower, IconCalendar, IconClock, IconNote, IconPin, Petals } from "./ornaments";
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
/** id null = nama dari ?to= yang belum ada di daftar tamu; tercatat otomatis saat RSVP. */
export type GuestData = { id: string | null; name: string; rsvp: string; pax: number } | null;
export type WishData = { id: string; name: string; message: string; when: string };

/** Muncul halus saat masuk viewport. */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`inv-reveal ${seen ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

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

function Portrait({ src, name }: { src: string; name: string }) {
  return (
    <div className="inv-frame">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} />
      ) : (
        <div className="inv-mono" aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
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
        <>
          <p className="inv-form-name">
            Dari: <strong>{guest.name}</strong>
          </p>
          <input type="hidden" name="name" value={guest.name} />
        </>
      ) : (
        <input name="name" placeholder="Nama Anda" required maxLength={80} />
      )}
      <div className="inv-radio">
        <label>
          <input type="radio" name="attendance" value="yes" defaultChecked={guest?.rsvp === "yes"} />
          <span>Hadir</span>
        </label>
        <label>
          <input type="radio" name="attendance" value="no" defaultChecked={guest?.rsvp === "no"} />
          <span>Tidak hadir</span>
        </label>
      </div>
      <label className="inv-pax">
        Jumlah tamu
        <input type="number" name="pax" min={1} max={10} defaultValue={guest?.pax || 1} />
      </label>
      <textarea name="message" placeholder="Tulis ucapan & doa" rows={4} maxLength={500} />
      <button type="submit" disabled={pending}>
        {pending ? "Mengirim..." : "Kirim"}
      </button>
      {state && <p className={state.ok ? "inv-ok" : "inv-err"}>{state.message}</p>}
    </form>
  );
}

function calendarUrl(inv: InvitationData): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const start = new Date(inv.eventISO);
  const end = new Date(start.getTime() + 3 * 3600 * 1000);
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${inv.groomName} & ${inv.brideName}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: inv.openingText,
    location: [inv.venueName, inv.venueAddress].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export default function Invitation({
  inv: invProp,
  guest,
  wishes,
}: {
  inv: InvitationData;
  guest: GuestData;
  wishes: WishData[];
}) {
  // Di dalam iframe pratinjau dashboard, data bisa ditimpa oleh isi form yang belum disimpan.
  const [override, setOverride] = useState<Partial<InvitationData>>({});
  const inv = { ...invProp, ...override };
  useEffect(() => {
    if (window.parent === window) return;
    const origin = window.location.origin;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== origin || e.source !== window.parent || e.data?.type !== "inv-preview") return;
      setOverride(previewOverrides(e.data.fields));
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "inv-preview-ready" }, origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement>(null);

  const open = () => {
    setOpened(true);
    window.scrollTo({ top: 0 });
    if (guest?.id) void markOpened(guest.id);
    audio.current?.play().then(() => setPlaying(true)).catch(() => {});
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

  const tpl = inv.template;
  const initials = `${inv.groomName.charAt(0)} & ${inv.brideName.charAt(0)}`.toUpperCase();
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [inv.venueName, inv.venueAddress].filter(Boolean).join(" "),
  )}`;
  const coverBg = inv.coverPhoto ? `url("${inv.coverPhoto.replace(/["\\\n]/g, encodeURIComponent)}")` : undefined;

  return (
    <div className="inv" data-template={tpl} data-opened={opened} style={style}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fontQuery}&display=swap`} />
      {inv.musicUrl && <audio ref={audio} src={inv.musicUrl} loop preload="none" />}

      {/* ---------- Cover ---------- */}
      <section className="inv-cover">
        <div className="inv-cover-bg" style={coverBg ? { backgroundImage: coverBg } : undefined} />
        {tpl === "floral" && (
          <>
            <Flower className="inv-flower-a" />
            <Flower className="inv-flower-b" />
            <Petals />
          </>
        )}
        {tpl === "modern" && <div className="inv-bigmono" aria-hidden="true">{initials}</div>}

        <div className="inv-cover-inner">
          {tpl === "elegant" && (
            <>
              <Corner className="c1" />
              <Corner className="c2" />
              <Corner className="c3" />
              <Corner className="c4" />
            </>
          )}
          <p className="inv-eyebrow">{inv.title}</p>
          <div className="inv-monogram" aria-hidden="true">
            {initials}
          </div>
          <h1>
            <span className="n">{inv.groomName}</span>
            <span className="amp">&amp;</span>
            <span className="n">{inv.brideName}</span>
          </h1>
          <p className="inv-cover-date">{inv.dateText}</p>
          <div className="inv-to">
            {guest ? (
              <>
                <small>Kepada Yth. Bapak/Ibu/Saudara/i</small>
                <strong>{guest.name}</strong>
              </>
            ) : (
              <small>Anda diundang ke acara kami</small>
            )}
          </div>
          {!opened && (
            <button className="inv-open" onClick={open}>
              Buka Undangan
            </button>
          )}
        </div>
        {!opened && <div className="inv-scrollhint" aria-hidden="true" />}
      </section>

      {tpl === "modern" && (
        <div className="inv-marquee" aria-hidden="true">
          <div>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i}>Save the date · {inv.dateText} ·&nbsp;</span>
            ))}
          </div>
        </div>
      )}

      {opened && (
        <main className="inv-main">
          {inv.musicUrl && (
            <button className="inv-music" data-playing={playing} onClick={toggleMusic} aria-label="Putar atau jeda musik">
              <IconNote />
            </button>
          )}

          {/* ---------- Pembuka ---------- */}
          <section className="inv-section inv-opening">
            <Reveal>
              <p className="inv-eyebrow">Save the Date</p>
              <Divider />
              <p className="inv-quote">{inv.openingText}</p>
            </Reveal>
          </section>

          {/* ---------- Mempelai ---------- */}
          <section className="inv-section inv-couple">
            <Reveal className="inv-person">
              <Portrait src={inv.groomPhoto} name={inv.groomName} />
              <h2>{inv.groomName}</h2>
              {inv.groomParents && <p>{inv.groomParents}</p>}
            </Reveal>
            <Reveal className="inv-amp" delay={120}>
              <span>&amp;</span>
            </Reveal>
            <Reveal className="inv-person" delay={240}>
              <Portrait src={inv.bridePhoto} name={inv.brideName} />
              <h2>{inv.brideName}</h2>
              {inv.brideParents && <p>{inv.brideParents}</p>}
            </Reveal>
          </section>

          {/* ---------- Acara ---------- */}
          <section className="inv-section inv-event">
            <Reveal>
              <p className="inv-eyebrow">Hari Bahagia</p>
              <h2>Waktu &amp; Tempat</h2>
              <Divider />
              <div className="inv-tiles">
                <div className="inv-tile">
                  <IconCalendar />
                  <small>Tanggal</small>
                  <strong>{inv.dateText}</strong>
                </div>
                <div className="inv-tile">
                  <IconClock />
                  <small>Pukul</small>
                  <strong>{inv.timeText}</strong>
                </div>
                {(inv.venueName || inv.venueAddress) && (
                  <div className="inv-tile">
                    <IconPin />
                    <small>Lokasi</small>
                    <strong>{inv.venueName || inv.venueAddress}</strong>
                    {inv.venueName && inv.venueAddress && <span>{inv.venueAddress}</span>}
                  </div>
                )}
              </div>
              <Countdown target={inv.eventISO} />
              <div className="inv-actions">
                <a className="inv-btn" href={calendarUrl(inv)} target="_blank" rel="noreferrer">
                  Simpan ke Kalender
                </a>
                {(inv.venueName || inv.venueAddress) && (
                  <a className="inv-btn ghost" href={mapsLink} target="_blank" rel="noreferrer">
                    Buka di Google Maps
                  </a>
                )}
              </div>
              {inv.mapEmbedUrl && (
                <iframe
                  className="inv-map"
                  src={inv.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta lokasi acara"
                />
              )}
            </Reveal>
          </section>

          {/* ---------- Galeri ---------- */}
          {inv.gallery.length > 0 && (
            <section className="inv-section inv-gallery">
              <Reveal>
                <p className="inv-eyebrow">Galeri</p>
                <h2>Momen Kami</h2>
                <Divider />
                <div className="inv-grid">
                  {inv.gallery.map((src) => (
                    <button key={src} type="button" onClick={() => setLightbox(src)} aria-label="Perbesar foto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          {/* ---------- RSVP & ucapan ---------- */}
          <section className="inv-section inv-rsvp">
            <Reveal>
              <p className="inv-eyebrow">RSVP &amp; Ucapan</p>
              <h2>Konfirmasi Kehadiran</h2>
              <Divider />
              <RsvpForm invitationId={inv.id} guest={guest} />
              {wishes.length > 0 && (
                <ul className="inv-wishes">
                  {wishes.map((w) => (
                    <li key={w.id}>
                      <span className="inv-avatar" aria-hidden="true">
                        {w.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <strong>{w.name}</strong>
                        <small>{w.when}</small>
                        <p>{w.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </section>

          {/* ---------- Penutup ---------- */}
          <footer className="inv-section inv-footer">
            <Reveal>
              <Divider />
              <p>{inv.closingText}</p>
              <h2>
                {inv.groomName} <span>&amp;</span> {inv.brideName}
              </h2>
            </Reveal>
          </footer>
        </main>
      )}

      {lightbox && (
        <div className="inv-lightbox" role="dialog" aria-label="Foto galeri" onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" />
          <button type="button" aria-label="Tutup">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
