/**
 * Seni SVG orisinal tahap enam: sakura (ranting bunga, ombak seigaiha, kelopak jatuh),
 * retro 70-an (matahari bergaris, gelombang, bunga daisy), hutan (pakis, jamur, kunang-kunang).
 * Warna dari CSS variable undangan (--primary, --bg, --text, --accent, --wave, --ridge2).
 * Semua angka hasil hitung dibulatkan agar HTML server dan klien identik.
 */
import { useId } from "react";
import { rnd } from "./scenery";

const f = (n: number) => Math.round(n * 100) / 100;
const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, "");

/* ============ Sakura ============ */
const PETAL_ANGLES = [0, 72, 144, 216, 288];

/** Bunga sakura lima kelopak bertakik di ujung. Dipanggil sebagai fungsi di dalam <svg>. */
function blossom(key: string, x: number, y: number, s: number, r: number) {
  return (
    <g key={key} transform={`translate(${f(x)} ${f(y)}) rotate(${f(r)}) scale(${f(s)})`}>
      {PETAL_ANGLES.map((a) => (
        <path
          key={a}
          transform={`rotate(${a})`}
          d="M0 0 C-8 -3 -8 -14 -2.4 -16 L0 -13.2 L2.4 -16 C8 -14 8 -3 0 0Z"
          style={{ fill: "color-mix(in srgb, var(--accent) 34%, #fff)", stroke: "var(--accent)" }}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      ))}
      {PETAL_ANGLES.map((a) => {
        const rad = ((a + 36) * Math.PI) / 180;
        const ex = f(5.2 * Math.sin(rad));
        const ey = f(-5.2 * Math.cos(rad));
        return (
          <g key={a}>
            <path d={`M0 0 L${ex} ${ey}`} style={{ stroke: "var(--primary)" }} strokeWidth="0.5" opacity="0.8" />
            <circle cx={ex} cy={ey} r="0.9" style={{ fill: "var(--primary)" }} />
          </g>
        );
      })}
      <circle r="1.8" style={{ fill: "var(--accent)" }} />
    </g>
  );
}

/** Ranting sakura berbunga, tumbuh dari sudut. */
export function BlossomBranch({ className = "" }: { className?: string }) {
  const wood = "#6b4a3a";
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 200 150" aria-hidden="true">
      <g fill="none" stroke={wood} strokeLinecap="round">
        <path d="M-6 18 C30 26 60 22 92 46 C118 64 138 62 168 96" strokeWidth="4.2" />
        <path d="M62 28 C64 14 72 8 82 4" strokeWidth="2.4" />
        <path d="M96 48 C104 66 100 82 108 98" strokeWidth="2.4" />
        <path d="M132 62 C146 50 160 46 176 40" strokeWidth="2.2" />
        <path d="M40 24 C36 40 28 48 20 58" strokeWidth="2.2" />
      </g>
      {[
        [116, 30, 3],
        [150, 82, 3],
        [60, 54, 2.6],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} style={{ fill: "var(--accent)" }} opacity="0.85" />
      ))}
      {blossom("a", 22, 58, 1, 10)}
      {blossom("b", 82, 6, 1.1, -8)}
      {blossom("c", 108, 100, 1, 24)}
      {blossom("d", 176, 40, 0.9, 40)}
      {blossom("e", 168, 98, 1.1, -18)}
      {blossom("f", 92, 46, 0.8, 52)}
      {blossom("g", 44, 28, 0.8, 18)}
      {blossom("h", 138, 62, 0.85, -30)}
    </svg>
  );
}

/** Kelopak sakura berguguran. Posisi dan kecepatan deterministik; geraknya diatur CSS (.petalfall i). */
export function PetalFall({ count = 16 }: { count?: number }) {
  return (
    <div className="petalfall" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const size = f(8 + rnd(i, 3) * 8);
        return (
          <i
            key={i}
            style={
              {
                left: `${f(rnd(i, 1) * 100)}%`,
                width: size,
                height: f(size * 0.8),
                animationDelay: `-${f(rnd(i, 4) * 14)}s`,
                animationDuration: `${f(11 + rnd(i, 5) * 9)}s`,
                "--dx": `${Math.round((rnd(i, 6) - 0.5) * 140)}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

/** Pola ombak seigaiha (lingkaran konsentris bertumpuk). Lapisan depan --wave, garis --ridge2. */
export function Seigaiha({ className = "" }: { className?: string }) {
  const pid = uid(useId());
  const circles: [number, number][] = [
    [10, -5],
    [0, 0],
    [20, 0],
    [10, 5],
    [0, 10],
    [20, 10],
    [10, 15],
  ];
  return (
    <svg className={`inv-art ${className}`} width="100%" height="60" aria-hidden="true">
      <defs>
        <pattern id={pid} width="20" height="10" patternUnits="userSpaceOnUse">
          {circles.map(([cx, cy]) => (
            <g key={`${cx}-${cy}`} fill="none" style={{ stroke: "var(--ridge2)" }} strokeWidth="0.7">
              <circle cx={cx} cy={cy} r="10" style={{ fill: "var(--wave)" }} />
              <circle cx={cx} cy={cy} r="7" />
              <circle cx={cx} cy={cy} r="4" />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="60" fill={`url(#${pid})`} />
    </svg>
  );
}

/* ============ Retro 70-an ============ */
/** Matahari setengah lingkaran dengan celah mendatar yang melebar ke bawah. */
export function RetroSun({ className = "" }: { className?: string }) {
  const cid = uid(useId());
  const bands: [number, number, number][] = [
    [8, 22, 100],
    [36, 15, 78],
    [58, 11, 56],
    [75, 8, 34],
    [88, 5, 14],
    [97, 3, 0],
  ];
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 200 100" aria-hidden="true">
      <defs>
        <clipPath id={`${cid}c`}>
          <path d="M8 100 A92 92 0 0 1 192 100Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid}c)`}>
        {bands.map(([y, h, mix]) => (
          <rect key={y} x="0" y={y} width="200" height={h} style={{ fill: `color-mix(in srgb, var(--accent) ${mix}%, var(--primary))` }} />
        ))}
      </g>
    </svg>
  );
}

/** Tiga pita bergelombang berwarna utama, aksen, dan teks. */
export function WaveStripes({ className = "" }: { className?: string }) {
  const wave = (y: number) => `M0 ${y} Q25 ${y - 10} 50 ${y} T100 ${y} T150 ${y} T200 ${y} T250 ${y} T300 ${y} T350 ${y} T400 ${y}`;
  const colors = ["var(--primary)", "var(--accent)", "var(--text)"];
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 400 52" preserveAspectRatio="none" aria-hidden="true">
      {[14, 26, 38].map((y, i) => (
        <path key={y} d={wave(y)} fill="none" stroke={colors[i]} strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

/** Bunga daisy 70-an: delapan kelopak bulat dan pusat bertingkat. */
export function Daisy70({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="-50 -50 100 100" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-27"
          rx="10"
          ry="19"
          transform={`rotate(${i * 45})`}
          style={{ fill: i % 2 ? "var(--accent)" : "color-mix(in srgb, var(--accent) 72%, var(--primary))" }}
        />
      ))}
      <circle r="15" style={{ fill: "var(--primary)" }} />
      <circle r="9" style={{ fill: "var(--bg)" }} />
      <circle r="4.2" style={{ fill: "var(--primary)" }} />
    </svg>
  );
}

/* ============ Hutan ============ */
/** Titik pada kurva Bezier kubik dan sudut singgungnya (derajat). */
function bezier(p: [number, number][], t: number) {
  const u = 1 - t;
  const x = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0];
  const y = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1];
  const dx = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0]);
  const dy = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1]);
  return { x, y, deg: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/** Daun pakis: tangkai melengkung dengan anak daun berpasangan yang mengecil ke ujung. */
export function Fern({ className = "" }: { className?: string }) {
  const stem: [number, number][] = [
    [60, 200],
    [58, 140],
    [70, 80],
    [98, 14],
  ];
  const leaves = Array.from({ length: 12 }, (_, i) => {
    const t = 0.16 + i * 0.07;
    const { x, y, deg } = bezier(stem, t);
    const len = 12 + 32 * (1 - t) * 1.1;
    const w = len * 0.26;
    return [-1, 1].map((side) => (
      <path
        key={`${i}${side}`}
        transform={`translate(${f(x)} ${f(y)}) rotate(${f(deg + side * 62)})`}
        d={`M0 0 Q${f(len / 2)} ${f(-w)} ${f(len)} 0 Q${f(len / 2)} ${f(w)} 0 0Z`}
        style={{ fill: `color-mix(in srgb, var(--primary) ${side < 0 ? 78 : 92}%, #fff)` }}
      />
    ));
  });
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 120 200" aria-hidden="true">
      <path d="M60 200 C58 140 70 80 98 14" fill="none" strokeWidth="2.2" strokeLinecap="round" style={{ stroke: "color-mix(in srgb, var(--primary) 70%, #000)" }} />
      {leaves}
    </svg>
  );
}

/** Sepasang jamur berbintik, besar dan kecil, dengan rumput di pangkalnya. */
export function Mushrooms({ className = "" }: { className?: string }) {
  const one = (key: string, tx: number, ty: number, s: number) => (
    <g key={key} transform={`translate(${tx} ${ty}) scale(${s})`}>
      <path d="M22 32 C23 44 21 52 17 58 L43 58 C39 52 37 44 38 32Z" fill="#f3e9d2" />
      <path d="M38 32 C37 44 39 52 43 58 L36 58 C34 52 33 44 33 32Z" fill="#000" opacity="0.1" />
      <path d="M4 34 C4 14 19 4 30 4 C43 4 56 14 56 34 C46 38 14 38 4 34Z" style={{ fill: "var(--accent)" }} />
      <path d="M4 34 C14 38 46 38 56 34 C56 36 54 38 52 39 C40 42 20 42 8 39 C6 38 4 36 4 34Z" fill="#000" opacity="0.18" />
      <circle cx="17" cy="20" r="4" fill="#fff" opacity="0.92" />
      <circle cx="32" cy="13" r="3.2" fill="#fff" opacity="0.92" />
      <circle cx="44" cy="23" r="4.6" fill="#fff" opacity="0.92" />
      <circle cx="29" cy="26" r="2.2" fill="#fff" opacity="0.92" />
    </g>
  );
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 110 70" aria-hidden="true">
      <g style={{ stroke: "color-mix(in srgb, var(--primary) 80%, #000)" }} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M2 68 C6 58 4 54 8 48 M12 68 C14 62 20 58 20 52 M96 68 C98 60 104 58 106 50 M104 68 C104 62 100 60 100 56" />
      </g>
      {one("a", 12, 8, 1)}
      {one("b", 64, 30, 0.62)}
    </svg>
  );
}

/** Kunang-kunang melayang. Posisi dalam persen, geraknya diatur CSS (.flies i). */
export function Fireflies({ count = 26 }: { count?: number }) {
  return (
    <div className="flies" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const size = f(3 + rnd(i, 3) * 3);
        return (
          <i
            key={i}
            style={
              {
                left: `${f(rnd(i, 1) * 100)}%`,
                top: `${f(rnd(i, 2) * 100)}%`,
                width: size,
                height: size,
                animationDelay: `-${f(rnd(i, 4) * 10)}s`,
                animationDuration: `${f(7 + rnd(i, 5) * 8)}s`,
                "--fx": `${Math.round((rnd(i, 6) - 0.5) * 60)}px`,
                "--fy": `${Math.round((rnd(i, 7) - 0.5) * 60)}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
