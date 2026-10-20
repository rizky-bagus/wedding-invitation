/**
 * Seni SVG orisinal tahap dua: bunga, pita, kain satin, plakat, dan piringan hitam.
 * Warna mengikuti CSS variable undangan: --primary, --bg, --text, --accent.
 * Semua angka hasil hitung dibulatkan agar HTML server dan klien identik (hindari hydration mismatch).
 */
import { useId } from "react";

const f = (n: number) => Math.round(n * 100) / 100;
const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, "");

const LEAF = "color-mix(in srgb, var(--accent) 22%, #4f7a4a)";

/* ============ Calla lily ============ */
function Calla({ x, y, s = 1, rot = 0, tone, gid }: { x: number; y: number; s?: number; rot?: number; tone: "white" | "wine"; gid: string }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${rot}) scale(${s})`}>
      {/* batang */}
      <path d="M0 170 C 4 120, -6 90, 0 52" fill="none" strokeWidth="3.2" strokeLinecap="round" style={{ stroke: LEAF }} />
      {/* daun panjang */}
      <path d="M0 168 C -34 140, -40 96, -22 60 C -14 92, -6 128, 0 168Z" style={{ fill: LEAF }} opacity="0.92" />
      <path d="M2 168 C 30 150, 44 112, 38 78 C 24 104, 10 136, 2 168Z" style={{ fill: LEAF }} opacity="0.8" />
      {/* spatha berbentuk corong */}
      <path
        d="M0 56 C -34 52, -40 8, -14 -16 C -2 -30, 20 -28, 26 -8 C 32 14, 20 42, 0 56Z"
        fill={`url(#${gid}${tone})`}
        strokeWidth="0.8"
        style={{ stroke: tone === "white" ? "#cfc7b8" : "color-mix(in srgb, var(--accent) 60%, #000)" }}
      />
      {/* lipatan dalam */}
      <path d="M-4 52 C -22 34, -16 4, 4 -8 C 6 14, 4 36, -4 52Z" fill="#000" opacity={tone === "white" ? 0.06 : 0.22} />
      {/* spadix */}
      <ellipse cx="-2" cy="22" rx="4.6" ry="19" fill="#e5b92c" />
      <ellipse cx="-3" cy="18" rx="1.8" ry="12" fill="#f6dc7a" opacity="0.8" />
    </g>
  );
}

export function LilyCluster({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 220 240" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}white`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e4dccd" />
        </linearGradient>
        <linearGradient id={`${gid}wine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--accent) 80%, #fff)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--accent) 70%, #000)" }} />
        </linearGradient>
      </defs>
      {Calla({ x: 70, y: 36, s: 1.05, rot: -14, tone: "white", gid })}
      {Calla({ x: 126, y: 54, s: 0.92, rot: 12, tone: "wine", gid })}
      {Calla({ x: 38, y: 76, s: 0.78, rot: -26, tone: "white", gid })}
    </svg>
  );
}

/* ============ Dahlia ============ */
function DahliaFlower({ cx, cy, r, tone = 0 }: { cx: number; cy: number; r: number; tone?: number }) {
  const rings = [
    { n: 16, len: 1, wid: 0.2, mix: 0, o: 1 },
    { n: 14, len: 0.78, wid: 0.22, mix: 12, o: 1 },
    { n: 12, len: 0.58, wid: 0.25, mix: 26, o: 1 },
    { n: 9, len: 0.38, wid: 0.3, mix: 42, o: 1 },
  ];
  const k = r / 50;
  return (
    <g transform={`translate(${f(cx)} ${f(cy)}) scale(${f(k)})`}>
      {rings.map((ring, ri) =>
        Array.from({ length: ring.n }, (_, i) => {
          const L = 46 * ring.len;
          const W = 46 * ring.wid;
          return (
            <path
              key={`${ri}-${i}`}
              d={`M0 0 C ${f(W)} ${f(-L * 0.35)}, ${f(W)} ${f(-L * 0.7)}, 0 ${f(-L)} C ${f(-W)} ${f(-L * 0.7)}, ${f(-W)} ${f(-L * 0.35)}, 0 0Z`}
              transform={`rotate(${f((360 / ring.n) * i + ri * 11 + tone * 7)})`}
              style={{ fill: `color-mix(in srgb, var(--accent) ${100 - ring.mix}%, #fff)` }}
              stroke="#000"
              strokeOpacity="0.18"
              strokeWidth="0.7"
            />
          );
        }),
      )}
      <circle r="4" style={{ fill: "color-mix(in srgb, var(--accent) 60%, #000)" }} />
    </g>
  );
}

export function DahliaCluster({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 220 220" aria-hidden="true">
      {/* daun */}
      {[
        [34, 150, -40],
        [64, 176, -12],
        [150, 168, 26],
        [182, 120, 64],
        [30, 100, -66],
      ].map(([x, y, rot], i) => (
        <ellipse key={i} cx={x} cy={y} rx="30" ry="11" transform={`rotate(${rot} ${x} ${y})`} style={{ fill: LEAF }} opacity="0.92" />
      ))}
      {DahliaFlower({ cx: 98, cy: 96, r: 62, tone: 0 })}
      {DahliaFlower({ cx: 170, cy: 150, r: 36, tone: 1 })}
      {DahliaFlower({ cx: 46, cy: 168, r: 30, tone: 2 })}
    </svg>
  );
}

/* ============ Gambar garis: lavender dan daisy ============ */
function Lavender({ transform }: { transform: string }) {
  return (
    <g transform={transform} fill="none" strokeLinecap="round" style={{ stroke: "var(--ls, var(--primary))" }}>
      <path d="M0 120 C 4 84, 2 52, 6 14" strokeWidth="1.4" />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 14 + i * 9;
        const w = 5 - i * 0.18;
        return (
          <g key={i}>
            <ellipse cx={f(6 - w)} cy={y} rx={f(w * 0.9)} ry="3.3" transform={`rotate(-30 ${f(6 - w)} ${y})`} strokeWidth="1" />
            <ellipse cx={f(6 + w)} cy={y + 3} rx={f(w * 0.9)} ry="3.3" transform={`rotate(30 ${f(6 + w)} ${y + 3})`} strokeWidth="1" />
          </g>
        );
      })}
      <path d="M2 100 C -14 92, -20 80, -22 70 M3 90 C 18 84, 24 72, 24 64" strokeWidth="1.1" />
    </g>
  );
}

function Daisy({ cx, cy, r, rot = 0 }: { cx: number; cy: number; r: number; rot?: number }) {
  const k = r / 30;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${f(k)})`} fill="none" style={{ stroke: "var(--ls, var(--primary))" }} strokeWidth="1.5" strokeLinecap="round">
      {Array.from({ length: 10 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-19" rx="5.4" ry="12" transform={`rotate(${i * 36})`} />
      ))}
      <circle r="6.5" />
      <circle r="2.2" style={{ fill: "var(--ls, var(--primary))" }} stroke="none" />
    </g>
  );
}

/** Semprotan bunga garis tangan: lavender dan daisy. */
export function LineSpray({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      {Lavender({ transform: "translate(34 70) rotate(-20)" })}
      {Lavender({ transform: "translate(82 60) rotate(12) scale(0.9)" })}
      {Daisy({ cx: 48, cy: 46, r: 26, rot: 8 })}
      {Daisy({ cx: 112, cy: 40, r: 18, rot: -14 })}
      <path d="M48 72 C 44 100, 52 130, 40 170 M112 58 C 116 92, 104 124, 114 160" fill="none" strokeWidth="1.4" strokeLinecap="round" style={{ stroke: "var(--ls, var(--primary))" }} />
    </svg>
  );
}

/* ============ Pita satin ============ */
export function Bow({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 200 130" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--accent) 78%, #fff)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--accent)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--accent) 62%, #000)" }} />
        </linearGradient>
      </defs>
      {/* ekor pita */}
      <path d="M94 72 C 84 100, 66 114, 44 122 L 58 98 C 72 92, 86 84, 94 72Z" fill={`url(#${gid}b)`} />
      <path d="M106 72 C 116 100, 134 114, 156 122 L 142 98 C 128 92, 114 84, 106 72Z" fill={`url(#${gid}b)`} />
      {/* lingkar kiri dan kanan */}
      <path d="M100 64 C 62 8, 8 14, 10 58 C 12 104, 62 108, 100 72Z" fill={`url(#${gid}b)`} />
      <path d="M100 64 C 138 8, 192 14, 190 58 C 188 104, 138 108, 100 72Z" fill={`url(#${gid}b)`} />
      {/* kilau kain */}
      <path d="M24 52 C 40 30, 72 28, 92 56" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round" />
      <path d="M176 52 C 160 30, 128 28, 108 56" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 84 C 50 96, 76 94, 94 78" fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" />
      <path d="M170 84 C 150 96, 124 94, 106 78" fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" />
      {/* simpul */}
      <rect x="86" y="50" width="28" height="32" rx="10" fill={`url(#${gid}b)`} />
      <path d="M90 58 C 98 54, 104 54, 110 58" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ============ Gelombang kain satin ============ */
/** Pemisah antarbagian. Warna dasar dari --wave (warna bagian sebelumnya). */
export function SatinWave({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  return (
    <svg className={`inv-wave ${className}`} viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}hi`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${gid}sh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      {/* Isi di bawah lengkung berwarna --wave (warna bagian di bawahnya), sehingga tepi atas bagian itu tampak seperti kain. */}
      <path d="M0 30 C 140 96, 300 -6, 500 46 C 700 100, 860 4, 1000 40 L1000 120 L0 120Z" style={{ fill: "var(--wave)" }} />
      {/* kilau sutra */}
      <path d="M0 30 C 140 96, 300 -6, 500 46 C 700 100, 860 4, 1000 40 L1000 78 C 860 44, 700 138, 500 86 C 300 38, 140 128, 0 72Z" fill={`url(#${gid}hi)`} />
      {/* lipatan bayangan */}
      <path d="M0 72 C 140 128, 300 38, 500 86 C 700 138, 860 44, 1000 78 L1000 100 C 860 70, 700 150, 500 112 C 300 74, 140 150, 0 98Z" fill={`url(#${gid}sh)`} />
      <path d="M0 30 C 140 96, 300 -6, 500 46 C 700 100, 860 4, 1000 40" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
    </svg>
  );
}

/* ============ Plakat berlekuk ============ */
/** Oval dengan tepi berlekuk dan bingkai timbul; isi ditaruh di atasnya lewat CSS. */
export function ScallopPlaque({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  const W = 300;
  const H = 400;
  const pts = Array.from({ length: 220 }, (_, i) => {
    const a = (i / 220) * Math.PI * 2;
    const s = Math.abs(Math.sin((a * 30) / 2));
    const rx = 140 - 6 + 6 * s;
    const ry = 190 - 6 + 6 * s;
    return `${f(W / 2 + rx * Math.cos(a))},${f(H / 2 + ry * Math.sin(a))}`;
  }).join(" ");
  return (
    <svg className={`inv-plaque ${className}`} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--bg) 82%, #e8dccb)" }} />
        </linearGradient>
        <filter id={`${gid}d`} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <polygon points={pts} fill={`url(#${gid}p)`} filter={`url(#${gid}d)`} />
      <ellipse cx={W / 2} cy={H / 2} rx="118" ry="168" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="1.4" />
      <ellipse cx={W / 2} cy={H / 2} rx="122" ry="172" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.6" />
      <ellipse cx={W / 2} cy={H / 2} rx="104" ry="154" fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="0.9" strokeDasharray="2 5" />
    </svg>
  );
}

/* ============ Piringan hitam ============ */
export function Vinyl({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-vinyl ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#17120f" />
      {[44, 40, 36, 32, 28].map((r) => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="0.8" />
      ))}
      <path d="M50 8 A42 42 0 0 1 92 50" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="50" r="16" style={{ fill: "var(--accent)" }} />
      <circle cx="50" cy="50" r="12" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="2.6" fill="#17120f" />
    </svg>
  );
}

/* ============ Ikon garis tambahan ============ */
const L = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function IconCake() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <path d="M5 20V13h14v7M3 20h18M5 13c2-2 4 2 7 0s5 2 7 0M12 13V9M12 9c-1.2-1.4-1.2-2.6 0-3.6 1.2 1 1.2 2.2 0 3.6z" />
    </svg>
  );
}

export function IconChandelier() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <path d="M12 2v4M8 6h8M12 6c-4 0-6 3-6 6M12 6c4 0 6 3 6 6M12 6v9M3 12h18M6 12v3M18 12v3M9 18h6M12 15v6" />
    </svg>
  );
}
