import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin_session";

function sign(): string {
  const secret = process.env.SESSION_SECRET ?? "";
  return createHmac("sha256", secret).update("admin").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  return expected.length > 0 && safeEqual(input, expected);
}

export async function createSession() {
  const jar = await cookies();
  jar.set(COOKIE, sign(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  return !!value && !!process.env.SESSION_SECRET && safeEqual(value, sign());
}

/** Panggil di setiap halaman admin dan server action admin. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
