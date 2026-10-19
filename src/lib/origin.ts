import { headers } from "next/headers";

/**
 * Alamat publik situs (https://domain). Di balik proxy Railway, URL permintaan berisi alamat internal,
 * jadi dibaca dari header X-Forwarded-*.
 */
export async function publicOrigin(): Promise<string> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000").split(",")[0].trim();
  const proto = (h.get("x-forwarded-proto") ?? (/^(localhost|127\.0\.0\.1)/.test(host) ? "http" : "https")).split(",")[0].trim();
  return `${proto}://${host}`;
}
