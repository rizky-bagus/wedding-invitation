/** Ornamen SVG dekoratif. Semuanya memakai currentColor agar ikut warna tema. */

export function Divider() {
  return (
    <svg className="inv-divider" viewBox="0 0 200 20" aria-hidden="true">
      <path d="M0 10H78M122 10H200" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M100 2l8 8-8 8-8-8z" fill="currentColor" />
      <circle cx="84" cy="10" r="2" fill="currentColor" />
      <circle cx="116" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

/** Sudut berbingkai untuk tema elegant. Diputar lewat CSS untuk keempat sudut. */
export function Corner({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-corner ${className}`} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M4 116V34C4 17 17 4 34 4h82" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M14 116V44c0-16 14-30 30-30h72" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <path d="M26 26c10 0 16 6 16 16 0-10 6-16 16-16-10 0-16-6-16-16 0 10-6 16-16 16z" fill="currentColor" />
      <circle cx="4" cy="116" r="3" fill="currentColor" />
      <circle cx="116" cy="4" r="3" fill="currentColor" />
    </svg>
  );
}

/** Bunga lima kelopak untuk tema floral. */
export function Flower({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-flower ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="50" cy="26" rx="14" ry="24" transform={`rotate(${deg} 50 50)`} fill="currentColor" opacity="0.75" />
      ))}
      <circle cx="50" cy="50" r="9" fill="currentColor" />
      <circle cx="50" cy="50" r="4" fill="#fff" opacity="0.7" />
    </svg>
  );
}

/** Kelopak jatuh. Nilai acak dibuat deterministik agar tidak beda antara server dan klien. */
export function Petals({ count = 14 }: { count?: number }) {
  return (
    <div className="inv-petals" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((i * 9301 + n * 49297) % 233280) / 233280;
        return (
          <svg
            key={i}
            viewBox="0 0 20 28"
            style={{
              left: `${Math.round(r(1) * 100)}%`,
              width: `${10 + Math.round(r(2) * 14)}px`,
              animationDuration: `${9 + r(3) * 9}s`,
              animationDelay: `${-r(4) * 14}s`,
            }}
          >
            <path d="M10 0C18 8 20 18 10 28 0 18 2 8 10 0z" fill="currentColor" />
          </svg>
        );
      })}
    </div>
  );
}

const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" {...ICON} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

export function IconClock() {
  return (
    <svg viewBox="0 0 24 24" {...ICON} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconPin() {
  return (
    <svg viewBox="0 0 24 24" {...ICON} aria-hidden="true">
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function IconNote() {
  return (
    <svg viewBox="0 0 24 24" {...ICON} aria-hidden="true">
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  );
}
