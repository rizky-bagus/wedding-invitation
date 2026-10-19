"use client";

import { useState } from "react";
import { PALETTES } from "@/lib/util";

type Colors = { primary: string; bg: string; text: string };

export default function PaletteField({ defaults }: { defaults: Colors }) {
  const [c, setC] = useState<Colors>(defaults);
  const active = PALETTES.find((p) => p.primary === c.primary && p.bg === c.bg && p.text === c.text)?.name;

  return (
    <div className="span2">
      <p className="hint" style={{ margin: "0 0 0.5rem" }}>
        Pilih preset, lalu sesuaikan warna bila perlu.
      </p>
      <div className="palettes">
        {PALETTES.map((p) => (
          <button
            key={p.name}
            type="button"
            className={`palette ${active === p.name ? "on" : ""}`}
            onClick={() => setC({ primary: p.primary, bg: p.bg, text: p.text })}
            aria-pressed={active === p.name}
          >
            <span className="swatch" style={{ background: p.bg }}>
              <i style={{ background: p.primary }} />
              <i style={{ background: p.text }} />
            </span>
            {p.name}
          </button>
        ))}
      </div>
      <div className="grid3" style={{ marginTop: "0.75rem" }}>
        <label>
          Warna utama
          <input type="color" name="primaryColor" value={c.primary} onChange={(e) => setC({ ...c, primary: e.target.value })} />
        </label>
        <label>
          Warna latar
          <input type="color" name="bgColor" value={c.bg} onChange={(e) => setC({ ...c, bg: e.target.value })} />
        </label>
        <label>
          Warna teks
          <input type="color" name="textColor" value={c.text} onChange={(e) => setC({ ...c, text: e.target.value })} />
        </label>
      </div>
    </div>
  );
}
