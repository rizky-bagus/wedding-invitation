/**
 * Hiasan melayang di sampul: serbuk emas, kupu-kupu, awan, burung.
 * Posisi dan kecepatan deterministik (sama di server dan klien); gerak diatur CSS (.amb ...).
 */
import { rnd } from "./scenery";

const f = (n: number) => Math.round(n * 100) / 100;

/** Serbuk berkilau berbentuk bintang empat sudut. */
export function Sparkles({ count = 16 }: { count?: number }) {
  return (
    <div className="amb amb-spark" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const size = f(6 + rnd(i, 3) * 10);
        return (
          <i
            key={i}
            style={{
              left: `${f(rnd(i, 1) * 100)}%`,
              top: `${f(rnd(i, 2) * 100)}%`,
              width: size,
              height: size,
              animationDelay: `-${f(rnd(i, 4) * 8)}s`,
              animationDuration: `${f(4 + rnd(i, 5) * 5)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function Butterfly({ i }: { i: number }) {
  const tone = i % 2 === 0 ? "var(--accent)" : "var(--primary)";
  return (
    <svg
      className="bf"
      viewBox="0 0 40 30"
      style={
        {
          left: `${f(8 + rnd(i, 1) * 78)}%`,
          top: `${f(10 + rnd(i, 2) * 70)}%`,
          width: f(22 + rnd(i, 3) * 12),
          animationDuration: `${f(14 + rnd(i, 4) * 10)}s`,
          animationDelay: `-${f(rnd(i, 5) * 12)}s`,
          "--bx": `${Math.round((rnd(i, 6) - 0.5) * 120)}px`,
          "--by": `${Math.round((rnd(i, 7) - 0.6) * 110)}px`,
        } as React.CSSProperties
      }
    >
      <g className="wing l">
        <path d="M20 14C14 2 3 1 3 9C3 15 11 17 20 15z" style={{ fill: tone }} opacity="0.9" />
        <path d="M20 16C13 17 6 21 8 26C12 29 18 23 20 16z" style={{ fill: tone }} opacity="0.65" />
      </g>
      <g className="wing r">
        <path d="M20 14C26 2 37 1 37 9C37 15 29 17 20 15z" style={{ fill: tone }} opacity="0.9" />
        <path d="M20 16C27 17 34 21 32 26C28 29 22 23 20 16z" style={{ fill: tone }} opacity="0.65" />
      </g>
      <path d="M20 8V22" stroke="#3a2a1a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 8C18 4 16 3 15 2M20 8C22 4 24 3 25 2" fill="none" stroke="#3a2a1a" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

/** Kupu-kupu yang melayang pelan sambil mengepak. */
export function Butterflies({ count = 3 }: { count?: number }) {
  return (
    <div className="amb amb-bf" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <Butterfly key={i} i={i} />
      ))}
    </div>
  );
}

/** Bintang jatuh yang melintas sesekali. */
export function ShootingStars({ count = 3 }: { count?: number }) {
  return (
    <div className="amb amb-shoot" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i
          key={i}
          style={{
            top: `${f(2 + rnd(i, 1) * 40)}%`,
            left: `${f(35 + rnd(i, 2) * 60)}%`,
            animationDelay: `${f(rnd(i, 3) * 12)}s`,
            animationDuration: `${f(9 + rnd(i, 4) * 7)}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Hati kecil yang naik pelan sambil bergoyang. */
export function Hearts({ count = 9 }: { count?: number }) {
  return (
    <div className="amb amb-hearts" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          className="heart"
          viewBox="0 0 24 22"
          style={
            {
              left: `${f(rnd(i, 1) * 96)}%`,
              width: f(10 + rnd(i, 2) * 12),
              animationDuration: `${f(12 + rnd(i, 3) * 10)}s`,
              animationDelay: `-${f(rnd(i, 4) * 20)}s`,
              "--sway": `${Math.round((rnd(i, 5) - 0.5) * 60)}px`,
            } as React.CSSProperties
          }
        >
          <path d="M12 21C2 13 1 7 5 4c3-2 6 0 7 3 1-3 4-5 7-3 4 3 3 9-7 17z" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

/** Awan sebagai hiasan sudut kartu. */
export function CloudShape({ className = "" }: { className?: string }) {
  return (
    <svg className={`inv-art ${className}`} viewBox="0 0 120 50" aria-hidden="true">
      <path d="M20 42a14 14 0 0 1 4-27a20 20 0 0 1 38-4a16 16 0 0 1 28 10a13 13 0 0 1 10 21z" style={{ fill: "color-mix(in srgb, var(--primary) 18%, #fff)" }} opacity="0.85" />
      <path d="M34 34a8 8 0 0 1 10-8M70 30a6 6 0 0 1 8-5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/** Awan yang berarak dan burung yang terbang melintas. */
export function Skyline({ birds = true, clouds = true }: { birds?: boolean; clouds?: boolean }) {
  return (
    <div className="amb" aria-hidden="true">
      {clouds && [0, 1, 2].map((i) => (
        <svg
          key={`c${i}`}
          className="cloud"
          viewBox="0 0 120 50"
          style={{
            top: `${f(6 + i * 14 + rnd(i, 1) * 6)}%`,
            width: f(90 + rnd(i, 2) * 70),
            animationDuration: `${f(70 + rnd(i, 3) * 50)}s`,
            animationDelay: `-${f(rnd(i, 4) * 90)}s`,
            opacity: f(0.55 + rnd(i, 5) * 0.3),
          }}
        >
          <path d="M20 42a14 14 0 0 1 4-27a20 20 0 0 1 38-4a16 16 0 0 1 28 10a13 13 0 0 1 10 21z" fill="#fff" />
        </svg>
      ))}
      {birds &&
        [0, 1, 2].map((i) => (
          <svg
            key={`b${i}`}
            className="bird"
            viewBox="0 0 22 10"
            style={{
              top: `${f(12 + i * 9 + rnd(i, 6) * 8)}%`,
              width: f(16 + rnd(i, 7) * 8),
              animationDuration: `${f(22 + rnd(i, 8) * 14)}s`,
              animationDelay: `-${f(rnd(i, 9) * 30)}s`,
            }}
          >
            <path d="M1 7Q6 0 11 6Q16 0 21 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ))}
    </div>
  );
}
