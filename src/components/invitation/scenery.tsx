/**
 * Seni SVG orisinal tahap lima: oriental (lampion), galaksi (bintang, bulan, rasi), pegunungan (punggung gunung, pinus).
 * Warna dari CSS variable undangan (--primary, --bg, --accent, --gold, --wave, --ridge2).
 * Semua angka hasil hitung dibulatkan agar HTML server dan klien identik.
 */
import { useId } from "react";

const f = (n: number) => Math.round(n * 100) / 100;
const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, "");
/** Pseudo-acak deterministik dari indeks (sama di server dan klien). Hash bilangan bulat (Math.imul) agar sebaran merata. */
const rnd = (i: number, k: number) => {
  let n = i * 131 + k * 7919 + 12345;
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
};

/* ============ Oriental: lampion ============ */
export function Lantern({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 60 150" aria-hidden="true">
      <defs>
        <radialGradient id={`${gid}r`} cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--primary) 70%, #ff6a5a)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--primary) 85%, #000)" }} />
        </radialGradient>
      </defs>
      <path d="M30 0 V20" stroke="#8a6a22" strokeWidth="1.6" />
      <rect x="21" y="18" width="18" height="9" rx="2.5" style={{ fill: "var(--gold)" }} />
      <ellipse cx="30" cy="60" rx="27" ry="33" fill={`url(#${gid}r)`} />
      {[19, 10, 0].map((rx) => (
        <ellipse key={rx} cx="30" cy="60" rx={rx || 0.01} ry="33" fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="0.9" />
      ))}
      <path d="M5 60 H55" stroke="var(--gold)" strokeOpacity="0.45" strokeWidth="0.8" />
      <rect x="21" y="91" width="18" height="9" rx="2.5" style={{ fill: "var(--gold)" }} />
      <circle cx="30" cy="104" r="2.6" style={{ fill: "var(--gold)" }} />
      {Array.from({ length: 7 }, (_, i) => {
        const x = 30 + (i - 3) * 2.6;
        return <path key={i} d={`M${f(x * 0.55 + 13.5)} 106 L${f(x)} ${f(130 + (i % 2) * 8)}`} stroke="var(--gold)" strokeWidth="1.1" strokeLinecap="round" />;
      })}
    </svg>
  );
}

/* ============ Galaksi: bintang, bulan, rasi ============ */
/** Taburan bintang berkelip. Posisi dalam persen, kelipnya diatur CSS (.stars i). */
export function StarField({ count = 90 }: { count?: number }) {
  return (
    <div className="stars" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const size = f(1 + rnd(i, 3) * 2.2);
        return (
          <i
            key={i}
            style={{
              left: `${f(rnd(i, 1) * 100)}%`,
              top: `${f(rnd(i, 2) * 100)}%`,
              width: size,
              height: size,
              animationDelay: `${f(rnd(i, 4) * 6)}s`,
              animationDuration: `${f(3 + rnd(i, 5) * 4)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function Moon({ className = "" }: { className?: string }) {
  const gid = uid(useId());
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={`${gid}g`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gid}m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="1" stopColor="#e9d9a0" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${gid}g)`} />
      <path d="M62 14 A38 38 0 1 0 62 86 A46 46 0 0 1 62 14Z" fill={`url(#${gid}m)`} />
    </svg>
  );
}

/** Rasi bintang bergaya gayung besar. */
export function Constellation({ className = "" }: { className?: string }) {
  const pts: [number, number][] = [
    [14, 84],
    [48, 70],
    [78, 60],
    [108, 46],
    [112, 80],
    [146, 84],
    [150, 44],
  ];
  const line = pts.map((p) => p.join(",")).join(" ");
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 170 110" aria-hidden="true">
      <polyline points={line} fill="none" strokeWidth="0.9" strokeDasharray="3 3" style={{ stroke: "var(--accent)" }} opacity="0.7" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5.5" style={{ fill: "var(--accent)" }} opacity="0.2" />
          <circle cx={x} cy={y} r="2" style={{ fill: "var(--accent)" }} />
        </g>
      ))}
    </svg>
  );
}

/** Kilau bintang empat sudut dengan titik kecil. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 80 80" aria-hidden="true">
      <path d="M40 4 C42 26 54 38 76 40 C54 42 42 54 40 76 C38 54 26 42 4 40 C26 38 38 26 40 4Z" style={{ fill: "var(--accent)" }} opacity="0.9" />
      <path d="M62 12 C62.6 17 65 19.4 70 20 C65 20.6 62.6 23 62 28 C61.4 23 59 20.6 54 20 C59 19.4 61.4 17 62 12Z" style={{ fill: "var(--accent)" }} opacity="0.7" />
      <circle cx="14" cy="64" r="2" style={{ fill: "var(--accent)" }} />
      <circle cx="66" cy="66" r="1.4" style={{ fill: "var(--accent)" }} />
    </svg>
  );
}

/* ============ Pegunungan ============ */
/** Punggung gunung dua lapis. Lapisan depan berwarna --wave, belakang --ridge2. */
export function MountainEdge({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-wave ${className}`} viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 44 L110 12 L200 46 L300 8 L400 48 L500 20 L620 50 L730 10 L850 44 L1000 16 V120 H0Z" style={{ fill: "var(--ridge2)" }} opacity="0.6" />
      <path d="M0 62 L90 30 L150 54 L240 16 L330 60 L420 32 L520 64 L610 24 L700 58 L800 20 L890 52 L1000 32 V120 H0Z" style={{ fill: "var(--wave)" }} />
      <path d="M240 16 L222 34 L236 30 L246 38 L258 28Z M610 24 L592 42 L606 38 L616 46 L628 36Z M800 20 L784 36 L796 33 L806 40 L816 31Z" fill="#fff" fillOpacity="0.75" />
    </svg>
  );
}

/** Tiga pinus berbeda tinggi. */
export function Pines({ className = "" }: { className?: string }) {
  const tree = (x: number, base: number, h: number, w: number, k: string) => (
    <g key={k}>
      <rect x={x - 2} y={base - 6} width="4" height="8" fill="#4a3322" />
      {[0, 1, 2].map((i) => {
        const top = base - h + i * (h * 0.26);
        const bottom = top + h * 0.5;
        const half = (w / 2) * (0.62 + i * 0.2);
        return <path key={i} d={`M${x} ${f(top)} L${f(x - half)} ${f(bottom)} L${f(x + half)} ${f(bottom)}Z`} style={{ fill: `color-mix(in srgb, var(--primary) ${96 - i * 10}%, #000)` }} />;
      })}
    </g>
  );
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 120 100" aria-hidden="true">
      {tree(24, 96, 64, 34, "a")}
      {tree(60, 98, 92, 46, "b")}
      {tree(98, 96, 70, 36, "c")}
    </svg>
  );
}
