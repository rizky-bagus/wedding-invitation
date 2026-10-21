/**
 * Seni SVG orisinal tahap tujuh: washi (hanko, enso, ranting plum), tropis (monstera, daun pisang, hibiscus),
 * koran vintage (perangko, cap pos), rustic (lampu gantung, bunga liar).
 * Warna dari CSS variable undangan (--primary, --bg, --text, --accent).
 * Semua angka hasil hitung dibulatkan agar HTML server dan klien identik.
 */
import { useId } from "react";

const f = (n: number) => Math.round(n * 100) / 100;
const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, "");

/* ============ Washi ============ */
/** Stempel hanko persegi dengan inisial. */
export function Hanko({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 60 60" aria-hidden="true">
      <rect x="3" y="3" width="54" height="54" rx="6" style={{ fill: "var(--accent)" }} />
      <rect x="8" y="8" width="44" height="44" rx="3" fill="none" strokeWidth="1.6" style={{ stroke: "var(--bg)" }} />
      <text x="30" y="38.5" textAnchor="middle" style={{ fill: "var(--bg)", fontFamily: "var(--font-heading)", fontSize: 19, fontWeight: 700 }}>
        {initials}
      </text>
      {[
        [12, 14],
        [47, 20],
        [20, 49],
        [44, 46],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" style={{ fill: "var(--bg)" }} opacity="0.7" />
      ))}
    </svg>
  );
}

/** Lingkaran enso: satu sapuan kuas yang tidak tertutup. */
export function Enso({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M72 18 C50 3 11 21 11 52 C11 83 49 97 75 80 C93 68 95 40 80 25" fill="none" strokeWidth="7" strokeLinecap="round" style={{ stroke: "var(--text)" }} opacity="0.78" />
      <path d="M70 21 C50 9 17 25 17 52 C17 79 48 91 71 77" fill="none" strokeWidth="2" strokeLinecap="round" style={{ stroke: "var(--bg)" }} opacity="0.35" />
    </svg>
  );
}

/** Ranting plum ala lukisan tinta: batang tipis, beberapa bunga bulat. */
export function InkBranch({ className = "" }: { className?: string }) {
  const bloom = (key: string, x: number, y: number, s: number) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx="0" cy="-4.4" r="3.4" transform={`rotate(${a})`} style={{ fill: "var(--accent)" }} opacity="0.88" />
      ))}
      <circle r="1.6" style={{ fill: "var(--bg)" }} />
    </g>
  );
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 160 120" aria-hidden="true">
      <g fill="none" strokeLinecap="round" style={{ stroke: "var(--text)" }} opacity="0.85">
        <path d="M-4 104 C36 98 66 70 96 40 C108 28 120 22 140 16" strokeWidth="3.2" />
        <path d="M52 84 C60 66 62 52 58 36" strokeWidth="1.8" />
        <path d="M84 52 C92 64 104 70 118 72" strokeWidth="1.6" />
        <path d="M112 30 C116 40 124 46 132 48" strokeWidth="1.4" />
      </g>
      {bloom("a", 58, 34, 1.1)}
      {bloom("b", 120, 72, 1)}
      {bloom("c", 140, 16, 0.9)}
      {bloom("d", 132, 48, 0.8)}
      {bloom("e", 30, 94, 0.75)}
    </svg>
  );
}

/* ============ Tropis ============ */
/** Daun monstera berbelah. Belahan digambar dengan warna latar. */
export function Monstera({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 120 130" aria-hidden="true">
      <path d="M60 126 C20 110 2 70 14 38 C24 12 52 6 60 14 C68 6 96 12 106 38 C118 70 100 110 60 126Z" style={{ fill: "var(--primary)" }} />
      <path d="M60 14 C60 14 54 10 52 4 M60 126 L60 16" fill="none" strokeWidth="2.2" strokeLinecap="round" style={{ stroke: "color-mix(in srgb, var(--primary) 55%, #000)" }} />
      <g fill="none" strokeLinecap="round" strokeWidth="5" style={{ stroke: "var(--bg)" }}>
        <path d="M9 60 L40 66" />
        <path d="M12 86 L42 80" />
        <path d="M111 60 L80 66" />
        <path d="M108 86 L78 80" />
        <path d="M28 28 L47 46" />
        <path d="M92 28 L73 46" />
        <path d="M34 108 L50 94" />
        <path d="M86 108 L70 94" />
      </g>
      <g fill="none" strokeLinecap="round" strokeWidth="1" style={{ stroke: "color-mix(in srgb, var(--primary) 55%, #fff)" }} opacity="0.7">
        <path d="M60 50 L38 44 M60 50 L82 44 M60 74 L40 76 M60 74 L80 76 M60 98 L48 108 M60 98 L72 108" />
      </g>
    </svg>
  );
}

/** Daun pisang panjang dengan tulang daun dan sobekan. */
export function BananaLeaf({ className = "" }: { className?: string }) {
  const veins = Array.from({ length: 11 }, (_, i) => {
    const y = 18 + i * 12.5;
    const half = 22 * Math.sin(((y - 4) / 154) * Math.PI) + 2;
    return `M30 ${f(y)} L${f(30 - half)} ${f(y - 9)} M30 ${f(y)} L${f(30 + half)} ${f(y - 9)}`;
  }).join(" ");
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 60 160" aria-hidden="true">
      <path d="M30 158 C8 120 4 60 30 4 C56 60 52 120 30 158Z" style={{ fill: "color-mix(in srgb, var(--primary) 88%, #fff)" }} />
      <path d={veins} fill="none" strokeWidth="1" strokeLinecap="round" style={{ stroke: "color-mix(in srgb, var(--primary) 60%, #000)" }} opacity="0.55" />
      <path d="M30 158 L30 8" fill="none" strokeWidth="1.8" strokeLinecap="round" style={{ stroke: "color-mix(in srgb, var(--primary) 55%, #000)" }} />
      <path d="M6 70 L16 74 M54 90 L44 92 M8 100 L17 100" fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: "var(--bg)" }} />
    </svg>
  );
}

/** Bunga hibiscus lima kelopak dengan benang sari. */
export function Hibiscus({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="-40 -40 80 80" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          transform={`rotate(${a})`}
          d="M0 0 C-15 -6 -21 -25 -10 -33 C-4 -37 4 -37 10 -33 C21 -25 15 -6 0 0Z"
          style={{ fill: "var(--accent)", stroke: "color-mix(in srgb, var(--accent) 65%, #000)" }}
          strokeWidth="0.6"
        />
      ))}
      <circle r="8" style={{ fill: "color-mix(in srgb, var(--accent) 55%, #7a0a2a)" }} opacity="0.85" />
      <path d="M0 0 L17 -17" stroke="#f4c542" strokeWidth="1.6" strokeLinecap="round" />
      {[
        [17, -17],
        [14, -19],
        [19, -13],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.9" fill="#f4c542" />
      ))}
    </svg>
  );
}

/* ============ Koran vintage ============ */
/** Perangko bergerigi dengan inisial dan tahun. */
export function PostStamp({ initials, year, className = "" }: { initials: string; year: string; className?: string }) {
  const teeth: [number, number][] = [];
  for (let i = 0; i <= 8; i++) {
    teeth.push([i * 8 + 4, 0], [i * 8 + 4, 96]);
  }
  for (let j = 0; j <= 10; j++) {
    teeth.push([0, j * 9.6], [80, j * 9.6]);
  }
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 80 96" aria-hidden="true">
      <rect width="80" height="96" style={{ fill: "var(--bg)" }} />
      <rect x="0.5" y="0.5" width="79" height="95" fill="none" strokeWidth="1" style={{ stroke: "var(--text)" }} opacity="0.35" />
      {teeth.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" style={{ fill: "var(--paper, var(--bg))" }} />
      ))}
      <rect x="8" y="8" width="64" height="80" fill="none" strokeWidth="1.2" style={{ stroke: "var(--accent)" }} />
      <rect x="11" y="11" width="58" height="74" fill="none" strokeWidth="0.5" style={{ stroke: "var(--accent)" }} />
      <text x="40" y="44" textAnchor="middle" style={{ fill: "var(--accent)", fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700 }}>
        {initials}
      </text>
      <path d="M26 52 H54 M30 56 H50" strokeWidth="0.8" style={{ stroke: "var(--accent)" }} />
      <text x="40" y="76" textAnchor="middle" style={{ fill: "var(--text)", fontFamily: "var(--font-heading)", fontSize: 10, letterSpacing: 2 }}>
        {year}
      </text>
    </svg>
  );
}

/** Cap pos bulat dengan garis pembatal bergelombang. */
export function Postmark({ label, className = "" }: { label: string; className?: string }) {
  const pid = uid(useId());
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 150 80" aria-hidden="true">
      <defs>
        <path id={`${pid}a`} d="M20 40 A22 22 0 0 1 64 40" />
      </defs>
      <g fill="none" strokeWidth="1.6" style={{ stroke: "var(--text)" }} opacity="0.55">
        <circle cx="42" cy="40" r="34" />
        <circle cx="42" cy="40" r="28" strokeWidth="0.8" />
        <path d="M82 22 q10 -6 20 0 t20 0 t20 0 M82 34 q10 -6 20 0 t20 0 t20 0 M82 46 q10 -6 20 0 t20 0 t20 0 M82 58 q10 -6 20 0 t20 0 t20 0" />
      </g>
      <text textAnchor="middle" style={{ fill: "var(--text)", fontFamily: "var(--font-heading)", fontSize: 8.5, letterSpacing: 1.5 }} opacity="0.6">
        <textPath href={`#${pid}a`} startOffset="50%">
          {label}
        </textPath>
      </text>
      <text x="42" y="46" textAnchor="middle" style={{ fill: "var(--text)", fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700 }} opacity="0.6">
        &#9829;
      </text>
    </svg>
  );
}

/* ============ Rustic ============ */
/** Titik pada kurva Bezier kubik. */
function cubic(p: [number, number][], t: number): [number, number] {
  const u = 1 - t;
  return [
    u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
  ];
}

/** Lampu gantung: kabel melengkung dengan bohlam hangat yang berkedip pelan (.bulb di CSS). */
export function StringLights({ className = "" }: { className?: string }) {
  const segs: [number, number][][] = [0, 100, 200, 300].map((x0) => [
    [x0, 10],
    [x0 + 25, 40],
    [x0 + 75, 40],
    [x0 + 100, 10],
  ]);
  const bulbs = segs.flatMap((s, si) =>
    [0.14, 0.32, 0.5, 0.68, 0.86].map((t, ti) => {
      const [x, y] = cubic(s, t);
      return { x: f(x), y: f(y), k: si * 5 + ti };
    }),
  );
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 400 70" aria-hidden="true">
      <path d="M0 10 C25 40 75 40 100 10 S175 40 200 10 S275 40 300 10 S375 40 400 10" fill="none" strokeWidth="1.4" stroke="#3a2a1a" opacity="0.7" />
      {bulbs.map((b) => (
        <g key={b.k} className="bulb" style={{ animationDelay: `-${(b.k * 0.37) % 3}s` }}>
          <circle cx={b.x} cy={f(b.y + 9)} r="9" fill="#ffd98a" opacity="0.28" />
          <rect x={f(b.x - 1.6)} y={b.y} width="3.2" height="4" fill="#3a2a1a" opacity="0.8" />
          <circle cx={b.x} cy={f(b.y + 8)} r="3.8" fill="#ffe29a" stroke="#d9a441" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  );
}

/** Rangkaian bunga liar: batang melengkung dengan kepala daisy kecil. */
export function Wildflowers({ className = "" }: { className?: string }) {
  const head = (key: string, x: number, y: number, r: number, tone: number) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="0" cy={f(-r * 1.1)} rx={f(r * 0.42)} ry={f(r * 0.85)} transform={`rotate(${i * 45})`} style={{ fill: tone ? "var(--accent)" : "#fff8e6" }} opacity="0.95" />
      ))}
      <circle r={f(r * 0.5)} fill="#e0a526" />
    </g>
  );
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 120 140" aria-hidden="true">
      <g fill="none" strokeWidth="2" strokeLinecap="round" stroke="#5a7a3a">
        <path d="M30 140 C28 110 24 84 20 56" />
        <path d="M52 140 C54 104 62 76 70 40" />
        <path d="M76 140 C74 112 84 92 96 72" />
        <path d="M98 140 C100 120 106 106 112 92" />
        <path d="M40 124 C32 118 28 112 24 104 M62 112 C70 108 76 100 78 92" />
      </g>
      {head("a", 20, 56, 9, 0)}
      {head("b", 70, 40, 11, 1)}
      {head("c", 96, 72, 8, 0)}
      {head("d", 112, 92, 7, 1)}
      <ellipse cx="24" cy="102" rx="9" ry="4" transform="rotate(-30 24 102)" fill="#5a7a3a" opacity="0.8" />
      <ellipse cx="78" cy="92" rx="8" ry="3.6" transform="rotate(-40 78 92)" fill="#5a7a3a" opacity="0.8" />
    </svg>
  );
}
