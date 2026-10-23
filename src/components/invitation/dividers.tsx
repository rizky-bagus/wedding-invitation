/**
 * Pembatas judul khas tiap template, dan hiasan kecil pelengkap (tanda silang, titik-titik).
 * Semua memakai currentColor (warna diatur CSS .inv-divider). Template emas memakai --gold.
 * Angka hasil hitung dibulatkan agar HTML server dan klien identik.
 */
import { Divider } from "./ornaments";

const f = (n: number) => Math.round(n * 100) / 100;
const S = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

type Kind = "flourish" | "blossom" | "leaf" | "stars" | "waves" | "diamonds" | "ink" | "wheat" | "peaks" | "cloud" | "stamp";

function Shape({ kind }: { kind: Kind }) {
  switch (kind) {
    case "flourish":
      return (
        <>
          <path d="M0 10H60M140 10H200" {...S} strokeWidth="1" />
          <path d="M60 10C70 2 78 2 84 8C88 12 95 12 100 5C105 12 112 12 116 8C122 2 130 2 140 10" {...S} strokeWidth="1.2" />
          <path d="M100 12l3.4 3.4-3.4 3.4-3.4-3.4z" fill="currentColor" />
          <circle cx="54" cy="10" r="1.8" fill="currentColor" />
          <circle cx="146" cy="10" r="1.8" fill="currentColor" />
        </>
      );
    case "blossom":
      return (
        <>
          <path d="M0 10H72M128 10H200" {...S} strokeWidth="1" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx="100" cy="5.2" r="3.4" transform={`rotate(${a} 100 10)`} fill="currentColor" opacity="0.85" />
          ))}
          <circle cx="100" cy="10" r="1.8" style={{ fill: "var(--bg)" }} />
          <circle cx="82" cy="10" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="118" cy="10" r="2" fill="currentColor" opacity="0.7" />
          <circle cx="74" cy="10" r="1.2" fill="currentColor" opacity="0.5" />
          <circle cx="126" cy="10" r="1.2" fill="currentColor" opacity="0.5" />
        </>
      );
    case "leaf":
      return (
        <>
          <path d="M0 10H78M122 10H200" {...S} strokeWidth="1" />
          <path d="M100 15C93 15 87 11 83 4C92 4 98 8 100 15z" fill="currentColor" />
          <path d="M100 15C107 15 113 11 117 4C108 4 102 8 100 15z" fill="currentColor" />
          <path d="M100 15V19" {...S} strokeWidth="1.4" />
          {[48, 148].map((x) => (
            <path key={x} d={`M${x} 10C${x + 3} 5 ${x + 8} 4 ${x + 11} 5C${x + 8} 9 ${x + 4} 11 ${x} 10z`} fill="currentColor" opacity="0.7" />
          ))}
        </>
      );
    case "stars":
      return (
        <>
          <path d="M0 10H72M128 10H200" {...S} strokeWidth="1" strokeDasharray="2 4" />
          <path d="M100 1L102.8 7.2L109 10L102.8 12.8L100 19L97.2 12.8L91 10L97.2 7.2z" fill="currentColor" />
          {[80, 120].map((x) => (
            <path key={x} d={`M${x} 5.5L${x + 1.4} 8.6L${x + 4.5} 10L${x + 1.4} 11.4L${x} 14.5L${x - 1.4} 11.4L${x - 4.5} 10L${x - 1.4} 8.6z`} fill="currentColor" opacity="0.8" />
          ))}
          <circle cx="66" cy="10" r="1.2" fill="currentColor" />
          <circle cx="134" cy="10" r="1.2" fill="currentColor" />
        </>
      );
    case "waves":
      return (
        <>
          <path d="M16 8q7-6 14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0" {...S} strokeWidth="1.4" />
          <path d="M16 14q7-6 14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0" {...S} strokeWidth="1" opacity="0.55" />
        </>
      );
    case "diamonds":
      return (
        <>
          <path d="M0 10H52M148 10H200" {...S} strokeWidth="1" />
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
            const r = 6.4 - Math.abs(i) * 1.3;
            const x = 100 + i * 15;
            return <path key={i} d={`M${x} ${f(10 - r)}L${f(x + r)} 10L${x} ${f(10 + r)}L${f(x - r)} 10z`} fill={i % 2 === 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" />;
          })}
        </>
      );
    case "ink":
      return (
        <>
          <path d="M14 11C60 7 140 13 186 9C140 12 60 10 14 11z" fill="currentColor" opacity="0.85" />
          <circle cx="100" cy="10" r="2.6" fill="currentColor" />
          <rect x="170" y="4" width="8" height="8" rx="1.5" style={{ fill: "var(--accent)" }} transform="rotate(-6 174 8)" />
        </>
      );
    case "wheat":
      return (
        <>
          <path d="M0 10H64M136 10H200" {...S} strokeWidth="1" />
          <path d="M66 10H134" {...S} strokeWidth="1.2" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <ellipse cx={f(76 + i * 11)} cy="6.4" rx="2" ry="3.6" transform={`rotate(-28 ${f(76 + i * 11)} 6.4)`} fill="currentColor" opacity="0.85" />
              <ellipse cx={f(76 + i * 11)} cy="13.6" rx="2" ry="3.6" transform={`rotate(28 ${f(76 + i * 11)} 13.6)`} fill="currentColor" opacity="0.85" />
            </g>
          ))}
        </>
      );
    case "peaks":
      return (
        <>
          <path d="M0 16H62M138 16H200" {...S} strokeWidth="1" />
          <path d="M62 16L78 5L86 12L100 1L114 12L122 5L138 16z" {...S} strokeWidth="1.2" fill="currentColor" fillOpacity="0.18" />
          <path d="M100 1L96.5 5.5L100 4.6L103.5 5.5z" fill="currentColor" />
        </>
      );
    case "cloud":
      return (
        <>
          <path d="M0 10H64M136 10H200" {...S} strokeWidth="1" />
          <g {...S} strokeWidth="1.4">
            <path d="M100 13C95 7 87 7 85 12C83 17 89 19 92 15C94 12 91 10 89 12" />
            <path d="M100 13C105 7 113 7 115 12C117 17 111 19 108 15C106 12 109 10 111 12" />
          </g>
          <circle cx="100" cy="13.6" r="2" fill="currentColor" />
          <circle cx="70" cy="10" r="1.4" fill="currentColor" />
          <circle cx="130" cy="10" r="1.4" fill="currentColor" />
        </>
      );
    case "stamp":
      return (
        <>
          <path d="M0 8H82M118 8H200" {...S} strokeWidth="0.8" />
          <path d="M0 12H82M118 12H200" {...S} strokeWidth="2" />
          <g {...S} strokeWidth="1.3">
            <path d="M100 4V16M94.8 7L105.2 13M94.8 13L105.2 7" />
            <circle cx="100" cy="10" r="7" strokeWidth="0.8" />
          </g>
        </>
      );
  }
}

const KIND: Record<string, Kind> = {
  elegant: "flourish",
  renda: "flourish",
  satin: "flourish",
  floral: "blossom",
  sakura: "blossom",
  botanical: "leaf",
  hutan: "leaf",
  tropis: "leaf",
  lavender: "leaf",
  galaksi: "stars",
  islami: "stars",
  pantai: "waves",
  retro: "waves",
  deco: "diamonds",
  batik: "diamonds",
  washi: "ink",
  boho: "wheat",
  rustic: "wheat",
  gunung: "peaks",
  oriental: "cloud",
  koran: "stamp",
  envelope: "stamp",
  kraft: "stamp",
};

/** Pembatas khas template; template minimalis (modern, panel, poster) tetap memakai pembatas dasar. */
export function TemplateDivider({ tpl, gold = false }: { tpl: string; gold?: boolean }) {
  const kind = KIND[tpl];
  if (!kind) return <Divider />;
  return (
    <svg className="inv-divider" viewBox="0 0 200 20" aria-hidden="true" style={gold ? { color: "var(--gold)" } : undefined}>
      <Shape kind={kind} />
    </svg>
  );
}

/** Tanda silang kecil untuk sudut kartu (modern). */
export function Crosshair({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 0V14M0 7H14" {...S} strokeWidth="1" />
      <circle cx="7" cy="7" r="2.6" {...S} strokeWidth="0.8" />
    </svg>
  );
}

/** Kisi titik 5x5 untuk sudut panel. */
export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 60 60" aria-hidden="true">
      {Array.from({ length: 25 }, (_, i) => (
        <circle key={i} cx={6 + (i % 5) * 12} cy={6 + Math.floor(i / 5) * 12} r={i % 6 === 0 ? 2.4 : 1.4} fill="currentColor" opacity={i % 6 === 0 ? 0.9 : 0.55} />
      ))}
    </svg>
  );
}
