import path from "node:path";

/** Folder penyimpanan file upload. Di produksi arahkan ke volume persisten. */
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"));

export const KINDS = {
  image: {
    maxBytes: 8 * 1024 * 1024,
    types: { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" },
  },
  audio: {
    maxBytes: 15 * 1024 * 1024,
    types: { mp3: "audio/mpeg", m4a: "audio/mp4", ogg: "audio/ogg", wav: "audio/wav" },
  },
} as const;

export type Kind = keyof typeof KINDS;

export const ALL_TYPES: Record<string, string> = { ...KINDS.image.types, ...KINDS.audio.types };

export function extOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/** Nama file hasil upload: uuid + ekstensi. Dipakai juga untuk memvalidasi permintaan baca. */
export const STORED_NAME = /^[0-9a-f-]{36}\.[a-z0-9]{2,4}$/;
