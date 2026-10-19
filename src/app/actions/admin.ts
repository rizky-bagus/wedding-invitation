"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import {
  BODY_FONTS,
  HEADING_FONTS,
  TEMPLATES,
  extractMapSrc,
  isHexColor,
  parseJakartaInput,
  slugify,
} from "@/lib/util";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function login(_prev: string | null, fd: FormData): Promise<string | null> {
  if (!checkPassword(str(fd, "password"))) return "Password salah.";
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function createInvitation(_prev: string | null, fd: FormData): Promise<string | null> {
  await requireAdmin();
  const groomName = str(fd, "groomName");
  const brideName = str(fd, "brideName");
  const date = str(fd, "eventDate");
  if (!groomName || !brideName || !date) return "Nama mempelai dan tanggal wajib diisi.";

  const base = slugify(str(fd, "slug") || `${groomName}-${brideName}`) || "undangan";
  let slug = base;
  for (let i = 2; await db.invitation.findUnique({ where: { slug } }); i++) slug = `${base}-${i}`;

  const inv = await db.invitation.create({
    data: { slug, groomName, brideName, eventDate: parseJakartaInput(date) },
  });
  redirect(`/admin/${inv.id}`);
}

export async function updateInvitation(id: string, _prev: string | null, fd: FormData): Promise<string | null> {
  await requireAdmin();
  const groomName = str(fd, "groomName");
  const brideName = str(fd, "brideName");
  const date = str(fd, "eventDate");
  if (!groomName || !brideName || !date) return "Nama mempelai dan tanggal wajib diisi.";

  const slug = slugify(str(fd, "slug"));
  if (!slug) return "Slug tidak valid.";
  const clash = await db.invitation.findUnique({ where: { slug } });
  if (clash && clash.id !== id) return "Slug sudah dipakai undangan lain.";

  const template = str(fd, "template");
  const color = (key: string, fallback: string) => (isHexColor(str(fd, key)) ? str(fd, key) : fallback);
  const gallery = str(fd, "gallery")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  await db.invitation.update({
    where: { id },
    data: {
      slug,
      title: str(fd, "title") || "Undangan Pernikahan",
      groomName,
      brideName,
      groomParents: str(fd, "groomParents"),
      brideParents: str(fd, "brideParents"),
      eventDate: parseJakartaInput(date),
      venueName: str(fd, "venueName"),
      venueAddress: str(fd, "venueAddress"),
      mapEmbedUrl: extractMapSrc(str(fd, "mapEmbedUrl")),
      openingText: str(fd, "openingText"),
      closingText: str(fd, "closingText"),
      coverPhoto: str(fd, "coverPhoto"),
      groomPhoto: str(fd, "groomPhoto"),
      bridePhoto: str(fd, "bridePhoto"),
      gallery: JSON.stringify(gallery),
      musicUrl: str(fd, "musicUrl"),
      template: TEMPLATES.some((t) => t.id === template) ? template : "elegant",
      primaryColor: color("primaryColor", "#b08968"),
      bgColor: color("bgColor", "#fffaf3"),
      textColor: color("textColor", "#3b2f2f"),
      headingFont: HEADING_FONTS.includes(str(fd, "headingFont")) ? str(fd, "headingFont") : HEADING_FONTS[0],
      bodyFont: BODY_FONTS.includes(str(fd, "bodyFont")) ? str(fd, "bodyFont") : BODY_FONTS[0],
    },
  });
  revalidatePath(`/admin/${id}`);
  revalidatePath(`/u/${slug}`, "layout");
  return "Tersimpan.";
}

export async function deleteInvitation(id: string) {
  await requireAdmin();
  await db.invitation.delete({ where: { id } });
  redirect("/admin");
}

/** Satu tamu per baris. Format: "Nama" atau "Nama | 0812xxxx". */
export async function addGuests(invitationId: string, _prev: string | null, fd: FormData): Promise<string | null> {
  await requireAdmin();
  const lines = str(fd, "guests").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return "Isi minimal satu nama.";

  const existing = new Set(
    (await db.guest.findMany({ where: { invitationId }, select: { slug: true } })).map((g) => g.slug),
  );
  let added = 0;
  for (const line of lines) {
    const [name, phone = ""] = line.split("|").map((s) => s.trim());
    if (!name) continue;
    const base = slugify(name) || "tamu";
    let slug = base;
    for (let i = 2; existing.has(slug); i++) slug = `${base}-${i}`;
    existing.add(slug);
    await db.guest.create({ data: { invitationId, name, slug, phone } });
    added++;
  }
  revalidatePath(`/admin/${invitationId}`);
  return `${added} tamu ditambahkan.`;
}

export async function deleteGuest(invitationId: string, guestId: string) {
  await requireAdmin();
  await db.guest.delete({ where: { id: guestId } });
  revalidatePath(`/admin/${invitationId}`);
}

export async function deleteWish(invitationId: string, wishId: string) {
  await requireAdmin();
  await db.wish.delete({ where: { id: wishId } });
  revalidatePath(`/admin/${invitationId}`);
}
