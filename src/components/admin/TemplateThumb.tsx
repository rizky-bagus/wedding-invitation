/** Sketsa kecil tiap template untuk pilihan di dashboard. Hanya bentuk dasar SVG, tanpa gambar. */

type Spec = { bg: string; card: string; accent: string; shape: string };

const SPECS: Record<string, Spec> = {
  elegant: { bg: "#efe3d2", card: "#fffaf3", accent: "#b08968", shape: "frame" },
  floral: { bg: "#f6cfc8", card: "#fff3ee", accent: "#d98f9b", shape: "petal" },
  modern: { bg: "#ffffff", card: "#ffffff", accent: "#111111", shape: "bars" },
  envelope: { bg: "#d6dcc7", card: "#f6f1e7", accent: "#7d8a68", shape: "envelope" },
  botanical: { bg: "#f1d9da", card: "#fff7f4", accent: "#d98f9b", shape: "arch" },
  panel: { bg: "#f7f3ec", card: "#3b4a6b", accent: "#f7f3ec", shape: "panel" },
  satin: { bg: "#5b1423", card: "#f6eee4", accent: "#8f2236", shape: "scallop" },
  kraft: { bg: "#6f7f4d", card: "#f7f2e8", accent: "#8c1c2f", shape: "kraft" },
  lavender: { bg: "#faf6fb", card: "#faf6fb", accent: "#5a2a6e", shape: "line" },
  renda: { bg: "#4a1830", card: "#f1e6da", accent: "#c9a24a", shape: "scallop" },
  batik: { bg: "#5a3a22", card: "#f3e7cf", accent: "#c9a24a", shape: "batik" },
  islami: { bg: "#0f5a4a", card: "#fffaf0", accent: "#c9a24a", shape: "pointed" },
};

/** Tiga garis teks (nama, ampersand, tanggal) dalam warna aksen. */
function Lines({ x, y, color, w = 24 }: { x: number; y: number; color: string; w?: number }) {
  return (
    <g fill={color}>
      <rect x={x - w / 2} y={y} width={w} height="3" rx="1.5" />
      <rect x={x - 3} y={y + 6} width="6" height="2" rx="1" opacity="0.7" />
      <rect x={x - w / 2 + 2} y={y + 11} width={w - 4} height="3" rx="1.5" />
      <rect x={x - 9} y={y + 19} width="18" height="1.6" rx="0.8" opacity="0.6" />
    </g>
  );
}

export default function TemplateThumb({ id }: { id: string }) {
  const s = SPECS[id] ?? SPECS.elegant;
  const dark = s.shape === "panel";

  return (
    <svg className="tpl-thumb" viewBox="0 0 60 80" width="52" height="69" aria-hidden="true">
      <rect width="60" height="80" rx="4" fill={s.bg} />
      {s.shape === "frame" && (
        <g>
          <rect x="7" y="8" width="46" height="64" fill={s.card} stroke={s.accent} strokeWidth="1.2" />
          <rect x="10" y="11" width="40" height="58" fill="none" stroke={s.accent} strokeWidth="0.5" />
          <Lines x={30} y={30} color={s.accent} />
        </g>
      )}
      {s.shape === "petal" && (
        <g>
          <path d="M10 70 V36 C10 18 50 18 50 36 V70Z" fill={s.card} />
          <circle cx="12" cy="12" r="7" fill={s.accent} opacity="0.55" />
          <circle cx="50" cy="68" r="8" fill={s.accent} opacity="0.55" />
          <Lines x={30} y={34} color={s.accent} />
        </g>
      )}
      {s.shape === "bars" && (
        <g>
          <rect x="7" y="8" width="3" height="64" fill={s.accent} />
          <rect x="14" y="14" width="36" height="10" fill="none" stroke={s.accent} strokeWidth="1" />
          <rect x="14" y="30" width="30" height="5" fill={s.accent} />
          <rect x="14" y="38" width="24" height="5" fill={s.accent} />
          <rect x="14" y="52" width="36" height="2" fill={s.accent} opacity="0.5" />
        </g>
      )}
      {s.shape === "envelope" && (
        <g>
          <rect x="7" y="22" width="46" height="36" rx="2" fill={s.accent} />
          <path d="M7 22 L30 42 L53 22Z" fill={s.card} opacity="0.35" />
          <circle cx="30" cy="42" r="5" fill="#8c2f3d" />
          <rect x="14" y="6" width="32" height="26" rx="1" fill={s.card} />
          <Lines x={30} y={10} color={s.accent} w={18} />
        </g>
      )}
      {s.shape === "arch" && (
        <g>
          <path d="M16 46 V30 C16 14 44 14 44 30 V46Z" fill={s.accent} opacity="0.6" />
          <rect x="9" y="52" width="42" height="1.2" fill={s.accent} opacity="0.5" />
          <Lines x={30} y={56} color={s.accent} w={22} />
          <path d="M0 4 C8 8 12 16 8 24 M60 76 C52 72 48 64 52 56" stroke={s.accent} strokeWidth="1.2" fill="none" />
        </g>
      )}
      {s.shape === "panel" && (
        <g>
          <rect x="6" y="6" width="48" height="30" fill={s.card} />
          <rect x="6" y="36" width="48" height="38" fill="#fffaf3" />
          <Lines x={30} y={12} color={s.accent} w={22} />
          <rect x="12" y="44" width="36" height="14" fill={s.card} opacity="0.9" />
        </g>
      )}
      {s.shape === "scallop" && (
        <g>
          <ellipse cx="30" cy="40" rx="20" ry="28" fill={s.card} />
          <ellipse cx="30" cy="40" rx="16" ry="24" fill="none" stroke={s.accent} strokeWidth="0.8" />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <circle key={i} cx={Math.round((30 + 18 * Math.cos(a)) * 10) / 10} cy={Math.round((40 + 26 * Math.sin(a)) * 10) / 10} r="1" fill={s.bg} />;
          })}
          <Lines x={30} y={30} color={s.accent} w={18} />
        </g>
      )}
      {s.shape === "kraft" && (
        <g>
          <path d="M6 30 L10 28 L14 30 L18 28 L22 30 L26 28 L30 30 L34 28 L38 30 L42 28 L46 30 L50 28 L54 30 V74 H6Z" fill={s.card} />
          <rect x="18" y="8" width="24" height="18" fill="#fff" transform="rotate(-4 30 17)" />
          <rect x="21" y="10" width="18" height="11" fill={s.accent} opacity="0.4" transform="rotate(-4 30 17)" />
          <Lines x={30} y={38} color={s.accent} />
          <circle cx="10" cy="62" r="5" fill={s.accent} />
        </g>
      )}
      {s.shape === "line" && (
        <g>
          <rect x="0" y="20" width="60" height="9" fill={s.accent} />
          <rect x="14" y="22.5" width="32" height="3" rx="1.5" fill="#fff" opacity="0.9" />
          <path d="M8 14 C8 8 12 6 12 2 M52 14 C52 8 48 6 48 2" stroke={s.accent} strokeWidth="1" fill="none" />
          <Lines x={30} y={38} color={s.accent} />
          <rect x="0" y="62" width="60" height="12" fill={s.accent} />
        </g>
      )}
      {s.shape === "batik" && (
        <g>
          <rect x="8" y="12" width="44" height="56" fill={s.card} />
          <path d="M8 12 H52 V18 L48 24 L44 18 L40 24 L36 18 L32 24 L28 18 L24 24 L20 18 L16 24 L12 18 L8 24Z" fill={s.accent} />
          <path d="M8 68 H52 V62 L48 56 L44 62 L40 56 L36 62 L32 56 L28 62 L24 56 L20 62 L16 56 L12 62 L8 56Z" fill={s.accent} />
          <Lines x={30} y={30} color="#5a3a22" w={22} />
        </g>
      )}
      {s.shape === "pointed" && (
        <g>
          <path d="M10 74 V38 C10 24 24 16 30 6 C36 16 50 24 50 38 V74Z" fill={s.card} stroke={s.accent} strokeWidth="1.4" />
          <Lines x={30} y={36} color="#0f5a4a" w={20} />
        </g>
      )}
      {dark && null}
    </svg>
  );
}
