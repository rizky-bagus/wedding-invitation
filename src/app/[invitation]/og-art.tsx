/**
 * Hiasan SVG untuk gambar pratinjau (OG). Satori tidak mengenal CSS variable, jadi semua warna
 * dihitung dari warna tema dan ditulis eksplisit. Hanya bentuk dasar SVG yang dipakai.
 */

const f = (n: number) => Math.round(n * 100) / 100;

function rgb(hex: string): [number, number, number] {
  const h = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#b08968";
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

/** Campur dua warna hex: t = 0 -> a, t = 1 -> b. */
export function mix(a: string, b: string, t: number): string {
  const [ra, ga, ba] = rgb(a);
  const [rb, gb, bb] = rgb(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${c(ra, rb)}${c(ga, gb)}${c(ba, bb)}`;
}

/* ---------- Bunga dan ranting ---------- */
function Leaf({ x, y, rot, s, color }: { x: number; y: number; rot: number; s: number; color: string }) {
  return <ellipse cx={f(x)} cy={f(y)} rx={f(11 * s)} ry={f(4.4 * s)} transform={`rotate(${f(rot)} ${f(x)} ${f(y)})`} fill={color} />;
}

function Sprig({ leaf, transform }: { leaf: string; transform: string }) {
  const [p0, p1, p2, p3] = [
    [8, 112],
    [40, 86],
    [64, 44],
    [112, 14],
  ];
  const at = (t: number) => {
    const u = 1 - t;
    const x = u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0];
    const y = u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1];
    const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
    const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
    return { x, y, deg: (Math.atan2(dy, dx) * 180) / Math.PI };
  };
  const tip = at(1);
  return (
    <g transform={transform}>
      <path d={`M${p0} C${p1} ${p2} ${p3}`} fill="none" stroke={leaf} strokeWidth="1.8" />
      {/* Satori hanya menerima elemen SVG dasar: Leaf dipanggil sebagai fungsi, bukan komponen JSX. */}
      {Array.from({ length: 8 }, (_, i) => {
        const { x, y, deg } = at(0.14 + i * 0.105);
        return Leaf({ x, y, rot: deg + (i % 2 ? 1 : -1) * 42, s: 1.15 - i * 0.05, color: leaf });
      })}
      {Leaf({ x: tip.x, y: tip.y, rot: tip.deg, s: 1.1, color: leaf })}
    </g>
  );
}

function Bloom({ cx, cy, size, petal, center }: { cx: number; cy: number; size: number; petal: string; center: string }) {
  const layers = [
    { n: 7, r: 26, rx: 12, ry: 19, o: 0.6, off: 0 },
    { n: 6, r: 18, rx: 10, ry: 15, o: 0.8, off: 20 },
    { n: 5, r: 10, rx: 7, ry: 10, o: 1, off: 8 },
  ];
  const k = size / 100;
  return (
    <g transform={`translate(${cx - 50 * k} ${cy - 50 * k}) scale(${k})`}>
      {layers.map((l, li) =>
        Array.from({ length: l.n }, (_, i) => (
          <ellipse
            key={`${li}-${i}`}
            cx="50"
            cy={f(50 - l.r * 0.62)}
            rx={l.rx}
            ry={l.ry}
            transform={`rotate(${f(l.off + (360 / l.n) * i)} 50 50)`}
            fill={petal}
            fillOpacity={l.o}
            stroke="#ffffff"
            strokeOpacity="0.5"
            strokeWidth="0.9"
          />
        )),
      )}
      <circle cx="50" cy="50" r="4.5" fill={center} />
    </g>
  );
}

/** Rangkaian bunga di satu sudut. flipX/flipY memutar ke sudut lain. */
export function FloralCorner({
  primary,
  size = 330,
  flipX = false,
  flipY = false,
  style,
}: {
  primary: string;
  size?: number;
  flipX?: boolean;
  flipY?: boolean;
  style: React.CSSProperties;
}) {
  const leaf = mix(primary, "#5a8a52", 0.82);
  const petal = mix(primary, "#ffffff", 0.35);
  const mirror = `translate(${flipX ? 220 : 0} ${flipY ? 220 : 0}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})`;
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" style={{ position: "absolute", ...style }}>
      <g transform={mirror}>
        {Sprig({ leaf, transform: "translate(18 40) rotate(96 60 60)" })}
        {Sprig({ leaf, transform: "translate(42 2) rotate(8 60 60)" })}
        {Bloom({ cx: 39, cy: 39, size: 78, petal, center: primary })}
        {Bloom({ cx: 92, cy: 38, size: 52, petal: mix(petal, "#ffffff", 0.2), center: primary })}
        {Bloom({ cx: 31, cy: 95, size: 40, petal: mix(petal, primary, 0.25), center: primary })}
      </g>
    </svg>
  );
}

/* ---------- Sudut berhias (elegant, panel, modern) ---------- */
export function FlourishCorner({
  size = 150,
  flipX = false,
  flipY = false,
  style,
}: {
  size?: number;
  flipX?: boolean;
  flipY?: boolean;
  style: React.CSSProperties;
}) {
  const mirror = `translate(${flipX ? 120 : 0} ${flipY ? 120 : 0}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})`;
  const c = "#ffffff";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ position: "absolute", ...style }}>
      <g transform={mirror} opacity="0.9">
        <path d="M4 116V34C4 17 17 4 34 4h82" stroke={c} strokeWidth="1.8" fill="none" />
        <path d="M14 116V44c0-16 14-30 30-30h72" stroke={c} strokeWidth="1" fill="none" />
        <path d="M26 26c10 0 16 6 16 16 0-10 6-16 16-16-10 0-16-6-16-16 0 10-6 16-16 16z" fill={c} />
        <circle cx="4" cy="116" r="3" fill={c} />
        <circle cx="116" cy="4" r="3" fill={c} />
      </g>
    </svg>
  );
}

/* ---------- Segel lilin (envelope) ---------- */
export function WaxSeal({ primary, size = 132 }: { primary: string; size?: number }) {
  const pts = Array.from({ length: 90 }, (_, i) => {
    const a = (i / 90) * Math.PI * 2;
    const r = 41 + 3 * Math.sin(11 * a);
    return `${f(50 + r * Math.cos(a))},${f(50 + r * Math.sin(a))}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0 }}>
      <polygon points={pts} fill={mix(primary, "#7d1f2d", 0.55)} />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------- Pemisah ---------- */
export function Divider({ width = 260 }: { width?: number }) {
  return (
    <svg width={width} height={22} viewBox="0 0 200 20">
      <path d="M0 10H78M122 10H200" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.2" fill="none" />
      <path d="M100 2l8 8-8 8-8-8z" fill="#ffffff" fillOpacity="0.95" />
      <circle cx="84" cy="10" r="2" fill="#ffffff" />
      <circle cx="116" cy="10" r="2" fill="#ffffff" />
    </svg>
  );
}
