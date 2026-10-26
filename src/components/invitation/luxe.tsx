/**
 * Seni SVG orisinal template Luxe Gold: monogram karangan laurel dan sudut filigri.
 * Warna emas dari CSS variable undangan (--primary, --accent, --gold). Angka hasil hitung dibulatkan.
 */
const f = (n: number) => Math.round(n * 100) / 100;

/** Karangan laurel terbuka di puncak, dengan inisial di tengah (atau foto lewat CSS .lx-photo). */
export function LaurelWreath({ initials = "", className = "" }: { initials?: string; className?: string }) {
  const R = 74;
  const leaves = [-1, 1].flatMap((side) =>
    Array.from({ length: 13 }, (_, i) => {
      const t = i / 12;
      const a = (90 + side * (8 + t * 142)) * (Math.PI / 180); // dari bawah naik ke sisi atas
      const x = f(100 + R * Math.cos(a));
      const y = f(100 + R * Math.sin(a));
      const tangent = (a * 180) / Math.PI + (side > 0 ? 90 : -90);
      const size = 1 - t * 0.28;
      return [
        <path
          key={`o${side}${i}`}
          d="M0 0C4 -7 11 -7 16 0C11 7 4 7 0 0Z"
          transform={`translate(${x} ${y}) rotate(${f(tangent - side * 38)}) scale(${f(size)})`}
          style={{ fill: "var(--primary)" }}
        />,
        <path
          key={`i${side}${i}`}
          d="M0 0C4 -6 10 -6 14 0C10 6 4 6 0 0Z"
          transform={`translate(${x} ${y}) rotate(${f(tangent + side * 44)}) scale(${f(size * 0.85)})`}
          style={{ fill: "var(--accent)" }}
          opacity="0.8"
        />,
      ];
    }),
  );
  return (
    <svg className={`inv-art lx-wreath ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <path d={`M100 ${100 + R} A${R} ${R} 0 0 1 ${f(100 + R * Math.cos((240 * Math.PI) / 180))} ${f(100 + R * Math.sin((240 * Math.PI) / 180))}`} fill="none" strokeWidth="1.3" style={{ stroke: "var(--primary)" }} opacity="0.7" />
      <path d={`M100 ${100 + R} A${R} ${R} 0 0 0 ${f(100 + R * Math.cos((-60 * Math.PI) / 180))} ${f(100 + R * Math.sin((-60 * Math.PI) / 180))}`} fill="none" strokeWidth="1.3" style={{ stroke: "var(--primary)" }} opacity="0.7" />
      {leaves}
      <circle cx="100" cy="176" r="3.2" style={{ fill: "var(--accent)" }} />
      <path d="M90 180Q100 188 110 180" fill="none" strokeWidth="1.2" style={{ stroke: "var(--primary)" }} />
      {initials && (
        <text x="100" y="112" textAnchor="middle" className="lx-mono" style={{ fontFamily: "var(--font-heading)", fontSize: 38, fontWeight: 700 }}>
          {initials}
        </text>
      )}
    </svg>
  );
}

/** Sudut filigri berlapis: siku ganda, gulungan kecil, dan titik. Diputar lewat CSS untuk keempat sudut. */
export function FiligreeCorner({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art lx-corner ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 62V16C3 8 8 3 16 3H62" strokeWidth="1.4" />
        <path d="M10 54V20C10 14 14 10 20 10H54" strokeWidth="0.8" />
        <path d="M22 22C35 22 42 30 38 38C35 45 26 43 28 36C29 32 34 32 35 35" strokeWidth="1.1" />
        <path d="M45 10C50 14 56 14 60 10M10 45C14 50 14 56 10 60" strokeWidth="0.9" />
        <path d="M66 3C70 8 76 8 80 3M3 66C8 70 8 76 3 80" strokeWidth="0.9" />
      </g>
      <g fill="currentColor">
        <circle cx="62" cy="3" r="2" />
        <circle cx="3" cy="62" r="2" />
        <circle cx="22" cy="22" r="2.2" />
        <path d="M44 20l3-3 3 3-3 3z" />
        <path d="M20 44l3-3 3 3-3 3z" />
      </g>
    </svg>
  );
}
