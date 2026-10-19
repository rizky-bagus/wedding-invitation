import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

/**
 * Pembatas sederhana di memori: cukup untuk satu instance (Railway dengan 1 replica).
 * Jika aplikasi dijalankan lebih dari satu replica, pindahkan penghitung ke Redis/database.
 */
export class Limiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private limit: number,
    private windowMs: number,
  ) {}

  private live(key: string): Bucket | undefined {
    const b = this.buckets.get(key);
    if (b && b.resetAt <= Date.now()) {
      this.buckets.delete(key);
      return undefined;
    }
    return b;
  }

  /** Sisa detik pemblokiran, atau 0 jika boleh lanjut. Tidak menambah hitungan. */
  blockedFor(key: string): number {
    const b = this.live(key);
    return b && b.count >= this.limit ? Math.ceil((b.resetAt - Date.now()) / 1000) : 0;
  }

  /** Catat satu percobaan. */
  hit(key: string): void {
    if (this.buckets.size > 10_000) {
      const now = Date.now();
      for (const [k, v] of this.buckets) if (v.resetAt <= now) this.buckets.delete(k);
    }
    const b = this.live(key);
    if (b) b.count++;
    else this.buckets.set(key, { count: 1, resetAt: Date.now() + this.windowMs });
  }

  reset(key: string): void {
    this.buckets.delete(key);
  }
}

/**
 * IP klien di balik proxy Railway. Entri paling kanan X-Forwarded-For ditambahkan oleh proxy
 * tepercaya; entri kiri bisa dipalsukan klien, jadi tidak dipakai.
 */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const real = h.get("x-real-ip")?.trim();
  if (real) return real;
  const parts = h.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return parts?.[parts.length - 1] ?? "local";
}

export const loginLimiter = new Limiter(5, 15 * 60 * 1000); // 5 salah per 15 menit
export const rsvpLimiter = new Limiter(6, 10 * 60 * 1000); // 6 kiriman per 10 menit

export function waitText(seconds: number): string {
  return seconds >= 120 ? `${Math.ceil(seconds / 60)} menit` : `${seconds} detik`;
}
