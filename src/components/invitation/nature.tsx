/**
 * Seni SVG orisinal tahap empat: boho (pelangi lengkung, pampas, palem), art deco (sunburst), pantai (ombak, kerang).
 * Warna dari CSS variable undangan (--primary, --bg, --accent, --gold, --wave, --sea2).
 * Semua angka hasil hitung dibulatkan agar HTML server dan klien identik.
 */
import { useId } from "react";

const f = (n: number) => Math.round(n * 100) / 100;
const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, "");
const rad = (deg: number) => (deg * Math.PI) / 180;

/* ============ Boho: pelangi lengkung ============ */
/** Pelangi lengkung berlapis; isi ditaruh di dalam lengkung paling dalam lewat CSS. */
export function RainbowArch({ className = "" }: { className?: string }) {
  const arch = (r: number) => `M${150 - r} 330 V${150} A${r} ${r} 0 0 1 ${150 + r} ${150} V330`;
  return (
    <svg className={`inv-rainbow ${className}`} viewBox="0 0 300 330" preserveAspectRatio="none" aria-hidden="true">
      <path d={arch(139)} fill="none" strokeWidth="22" style={{ stroke: "var(--primary)" }} />
      <path d={arch(117)} fill="none" strokeWidth="22" style={{ stroke: "color-mix(in srgb, var(--primary) 45%, var(--bg))" }} />
      <path d={arch(95)} fill="none" strokeWidth="22" style={{ stroke: "var(--accent)" }} />
      <path d={`${arch(84)}Z`} style={{ fill: "color-mix(in srgb, var(--bg) 92%, #fff)" }} />
    </svg>
  );
}

/* ============ Boho: rumput pampas ============ */
export function Pampas({ className = "" }: { className?: string }) {
  const strands = Array.from({ length: 46 }, (_, i) => {
    const a = -30 + (60 * i) / 45; // sudut kipas, derajat dari vertikal
    const len = 74 + ((i * 37) % 38);
    const x1 = f(62 + Math.sin(rad(a)) * len);
    const y1 = f(118 - Math.cos(rad(a)) * len);
    const cx = f(62 + Math.sin(rad(a)) * len * 0.35 + (i % 2 ? 6 : -6));
    const cy = f(118 - Math.cos(rad(a)) * len * 0.62);
    return <path key={i} d={`M62 ${118 + (i % 5) * 4} Q${cx} ${cy} ${x1} ${y1}`} fill="none" strokeLinecap="round" strokeWidth={i % 4 === 0 ? 1.4 : 0.8} opacity={0.5 + (i % 5) * 0.1} style={{ stroke: "color-mix(in srgb, var(--accent) 38%, var(--bg))" }} />;
  });
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 124 270" aria-hidden="true">
      <path d="M62 270 C 58 220, 66 170, 62 120" fill="none" strokeWidth="2" strokeLinecap="round" style={{ stroke: "color-mix(in srgb, var(--accent) 60%, #7a6a4a)" }} />
      <path d="M60 266 C 34 250, 20 224, 16 196 C 36 214, 52 238, 60 266Z" style={{ fill: "color-mix(in srgb, var(--accent) 70%, #8a7a58)" }} opacity="0.75" />
      <path d="M64 262 C 90 244, 104 220, 108 194 C 88 212, 70 236, 64 262Z" style={{ fill: "color-mix(in srgb, var(--accent) 70%, #8a7a58)" }} opacity="0.6" />
      {strands}
    </svg>
  );
}

/* ============ Boho: daun palem kering ============ */
export function PalmFan({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  const fronds = Array.from({ length: 11 }, (_, i) => {
    const a = -75 + (150 * i) / 10;
    const len = 118 - Math.abs(a) * 0.35;
    return (
      <g key={i} transform={`rotate(${f(a)} 100 205)`}>
        <path
          d={`M100 205 C ${f(108)} ${f(205 - len * 0.3)}, ${f(106)} ${f(205 - len * 0.7)}, 100 ${f(205 - len)} C ${f(94)} ${f(205 - len * 0.7)}, ${f(92)} ${f(205 - len * 0.3)}, 100 205Z`}
          fill={`url(#${gid}p)`}
          opacity={0.9 - Math.abs(a) / 400}
        />
        <path d={`M100 205 L100 ${f(205 - len + 6)}`} stroke="#fff" strokeOpacity="0.28" strokeWidth="0.8" />
      </g>
    );
  });
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 200 215" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}p`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--primary) 85%, #5a3a22)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--primary) 40%, var(--bg))" }} />
        </linearGradient>
      </defs>
      {fronds}
      <path d="M100 205 L100 215" stroke="#6a4a2e" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ============ Art Deco: sunburst dan sudut ============ */
/** Setengah lingkaran sinar emas dengan busur konsentris. */
export function Sunburst({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  const rays = Array.from({ length: 21 }, (_, i) => {
    const a0 = Math.PI + (Math.PI * i) / 21;
    const a1 = Math.PI + (Math.PI * (i + 0.5)) / 21;
    const R = 188;
    const p = (a: number) => `${f(200 + R * Math.cos(a))} ${f(200 + R * Math.sin(a))}`;
    return <path key={i} d={`M200 200 L${p(a0)} L${p(a1)}Z`} fill={`url(#${gid}g)`} opacity={i % 2 ? 0.55 : 0.9} />;
  });
  return (
    <svg className={`inv-sunburst ${className}`} viewBox="0 0 400 200" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}g`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#8a6a22" />
          <stop offset="0.6" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#f3dc8a" />
        </linearGradient>
      </defs>
      {rays}
      {[196, 150, 104].map((r, i) => (
        <path key={r} d={`M${200 - r} 200 A${r} ${r} 0 0 1 ${200 + r} 200`} fill="none" strokeWidth={i === 0 ? 3 : 1.6} stroke="#c9a24a" />
      ))}
    </svg>
  );
}

/** Sudut berundak dengan kipas seperempat lingkaran. Diputar lewat CSS untuk sudut lain. */
export function DecoCorner({ className = "" }: { className?: string }) {
  const fan = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 2) * ((i + 0.5) / 6);
    return <path key={i} d={`M8 8 L${f(8 + 62 * Math.cos(a))} ${f(8 + 62 * Math.sin(a))}`} stroke="#c9a24a" strokeWidth="1.2" />;
  });
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M3 116 V22 H12 V12 H22 V3 H116" fill="none" stroke="#c9a24a" strokeWidth="1.6" />
      <path d="M10 116 V30 H19 V19 H30 V10 H116" fill="none" stroke="#c9a24a" strokeWidth="0.8" opacity="0.7" />
      {fan}
      <path d="M8 62 A54 54 0 0 0 62 8" fill="none" stroke="#c9a24a" strokeWidth="1.2" />
      <path d="M8 44 A36 36 0 0 0 44 8" fill="none" stroke="#c9a24a" strokeWidth="1" />
      <circle cx="8" cy="8" r="3.2" fill="#c9a24a" />
    </svg>
  );
}

/* ============ Pantai: ombak ============ */
/** Tepi atas bergelombang dua lapis. Warna depan --wave (warna bagian), lapisan belakang --sea2. */
export function OceanWave({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-wave ${className}`} viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 24 C 120 -4, 240 52, 380 26 C 520 0, 640 56, 780 28 C 880 8, 950 30, 1000 22 L1000 120 L0 120Z" style={{ fill: "var(--sea2)" }} opacity="0.55" />
      <path d="M0 46 C 130 18, 250 74, 400 46 C 540 20, 660 76, 800 48 C 900 28, 960 50, 1000 44 L1000 120 L0 120Z" style={{ fill: "var(--wave)" }} />
      <path d="M0 46 C 130 18, 250 74, 400 46 C 540 20, 660 76, 800 48 C 900 28, 960 50, 1000 44" fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="22 10" />
    </svg>
  );
}

/* ============ Pantai: kerang dan bintang laut ============ */
export function Shell({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  const ribs = Array.from({ length: 9 }, (_, i) => {
    const a = rad(200 + (140 * i) / 8);
    return <path key={i} d={`M40 62 L${f(40 + 60 * Math.cos(a))} ${f(62 + 60 * Math.sin(a))}`} stroke="#000" strokeOpacity="0.2" strokeWidth="1" />;
  });
  const outline = "M40 64 C 8 60, 0 30, 12 18 C 20 8, 32 4, 40 4 C 48 4, 60 8, 68 18 C 80 30, 72 60, 40 64Z";
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 80 72" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--accent) 45%, #fff)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent)" }} />
        </linearGradient>
        <clipPath id={`${gid}c`}>
          <path d={outline} />
        </clipPath>
      </defs>
      <path d={outline} fill={`url(#${gid}s)`} />
      <g clipPath={`url(#${gid}c)`}>{ribs}</g>
      <path d="M32 62 H48 L50 70 H30Z" style={{ fill: "color-mix(in srgb, var(--accent) 70%, #000)" }} />
    </svg>
  );
}

export function Starfish({ className = "" }: { className?: string }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = rad(-90 + i * 36);
    const r = i % 2 ? 11 : 30;
    return `${f(40 + r * Math.cos(a))},${f(40 + r * Math.sin(a))}`;
  }).join(" ");
  const dots = Array.from({ length: 5 }, (_, i) => {
    const a = rad(-90 + i * 72);
    return [0.4, 0.62, 0.82].map((k) => <circle key={`${i}-${k}`} cx={f(40 + 30 * k * Math.cos(a))} cy={f(40 + 30 * k * Math.sin(a))} r="1.3" fill="#fff" fillOpacity="0.7" />);
  });
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 80 80" aria-hidden="true">
      <polygon points={pts} strokeLinejoin="round" strokeWidth="5" style={{ fill: "var(--accent)", stroke: "var(--accent)" }} />
      {dots}
    </svg>
  );
}
