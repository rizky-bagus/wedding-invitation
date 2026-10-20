/**
 * Seni SVG orisinal tahap tiga: renda, cermin emas, lengkung masjid, bulan sabit, dan ikon.
 * Warna: --gold (emas), --accent, --bg, --primary. Angka hasil hitung dibulatkan agar server dan klien identik.
 */
import { useId } from "react";

const f = (n: number) => Math.round(n * 100) / 100;
const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, "");

/* ============ Renda oval ============ */
/** Oval renda: tepi berlekuk, deretan lubang bundar, dan cincin renda dalam. Isi ditaruh di atasnya lewat CSS. */
export function LaceOval({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  const W = 300;
  const H = 400;
  const cx = W / 2;
  const cy = H / 2;

  const scallop = Array.from({ length: 260 }, (_, i) => {
    const a = (i / 260) * Math.PI * 2;
    const s = Math.abs(Math.sin((a * 40) / 2));
    return `${f(cx + (146 - 5 + 5 * s) * Math.cos(a))},${f(cy + (196 - 5 + 5 * s) * Math.sin(a))}`;
  }).join(" ");

  const ring = (n: number, rx: number, ry: number, r: number, offset = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((i + offset) / n) * Math.PI * 2;
      return <circle key={`${n}-${rx}-${i}`} cx={f(cx + rx * Math.cos(a))} cy={f(cy + ry * Math.sin(a))} r={r} style={{ fill: "var(--hole)" }} />;
    });

  const rosettes = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const x = f(cx + 122 * Math.cos(a));
    const y = f(cy + 172 * Math.sin(a));
    return (
      <g key={i} transform={`translate(${x} ${y})`} fill="none" stroke="#b8a58c" strokeWidth="1">
        <circle r="6.4" />
        <circle r="3.2" />
        {Array.from({ length: 6 }, (_, k) => (
          <ellipse key={k} cx="0" cy="-8.6" rx="2.2" ry="3.4" transform={`rotate(${k * 60})`} />
        ))}
      </g>
    );
  });

  return (
    <svg className={`inv-lace ${className}`} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#efe3d0" />
        </linearGradient>
        <filter id={`${gid}s`} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      <polygon points={scallop} fill={`url(#${gid}l)`} filter={`url(#${gid}s)`} />
      {ring(54, 134, 184, 3.1)}
      {ring(36, 108, 158, 1.8, 0.5)}
      {rosettes}
      <ellipse cx={cx} cy={cy} rx="98" ry="148" fill="none" stroke="#b8a58c" strokeWidth="1" />
      <ellipse cx={cx} cy={cy} rx="94" ry="144" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.4" />
    </svg>
  );
}

/* ============ Cermin emas ============ */
/** Bingkai cermin oval berornamen emas untuk hitung mundur. */
export function GoldMirror({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  const cx = 150;
  const cy = 176;
  const beads = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    return <circle key={i} cx={f(cx + 128 * Math.cos(a))} cy={f(cy + 152 * Math.sin(a))} r="3.4" fill={`url(#${gid}g)`} />;
  });
  return (
    <svg className={`inv-mirror ${className}`} viewBox="0 0 300 350" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc8a" />
          <stop offset="0.45" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#8a6a22" />
        </linearGradient>
        <radialGradient id={`${gid}r`} cx="0.4" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--bg) 82%, #d9c7aa)" }} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx="118" ry="142" fill={`url(#${gid}r)`} />
      <ellipse cx={cx} cy={cy} rx="124" ry="148" fill="none" stroke={`url(#${gid}g)`} strokeWidth="13" />
      <ellipse cx={cx} cy={cy} rx="131" ry="155" fill="none" stroke={`url(#${gid}g)`} strokeWidth="3" />
      <ellipse cx={cx} cy={cy} rx="116" ry="140" fill="none" stroke="#6b4f16" strokeOpacity="0.45" strokeWidth="1.2" />
      {beads}
      {/* mahkota di puncak */}
      <g fill={`url(#${gid}g)`}>
        <path d="M150 6 C 138 14, 138 28, 150 34 C 162 28, 162 14, 150 6Z" />
        <path d="M150 34 C 128 24, 104 28, 96 44 C 112 40, 130 44, 150 52 C 170 44, 188 40, 204 44 C 196 28, 172 24, 150 34Z" />
        <circle cx="150" cy="3" r="3.6" />
      </g>
      {/* kaki di dasar */}
      <g fill={`url(#${gid}g)`}>
        <path d="M150 346 C 136 338, 136 324, 150 316 C 164 324, 164 338, 150 346Z" />
        <path d="M150 318 C 126 330, 102 326, 94 308 C 112 314, 130 308, 150 300 C 170 308, 188 314, 206 308 C 198 326, 174 330, 150 318Z" />
      </g>
    </svg>
  );
}

/* ============ Lengkung masjid ============ */
/** Lengkung runcing ala mihrab dengan bingkai ganda emas. Isi ditaruh di atasnya lewat CSS. */
export function PointedArch({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  const outer = "M16 404 V162 C 16 96, 92 52, 150 8 C 208 52, 284 96, 284 162 V404 Z";
  const inner = "M30 404 V166 C 30 104, 100 62, 150 24 C 200 62, 270 104, 270 166 V404 Z";
  const innermost = "M40 404 V170 C 40 112, 106 72, 150 38 C 194 72, 260 112, 260 170 V404 Z";
  return (
    <svg className={`inv-arch-svg ${className}`} viewBox="0 0 300 410" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc8a" />
          <stop offset="0.5" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#8a6a22" />
        </linearGradient>
        <filter id={`${gid}s`} x="-10%" y="-6%" width="120%" height="115%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <path d={outer} fill="#fffaf0" filter={`url(#${gid}s)`} />
      <path d={outer} fill="none" stroke={`url(#${gid}g)`} strokeWidth="5" />
      <path d={inner} fill="none" stroke={`url(#${gid}g)`} strokeWidth="1.6" />
      <path d={innermost} fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="2 5" />
    </svg>
  );
}

/** Bulan sabit dan bintang. */
export function Crescent({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-crescent ${className}`} viewBox="0 0 60 60" aria-hidden="true">
      {/* busur dalam harus berjari-jari >= setengah jarak ujung (24), kalau tidak ketebalan sabit menjadi nol */}
      <path d="M36 6 A24 24 0 1 0 36 54 A31 31 0 0 1 36 6Z" style={{ fill: "var(--gold)" }} />
      <path d="M46 20 l2.6 5.6 6.1.7 -4.5 4.2 1.2 6 -5.4 -3 -5.4 3 1.2 -6 -4.5 -4.2 6.1 -.7z" style={{ fill: "var(--gold)" }} />
    </svg>
  );
}

/* ============ Pemisah emas ============ */
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-golddiv ${className}`} viewBox="0 0 240 24" aria-hidden="true">
      <path d="M0 12H86M154 12H240" fill="none" strokeWidth="1.2" style={{ stroke: "var(--gold)" }} />
      <path d="M120 3l9 9-9 9-9-9z" style={{ fill: "var(--gold)" }} />
      <path d="M96 12c6-8 14-8 18 0M144 12c-6-8-14-8-18 0" fill="none" strokeWidth="1.2" style={{ stroke: "var(--gold)" }} />
      <circle cx="92" cy="12" r="2.2" style={{ fill: "var(--gold)" }} />
      <circle cx="148" cy="12" r="2.2" style={{ fill: "var(--gold)" }} />
    </svg>
  );
}

/* ============ Ikon garis ============ */
const L = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function IconCandle() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <path d="M9 21V11h6v10M7 21h10M12 11V8M12 8c-1.6-1.6-1.6-3.2 0-4.4 1.6 1.2 1.6 2.8 0 4.4z" />
    </svg>
  );
}

export function IconLantern() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <path d="M12 2v3M9 5h6M8 5c-3 2-3 11 0 13h8c3-2 3-11 0-13M8 18l1 3h6l1-3M12 7v9M9 9c1 2 1 5 0 7M15 9c-1 2-1 5 0 7" />
    </svg>
  );
}
