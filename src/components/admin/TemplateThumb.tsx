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
  boho: { bg: "#f5ece0", card: "#f5ece0", accent: "#b0603a", shape: "rainbow" },
  deco: { bg: "#17181c", card: "#f3ead3", accent: "#c9a24a", shape: "deco" },
  pantai: { bg: "#a6dbe2", card: "#f7f1e3", accent: "#e08a63", shape: "sea" },
  oriental: { bg: "#9b1c24", card: "#fbf3e4", accent: "#d6a23c", shape: "oriental" },
  galaksi: { bg: "#141a4a", card: "#ffffff", accent: "#f0c75e", shape: "galaxy" },
  gunung: { bg: "#e9a67e", card: "#f6efe4", accent: "#e08a4a", shape: "mountain" },
  sakura: { bg: "#f9dfe4", card: "#fdf4f4", accent: "#e58fa5", shape: "sakura" },
  retro: { bg: "#e9b872", card: "#f6e7c8", accent: "#c4572b", shape: "retro" },
  hutan: { bg: "#17301f", card: "#f2f0de", accent: "#c8553d", shape: "forest" },
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
      {s.shape === "rainbow" && (
        <g>
          <path d="M8 74 V40 A22 22 0 0 1 52 40 V74Z" fill="#b0603a" />
          <path d="M13 74 V40 A17 17 0 0 1 47 40 V74Z" fill="#dcb09a" />
          <path d="M18 74 V40 A12 12 0 0 1 42 40 V74Z" fill="#8a9a78" />
          <path d="M23 74 V40 A7 7 0 0 1 37 40 V74Z" fill={s.card} />
          <rect x="25" y="46" width="10" height="2.4" rx="1.2" fill="#b0603a" />
          <rect x="26" y="52" width="8" height="2" rx="1" fill="#b0603a" opacity="0.6" />
          <path d="M5 74 C4 62 8 56 10 50 M55 74 C56 62 52 56 50 50" stroke="#9a8a6a" strokeWidth="1" fill="none" />
        </g>
      )}
      {s.shape === "deco" && (
        <g>
          {Array.from({ length: 9 }, (_, i) => {
            const a = Math.PI + (Math.PI * (i + 0.5)) / 9;
            return <path key={i} d={`M30 34 L${Math.round((30 + 24 * Math.cos(a)) * 10) / 10} ${Math.round((34 + 24 * Math.sin(a)) * 10) / 10}`} stroke={s.accent} strokeWidth="2" />;
          })}
          <rect x="8" y="36" width="44" height="36" fill={s.card} stroke={s.accent} strokeWidth="1.4" />
          <rect x="11" y="39" width="38" height="30" fill="none" stroke={s.accent} strokeWidth="0.5" />
          <Lines x={30} y={44} color="#17181c" w={22} />
        </g>
      )}
      {s.shape === "sea" && (
        <g>
          <circle cx="48" cy="12" r="7" fill="#fff4c8" />
          <rect x="9" y="22" width="42" height="30" rx="8" fill={s.card} />
          <Lines x={30} y={27} color="#0f4c6b" w={20} />
          <path d="M0 62 C8 56 16 66 24 60 C32 54 40 66 48 60 C54 56 58 60 60 60 V80 H0Z" fill="#0f4c6b" opacity="0.6" />
          <path d="M0 68 C8 62 16 72 24 66 C32 60 40 72 48 66 C54 62 58 66 60 66 V80 H0Z" fill={s.card} />
          <circle cx="12" cy="20" r="3.2" fill={s.accent} />
          <circle cx="50" cy="56" r="3.6" fill={s.accent} />
        </g>
      )}
      {s.shape === "oriental" && (
        <g>
          <path d="M16 2 V10 M44 2 V10" stroke="#d6a23c" strokeWidth="0.8" />
          <ellipse cx="16" cy="15" rx="4.4" ry="5.4" fill="#c23a40" />
          <ellipse cx="44" cy="15" rx="4.4" ry="5.4" fill="#c23a40" />
          <rect x="9" y="26" width="42" height="46" fill={s.card} stroke={s.accent} strokeWidth="1.2" />
          <circle cx="30" cy="26" r="7" fill="#9b1c24" stroke={s.accent} strokeWidth="1.2" />
          <rect x="27" y="23" width="6" height="6" fill="none" stroke={s.accent} strokeWidth="1.2" />
          <Lines x={30} y={38} color="#9b1c24" w={22} />
        </g>
      )}
      {s.shape === "galaxy" && (
        <g>
          <path d="M44 8 A9 9 0 1 0 44 26 A11 11 0 0 1 44 8Z" fill="#fff3c4" />
          {[[8, 10], [16, 24], [52, 36], [10, 52], [50, 62], [34, 8], [22, 70]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 0.9 : 1.4} fill="#fff" />
          ))}
          <rect x="9" y="32" width="42" height="36" rx="7" fill="#fff" opacity="0.1" stroke="#fff" strokeOpacity="0.4" strokeWidth="0.7" />
          <Lines x={30} y={38} color={s.accent} w={22} />
        </g>
      )}
      {s.shape === "mountain" && (
        <g>
          <rect width="60" height="80" rx="4" fill="#6f86a8" />
          <rect y="38" width="60" height="42" fill="#e9a67e" />
          <circle cx="30" cy="52" r="7" fill="#fff1c9" />
          <rect x="9" y="12" width="42" height="26" rx="6" fill={s.card} />
          <Lines x={30} y={16} color="#2f4a3a" w={20} />
          <path d="M0 80 V64 L10 54 L18 62 L30 48 L42 62 L50 52 L60 62 V80Z" fill="#2f4a3a" />
          <path d="M30 48 L26 54 L30 53 L34 54Z" fill="#fff" />
        </g>
      )}
      {s.shape === "sakura" && (
        <g>
          <path d="M-2 8 C14 12 24 10 34 20" stroke="#6b4a3a" strokeWidth="1.6" fill="none" />
          {[[8, 12], [22, 11], [34, 20], [50, 70]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 3 ? 3.4 : 3} fill={s.accent} />
          ))}
          <rect x="10" y="26" width="40" height="38" rx="2" fill={s.card} stroke={s.accent} strokeWidth="0.8" />
          <circle cx="30" cy="35" r="5" fill="#c23a50" />
          <Lines x={30} y={44} color="#b84a6a" w={20} />
          <path d="M0 72 q5 -6 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 V80 H0Z" fill="#b84a6a" opacity="0.5" />
        </g>
      )}
      {s.shape === "retro" && (
        <g>
          <path d="M12 36 A18 18 0 0 1 48 36Z" fill="#e0a526" />
          <rect x="12" y="29" width="36" height="1.6" fill={s.bg} />
          <rect x="12" y="33" width="36" height="2.4" fill={s.bg} />
          <rect x="9" y="36" width="42" height="30" rx="5" fill={s.card} stroke="#4a2a17" strokeWidth="1.2" />
          <Lines x={30} y={41} color={s.accent} w={22} />
          <path d="M0 72 q7 -8 15 0 t15 0 t15 0 t15 0" stroke={s.accent} strokeWidth="2.4" fill="none" />
          <path d="M0 77 q7 -8 15 0 t15 0 t15 0 t15 0" stroke="#e0a526" strokeWidth="2.4" fill="none" />
        </g>
      )}
      {s.shape === "forest" && (
        <g>
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={6 + ((i * 17) % 50)} cy={8 + ((i * 29) % 60)} r="1" fill="#ffe27a" />
          ))}
          <path d="M6 4 C8 18 12 28 20 34 M54 4 C52 18 48 28 40 34" stroke="#6fae7a" strokeWidth="2.4" fill="none" />
          <rect x="10" y="20" width="40" height="40" rx="6" fill={s.card} />
          <Lines x={30} y={28} color="#2f5a3a" w={20} />
          <path d="M12 72 C12 64 24 64 24 72Z" fill={s.accent} />
          <rect x="16" y="72" width="4" height="5" fill="#f3e9d2" />
          <circle cx="16" cy="68" r="1" fill="#fff" />
        </g>
      )}
      {dark && null}
    </svg>
  );
}
