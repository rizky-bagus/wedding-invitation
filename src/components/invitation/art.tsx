/** Seni SVG orisinal untuk template baru. Semua dibuat dari bentuk dasar, tanpa aset pihak ketiga. */

const f = (n: number) => Math.round(n * 100) / 100;

/* ---------- Segel lilin ---------- */
export function WaxSeal({ initials, className = "" }: { initials: string; className?: string }) {
  // Tepi bergelombang: r(θ) = 41 + 3·sin(11θ)
  const pts = Array.from({ length: 90 }, (_, i) => {
    const a = (i / 90) * Math.PI * 2;
    const r = 41 + 3 * Math.sin(11 * a);
    return `${f(50 + r * Math.cos(a))},${f(50 + r * Math.sin(a))}`;
  }).join(" ");
  return (
    <svg className={`inv-seal ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points={pts} fill="currentColor" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="24"
        fill="#fff"
        fillOpacity="0.9"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {initials}
      </text>
    </svg>
  );
}

/* ---------- Tepi kertas sobek ---------- */
export function TornEdge({ className = "" }: { className?: string }) {
  const pts: string[] = ["0,12"];
  for (let i = 0; i <= 100; i += 2) {
    const n = Math.sin(i * 1.7) * 0.5 + Math.sin(i * 0.63 + 1) * 0.35 + Math.sin(i * 3.1) * 0.15;
    pts.push(`${i},${f(6 + n * 4.2)}`);
  }
  pts.push("100,12");
  return (
    <svg className={`inv-torn ${className}`} viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={pts.join(" ")} fill="currentColor" />
    </svg>
  );
}

/* ---------- Bunga dan daun ---------- */
function Leaf({ x, y, rot, s = 1 }: { x: number; y: number; rot: number; s?: number }) {
  return (
    <ellipse
      cx={f(x)}
      cy={f(y)}
      rx={f(11 * s)}
      ry={f(4.4 * s)}
      transform={`rotate(${f(rot)} ${f(x)} ${f(y)})`}
      style={{ fill: "var(--leaf)" }}
    />
  );
}

/** Ranting dengan daun bergantian di sepanjang kurva Bezier. */
export function Sprig({ className = "" }: { className?: string }) {
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
    // Dibulatkan: hasil trigonometri bisa beda di digit terakhir antara Node dan browser (hydration mismatch).
    return { x: f(x), y: f(y), deg: f((Math.atan2(dy, dx) * 180) / Math.PI) };
  };
  return (
    <svg className={`inv-sprig ${className}`} viewBox="0 0 120 120" aria-hidden="true">
      <path d={`M${p0} C${p1} ${p2} ${p3}`} fill="none" strokeWidth="1.6" style={{ stroke: "var(--leaf)" }} />
      {Array.from({ length: 8 }, (_, i) => {
        const t = 0.14 + i * 0.105;
        const { x, y, deg } = at(t);
        const side = i % 2 ? 1 : -1;
        return <Leaf key={i} x={x} y={y} rot={f(deg + side * 42)} s={f(1.15 - i * 0.05)} />;
      })}
      {(() => {
        const tip = at(1);
        return <Leaf x={tip.x} y={tip.y} rot={tip.deg} s={1.1} />;
      })()}
    </svg>
  );
}

/** Bunga mawar sederhana dari kelopak bertumpuk. */
export function Bloom({ className = "", size = 64 }: { className?: string; size?: number }) {
  const layers = [
    { n: 7, r: 26, rx: 12, ry: 19, o: 0.55, off: 0 },
    { n: 6, r: 18, rx: 10, ry: 15, o: 0.75, off: 20 },
    { n: 5, r: 10, rx: 7, ry: 10, o: 0.95, off: 8 },
  ];
  return (
    <svg className={`inv-bloom ${className}`} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      {layers.map((l, li) =>
        Array.from({ length: l.n }, (_, i) => (
          <ellipse
            key={`${li}-${i}`}
            cx="50"
            cy={50 - l.r * 0.62}
            rx={l.rx}
            ry={l.ry}
            transform={`rotate(${l.off + (360 / l.n) * i} 50 50)`}
            style={{ fill: "var(--bloom)" }}
            fillOpacity={l.o}
            stroke="#fff"
            strokeOpacity="0.45"
            strokeWidth="0.8"
          />
        )),
      )}
      <circle cx="50" cy="50" r="4" style={{ fill: "var(--primary)" }} />
    </svg>
  );
}

/** Rangkaian sudut: dua ranting dan beberapa bunga. Diputar lewat CSS untuk sudut lain. */
export function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <div className={`inv-fc ${className}`} aria-hidden="true">
      <Sprig className="s1" />
      <Sprig className="s2" />
      <Bloom className="b1" size={78} />
      <Bloom className="b2" size={52} />
      <Bloom className="b3" size={38} />
    </div>
  );
}

/* ---------- Ikon garis untuk timeline ---------- */
const L = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function IconRings() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <circle cx="9" cy="15" r="5" />
      <circle cx="16" cy="15" r="5" />
      <path d="M7 6l2-2 2 2-2 3z" />
    </svg>
  );
}
export function IconPlate() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="3" />
      <path d="M3 4v6M5 4v6M3 7h2M21 4c-1.5 1-2 3-2 6h2z M21 10v10" />
    </svg>
  );
}
export function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
export function IconGlass() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <path d="M6 3h5l-.5 6a2.5 2.5 0 0 1-5 0zM8.5 11.5V19M6 19h5M13 3h5l-.5 6a2.5 2.5 0 0 1-5 0zM15.5 11.5V19M13 19h5" />
    </svg>
  );
}
export function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}
export function IconGift() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M3 9h18v-3H3zM12 6v14M12 6c-2-3-6-3-5 0M12 6c2-3 6-3 5 0" />
    </svg>
  );
}
export function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </svg>
  );
}
export function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" {...L} aria-hidden="true">
      <path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z" />
      <path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .7c-1-.5-1.8-1.3-2.2-2.2l.7-1-1-2z" />
    </svg>
  );
}

/** Pilih ikon dari kata kunci pada judul acara. */
export function iconFor(title: string) {
  const t = title.toLowerCase();
  if (/akad|ijab|nikah|pemberkatan|ceremony|upacara|janji/.test(t)) return <IconRings />;
  if (/resepsi|makan|jamuan|santap|dinner|lunch|reception|prasmanan/.test(t)) return <IconPlate />;
  if (/foto|photo|dokumentasi/.test(t)) return <IconCamera />;
  if (/toast|sambutan|salam|sungkem/.test(t)) return <IconGlass />;
  return <IconHeart />;
}

/* ---------- Siluet dress code ---------- */
export function SuitSilhouette() {
  return (
    <svg viewBox="0 0 48 90" className="inv-sil" aria-hidden="true">
      <circle cx="24" cy="9" r="7" fill="currentColor" />
      <path d="M10 22c4-3 8-4 14-4s10 1 14 4l4 30-6 2-2 34H20L18 54l-6-2z" fill="currentColor" />
      <path d="M24 18l-5 14 5 6 5-6z" fill="#fff" fillOpacity="0.9" />
    </svg>
  );
}
export function DressSilhouette() {
  return (
    <svg viewBox="0 0 54 90" className="inv-sil" aria-hidden="true">
      <circle cx="27" cy="9" r="7" fill="currentColor" />
      <path d="M19 20h16l3 22-5 3 14 43H7l14-43-5-3z" fill="currentColor" />
    </svg>
  );
}
