"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { markOpened, submitRsvp, type RsvpState } from "@/app/actions/public";
import { previewOverrides } from "@/lib/preview";
import { calendarMonth, cleanPhone, type GiftAccount, type ScheduleItem } from "@/lib/util";
import { Corner, Divider, Flower, IconCalendar, IconClock, IconNote, IconPin, Petals } from "./ornaments";
import { Bow, DahliaCluster, LilyCluster, LineSpray, SatinWave, ScallopPlaque, Vinyl } from "./flora";
import { Crescent, GoldDivider, GoldMirror, LaceOval, PointedArch } from "./heritage";
import { DecoCorner, OceanWave, PalmFan, Pampas, RainbowArch, Shell, Starfish, Sunburst } from "./nature";
import { Constellation, Lantern, MountainEdge, Moon, Pines, Sparkle, StarField } from "./scenery";
import { BlossomBranch, Daisy70, Fern, Fireflies, Mushrooms, PetalFall, RetroSun, Seigaiha, WaveStripes } from "./motifs";
import {
  DressSilhouette,
  FloralCorner,
  IconCopy,
  IconGift,
  IconWhatsApp,
  SuitSilhouette,
  TornEdge,
  WaxSeal,
  iconFor,
} from "./art";
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
  schedule: ScheduleItem[];
  dressCode: string;
  dressColors: string[];
  giftAccounts: GiftAccount[];
  giftNote: string;
  contactPhone: string;
  notes: string;
  template: string;
  primaryColor: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
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

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const SCRIPT_FONTS = ["Great Vibes", "Dancing Script", "Allura", "Pinyon Script", "Parisienne"];

/** Kalender bulan acara dengan tanggal acara ditandai. */
function Calendar({ iso }: { iso: string }) {
  const m = calendarMonth(new Date(iso));
  const cells: (number | null)[] = [
    ...Array<null>(m.offset).fill(null),
    ...Array.from({ length: m.days }, (_, i) => i + 1),
  ];
  return (
    <div className="inv-cal">
      <h3>{m.title}</h3>
      <div className="inv-cal-grid">
        {WEEKDAYS.map((d) => (
          <b key={d}>{d}</b>
        ))}
        {cells.map((c, i) =>
          c === null ? <span key={i} /> : (
            <span key={i} className={c === m.day ? "on" : undefined}>
              {c}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function GiftCard({ account }: { account: GiftAccount }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(account.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Salin nomor rekening:", account.number);
    }
  };
  return (
    <div className="inv-gift-card">
      <small>{account.bank}</small>
      <strong>{account.number}</strong>
      {account.holder && <span>a.n. {account.holder}</span>}
      <button type="button" className="inv-btn ghost" onClick={copy}>
        <IconCopy /> {copied ? "Tersalin" : "Salin nomor"}
      </button>
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
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="inv-hp" aria-hidden="true" />
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
  const [opening, setOpening] = useState(false); // animasi amplop sebelum konten tampil
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement>(null);

  const tpl = inv.template;
  const finishOpen = () => {
    setOpened(true);
    window.scrollTo({ top: 0 });
    if (guest?.id) void markOpened(guest.id);
  };
  const open = () => {
    // play() harus dipanggil langsung dari klik agar tidak diblokir browser.
    audio.current?.play().then(() => setPlaying(true)).catch(() => {});
    if (tpl === "envelope" || tpl === "kraft") {
      setOpening(true);
      setTimeout(finishOpen, 1500);
    } else {
      finishOpen();
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
    "--accent": inv.accentColor || inv.primaryColor,
    "--font-heading": `"${inv.headingFont}", serif`,
    "--font-body": `"${inv.bodyFont}", sans-serif`,
  } as React.CSSProperties;

  const fontQuery = [inv.headingFont, inv.bodyFont, ...(tpl === "islami" ? ["Amiri"] : [])]
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;700`)
    .join("&");

  const initials = `${inv.groomName.charAt(0)} & ${inv.brideName.charAt(0)}`.toUpperCase();
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [inv.venueName, inv.venueAddress].filter(Boolean).join(" "),
  )}`;
  const coverBg = inv.coverPhoto ? `url("${inv.coverPhoto.replace(/["\\\n]/g, encodeURIComponent)}")` : undefined;
  const waLink = inv.contactPhone
    ? `https://wa.me/${cleanPhone(inv.contactPhone)}?text=${encodeURIComponent(
        `Halo, saya ${guest?.name ?? "tamu undangan"} ingin mengonfirmasi kehadiran di pernikahan ${inv.groomName} & ${inv.brideName}.`,
      )}`
    : null;

  // Dekorasi per template: tepi kertas sobek, gelombang kain satin, dan rangkaian bunga di sudut.
  const botanical = tpl === "botanical";
  const satin = tpl === "satin";
  const kraft = tpl === "kraft";
  const lavender = tpl === "lavender";
  const renda = tpl === "renda";
  const batik = tpl === "batik";
  const islami = tpl === "islami";
  const boho = tpl === "boho";
  const deco = tpl === "deco";
  const pantai = tpl === "pantai";
  const oriental = tpl === "oriental";
  const galaksi = tpl === "galaksi";
  const gunung = tpl === "gunung";
  const sakura = tpl === "sakura";
  const retro = tpl === "retro";
  const hutan = tpl === "hutan";
  const gold = renda || batik || islami || deco || oriental; // template beraksen emas: pemisah dan bingkai berwarna emas
  const envelopeLike = tpl === "envelope" || kraft;
  const divider = gold ? <GoldDivider /> : <Divider />;
  const torn = botanical || kraft ? <TornEdge /> : null;
  const wave = satin ? <SatinWave /> : pantai ? <OceanWave /> : gunung ? <MountainEdge /> : null;
  /** Art Deco: empat sudut berundak di setiap kartu. */
  const frame = deco ? (
    <>
      <DecoCorner className="dc tl" />
      <DecoCorner className="dc tr" />
      <DecoCorner className="dc bl" />
      <DecoCorner className="dc br" />
    </>
  ) : null;
  /** Bunga khas template baru: calla lily (satin), dahlia (kraft), garis lavender (lavender). */
  const cluster = (pos: string) =>
    satin ? (
      <LilyCluster className={`dc ${pos}`} />
    ) : kraft ? (
      <DahliaCluster className={`dc ${pos}`} />
    ) : lavender ? (
      <LineSpray className={`dc ${pos}`} />
    ) : boho ? (
      <Pampas className={`dc ${pos}`} />
    ) : pantai ? (
      pos === "tl" || pos === "br" ? <Starfish className={`dc ${pos}`} /> : <Shell className={`dc ${pos}`} />
    ) : oriental ? (
      pos === "tl" || pos === "tr" ? <Lantern className={`dc ${pos}`} /> : null // lampion menggantung dari atas
    ) : galaksi ? (
      pos === "tr" || pos === "bl" ? <Constellation className={`dc ${pos}`} /> : <Sparkle className={`dc ${pos}`} />
    ) : gunung ? (
      pos === "bl" || pos === "br" ? <Pines className={`dc ${pos}`} /> : null // pinus tumbuh dari bawah
    ) : sakura ? (
      pos === "tl" || pos === "tr" ? <BlossomBranch className={`dc ${pos}`} /> : null // ranting menjuntai dari atas
    ) : retro ? (
      pos === "tr" || pos === "bl" ? <Daisy70 className={`dc ${pos}`} /> : null
    ) : hutan ? (
      pos === "tl" || pos === "tr" ? <Fern className={`dc ${pos}`} /> : <Mushrooms className={`dc ${pos}`} /> // pakis menggantung, jamur tumbuh dari bawah
    ) : null;
  const fc = (pos: string) => (botanical ? <FloralCorner className={pos} /> : cluster(pos));
  /** Hiasan tambahan hanya untuk template baru (botanical sudah cukup ramai). */
  const fcx = (pos: string) => (botanical ? null : cluster(pos));
  const bow = satin || kraft || renda ? <Bow className="bow" /> : null;

  const names = (
    <h1>
      <span className="n">{inv.groomName}</span>
      <span className="amp">&amp;</span>
      <span className="n">{inv.brideName}</span>
    </h1>
  );
  const toBlock = (
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
  );

  const hasGift = inv.giftAccounts.length > 0 || inv.giftNote;
  const hasDress = inv.dressCode || inv.dressColors.length > 0;

  return (
    <div
      className="inv"
      data-template={tpl}
      data-opened={opened}
      data-script={SCRIPT_FONTS.includes(inv.headingFont)}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fontQuery}&display=swap`} />
      {oriental && (
        // Hanya glyph 囍 yang diminta (&text=) agar unduhan font kecil.
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700&text=%E5%9B%8D&display=swap" />
      )}
      {galaksi && <StarField />}
      {hutan && <Fireflies />}
      {inv.musicUrl && <audio ref={audio} src={inv.musicUrl} loop preload="none" />}

      {/* ---------- Cover ---------- */}
      <section className="inv-cover">
        <div className="inv-cover-bg" style={!botanical && !satin && !kraft && !gold && !boho && !pantai && !galaksi && !gunung && !sakura && !retro && !hutan && coverBg ? { backgroundImage: coverBg } : undefined} />
        {lavender && (
          <>
            <LineSpray className="cv tl" />
            <LineSpray className="cv tr" />
          </>
        )}
        {tpl === "floral" && (
          <>
            <Flower className="inv-flower-a" />
            <Flower className="inv-flower-b" />
            <Petals />
          </>
        )}
        {tpl === "modern" && <div className="inv-bigmono" aria-hidden="true">{initials}</div>}
        {botanical && (
          <>
            <FloralCorner className="tl" />
            <FloralCorner className="br" />
          </>
        )}

        <div className="inv-cover-inner">
          {tpl === "elegant" && (
            <>
              <Corner className="c1" />
              <Corner className="c2" />
              <Corner className="c3" />
              <Corner className="c4" />
            </>
          )}

          {kraft && coverBg && (
            <div className="polaroid">
              <i style={{ backgroundImage: coverBg }} />
            </div>
          )}
          {envelopeLike ? (
            <div className="env" data-open={opening || opened}>
              <div className="env-back" />
              <div className="env-card">
                <p className="inv-eyebrow">{inv.title}</p>
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
              <div className="env-front" />
              <div className="env-flap" />
              <WaxSeal initials={initials} className="env-seal" />
              {kraft && (
                <>
                  <DahliaCluster className="env-fl l" />
                  <DahliaCluster className="env-fl r" />
                </>
              )}
            </div>
          ) : satin ? (
            <div className="plaque">
              <ScallopPlaque />
              <div className="plaque-body">
                <p className="inv-eyebrow">{inv.title}</p>
                {coverBg && <div className="inv-arch sm" style={{ backgroundImage: coverBg }} />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
              <WaxSeal initials={initials} className="plaque-seal" />
              <LilyCluster className="pl tl" />
              <LilyCluster className="pl br" />
            </div>
          ) : renda ? (
            <div className="lace">
              <LaceOval />
              <div className="lace-body">
                <p className="inv-eyebrow">{inv.title}</p>
                {coverBg && <div className="inv-arch sm oval" style={{ backgroundImage: coverBg }} />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
              <Bow className="lace-bow t" />
              <Bow className="lace-bow b" />
            </div>
          ) : islami ? (
            <div className="mihrab">
              <PointedArch />
              <Crescent className="mihrab-cres" />
              <div className="mihrab-body">
                <p className="inv-basmalah" lang="ar" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="inv-eyebrow">{inv.title}</p>
                {coverBg && <div className="inv-arch sm" style={{ backgroundImage: coverBg }} />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
            </div>
          ) : boho ? (
            <div className="rb">
              <RainbowArch />
              <div className="rb-body">
                <p className="inv-eyebrow">{inv.title}</p>
                {coverBg && <div className="inv-arch sm" style={{ backgroundImage: coverBg }} />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
              <Pampas className="rb-pm l" />
              <Pampas className="rb-pm r" />
              <PalmFan className="rb-palm" />
            </div>
          ) : deco ? (
            <div className="dk">
              <Sunburst />
              <div className="dk-card">
                <DecoCorner className="dc tl" />
                <DecoCorner className="dc tr" />
                <DecoCorner className="dc bl" />
                <DecoCorner className="dc br" />
                <p className="inv-eyebrow">{inv.title}</p>
                {coverBg && <div className="inv-arch sm" style={{ backgroundImage: coverBg }} />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
            </div>
          ) : oriental ? (
            <div className="or">
              <Lantern className="or-lt l" />
              <Lantern className="or-lt r" />
              <div className="or-card">
                <div className="or-xi" aria-hidden="true">
                  囍
                </div>
                <p className="inv-eyebrow">{inv.title}</p>
                {coverBg && <div className="inv-arch sm" style={{ backgroundImage: coverBg }} />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
            </div>
          ) : galaksi ? (
            <div className="gx">
              <Moon className="gx-moon" />
              <p className="inv-eyebrow">{inv.title}</p>
              {coverBg && <div className="inv-arch sm round" style={{ backgroundImage: coverBg }} />}
              {names}
              <Constellation className="gx-const" />
              <p className="inv-cover-date">{inv.dateText}</p>
            </div>
          ) : gunung ? (
            <div className="mt">
              <p className="inv-eyebrow">{inv.title}</p>
              {coverBg && <div className="inv-arch sm" style={{ backgroundImage: coverBg }} />}
              {names}
              <p className="inv-cover-date">{inv.dateText}</p>
              <Pines className="mt-pine l" />
              <Pines className="mt-pine r" />
            </div>
          ) : sakura ? (
            <div className="sk">
              <BlossomBranch className="sk-br l" />
              <BlossomBranch className="sk-br r" />
              <div className="sk-card">
                <p className="inv-eyebrow">{inv.title}</p>
                {coverBg ? <div className="inv-arch sm round" style={{ backgroundImage: coverBg }} /> : <i className="sk-sun" aria-hidden="true" />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
            </div>
          ) : retro ? (
            <div className="rt">
              <RetroSun className="rt-sun" />
              <div className="rt-card">
                <p className="inv-eyebrow">{inv.title}</p>
                {coverBg && <div className="inv-arch sm round" style={{ backgroundImage: coverBg }} />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
              <WaveStripes className="rt-waves" />
              <Daisy70 className="rt-daisy l" />
              <Daisy70 className="rt-daisy r" />
            </div>
          ) : hutan ? (
            <div className="fr">
              <Fern className="fr-fern l" />
              <Fern className="fr-fern r" />
              <div className="fr-card">
                <p className="inv-eyebrow">{inv.title}</p>
                {coverBg && <div className="inv-arch sm round" style={{ backgroundImage: coverBg }} />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
              <Mushrooms className="fr-mush" />
            </div>
          ) : pantai ? (
            <div className="sea">
              <Shell className="sea-shell" />
              <p className="inv-eyebrow">{inv.title}</p>
              {coverBg && <div className="inv-arch sm round" style={{ backgroundImage: coverBg }} />}
              {names}
              <p className="inv-cover-date">{inv.dateText}</p>
              <Starfish className="sea-star" />
            </div>
          ) : batik ? (
            <div className="bk">
              <div className="bk-band" />
              <div className="bk-body">
                <p className="inv-eyebrow">{inv.title}</p>
                <div className="bk-medal" aria-hidden="true" />
                {coverBg && <div className="inv-arch sm" style={{ backgroundImage: coverBg }} />}
                {names}
                <p className="inv-cover-date">{inv.dateText}</p>
              </div>
              <div className="bk-band" />
            </div>
          ) : lavender ? (
            <>
              <p className="inv-eyebrow">{inv.title}</p>
              <div className="lav-mono" aria-hidden="true">
                <span>{inv.groomName.charAt(0).toUpperCase()}</span>
                <i />
                <span>{inv.brideName.charAt(0).toUpperCase()}</span>
              </div>
              {names}
              <p className="inv-cover-date">{inv.dateText}</p>
            </>
          ) : (
            <>
              <p className="inv-eyebrow">{inv.title}</p>
              {botanical ? (
                <div className="inv-arch" style={coverBg ? { backgroundImage: coverBg } : undefined}>
                  {!coverBg && <span>{initials}</span>}
                </div>
              ) : (
                <div className="inv-monogram" aria-hidden="true">
                  {initials}
                </div>
              )}
              {names}
              <p className="inv-cover-date">{inv.dateText}</p>
            </>
          )}

          {toBlock}
          {!opened && (
            <button className="inv-open" onClick={open} disabled={opening}>
              {opening ? "Membuka..." : "Buka Undangan"}
            </button>
          )}
        </div>
        {pantai && <OceanWave className="cv-wave" />}
        {gunung && <MountainEdge className="cv-wave" />}
        {sakura && (
          <>
            <PetalFall />
            <Seigaiha className="sg" />
          </>
        )}
        {!opened && !opening && <div className="inv-scrollhint" aria-hidden="true" />}
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
              {satin || kraft || renda ? <Vinyl /> : <IconNote />}
            </button>
          )}

          {/* ---------- Pembuka ---------- */}
          <section className="inv-section inv-opening">
            {torn}{wave}{frame}
            {fc("tr")}
            <Reveal>
              {islami && (
                <p className="inv-basmalah" lang="ar" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}
              <p className="inv-eyebrow">Undangan</p>
              {divider}
              <p className="inv-quote">{inv.openingText}</p>
            </Reveal>
          </section>

          {/* ---------- Mempelai ---------- */}
          <section className="inv-section inv-couple">
            {fcx("tl")}
            {torn}{wave}{frame}
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

          {/* ---------- Tanggal: kalender + hitung mundur ---------- */}
          <section className="inv-section inv-date">
            {fcx("tr")}
            {torn}{wave}{frame}
            <Reveal>
              <p className="inv-eyebrow">Save the Date</p>
              <h2>{inv.dateText}</h2>
              {divider}
              <Calendar iso={inv.eventISO} />
              {renda ? (
                <div className="mirror">
                  <GoldMirror />
                  <div className="mirror-in">
                    <small>Menuju hari bahagia</small>
                    <Countdown target={inv.eventISO} />
                  </div>
                </div>
              ) : (
                <Countdown target={inv.eventISO} />
              )}
            </Reveal>
          </section>

          {/* ---------- Acara ---------- */}
          <section className="inv-section inv-event">
            {torn}{wave}{frame}
            {fc("bl")}
            <Reveal>
              <p className="inv-eyebrow">Hari Bahagia</p>
              <h2>Waktu &amp; Tempat</h2>
              {divider}
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

          {/* ---------- Rangkaian acara ---------- */}
          {inv.schedule.length > 0 && (
            <section className="inv-section inv-schedule">
              {torn}{wave}{frame}
              <Reveal>
                <p className="inv-eyebrow">Rangkaian Acara</p>
                <h2>Susunan Acara</h2>
                {divider}
                <ol className="inv-timeline">
                  {inv.schedule.map((s, i) => (
                    <li key={i}>
                      <span className="t">{s.time}</span>
                      <span className="dot" aria-hidden="true" />
                      <div className="c">
                        <span className="ico">{iconFor(s.title)}</span>
                        <strong>{s.title}</strong>
                        {s.note && <small>{s.note}</small>}
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </section>
          )}

          {/* ---------- Dress code ---------- */}
          {hasDress && (
            <section className="inv-section inv-dress">
              {torn}{wave}{frame}
              {fc("tr")}
              <Reveal>
                <p className="inv-eyebrow">Dress Code</p>
                <h2>Busana Tamu</h2>
                {divider}
                <div className="inv-sils">
                  <SuitSilhouette />
                  <DressSilhouette />
                </div>
                {inv.dressCode && <p>{inv.dressCode}</p>}
                {inv.dressColors.length > 0 && (
                  <div className="inv-swatches" aria-label="Warna yang disarankan">
                    {inv.dressColors.map((c) => (
                      <i key={c} style={{ background: c }} title={c} />
                    ))}
                  </div>
                )}
              </Reveal>
            </section>
          )}

          {/* ---------- Galeri ---------- */}
          {inv.gallery.length > 0 && (
            <section className="inv-section inv-gallery">
              {torn}{wave}{frame}
              <Reveal>
                <p className="inv-eyebrow">Galeri</p>
                <h2>Momen Kami</h2>
                {divider}
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

          {/* ---------- Hadiah ---------- */}
          {hasGift && (
            <section className="inv-section inv-gift">
              {fcx("tr")}
              {torn}{wave}{frame}
              <Reveal>
                {bow}
                <p className="inv-eyebrow">Tanda Kasih</p>
                <h2>Hadiah</h2>
                {divider}
                <span className="inv-giftico">
                  <IconGift />
                </span>
                {inv.giftNote && <p>{inv.giftNote}</p>}
                <div className="inv-gift-list">
                  {inv.giftAccounts.map((a, i) => (
                    <GiftCard key={i} account={a} />
                  ))}
                </div>
              </Reveal>
            </section>
          )}

          {/* ---------- RSVP & ucapan ---------- */}
          <section className="inv-section inv-rsvp">
            {fcx("tl")}
            {torn}{wave}{frame}
            <Reveal>
              <p className="inv-eyebrow">RSVP &amp; Ucapan</p>
              <h2>Konfirmasi Kehadiran</h2>
              {divider}
              {inv.notes && <p className="inv-note">{inv.notes}</p>}
              {waLink && (
                <a className="inv-btn inv-wa" href={waLink} target="_blank" rel="noreferrer">
                  <IconWhatsApp /> Konfirmasi via WhatsApp
                </a>
              )}
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
            {torn}{wave}{frame}
            {sakura && <Seigaiha className="sg" />}
            {retro && <WaveStripes className="rt-waves" />}
            {fc("br")}
            <Reveal>
              {divider}
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
