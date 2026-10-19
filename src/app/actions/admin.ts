"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { clientIp, loginLimiter, waitText } from "@/lib/ratelimit";
import {
  BODY_FONTS,
  HEADING_FONTS,
  RESERVED_SLUGS,
  TEMPLATES,
  cleanAccounts,
  cleanColors,
  cleanGuestName,
  cleanSchedule,
  defaultSlug,
  done,
  extractMapSrc,
  fail,
  isHexColor,
  parseJakartaInput,
  slugify,
  type ActionResult,
} from "@/lib/util";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function login(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const key = await clientIp();
  const wait = loginLimiter.blockedFor(key);
  if (wait) return fail(`Terlalu banyak percobaan. Coba lagi dalam ${waitText(wait)}.`);
  if (!checkPassword(str(fd, "password"))) {
    loginLimiter.hit(key);
    return fail("Password salah.");
  }
  loginLimiter.reset(key);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function createInvitation(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const groomName = str(fd, "groomName");
  const brideName = str(fd, "brideName");
  const date = str(fd, "eventDate");
  if (!groomName || !brideName || !date) return fail("Nama mempelai dan tanggal wajib diisi.");

  // Bawaan: "<istri>-with-<suami>", mis. "ani-with-budi".
  const base = slugify(str(fd, "slug")) || defaultSlug(groomName, brideName) || "undangan";
  const root = RESERVED_SLUGS.includes(base) ? `${base}-undangan` : base;
  let slug = root;
  for (let i = 2; await db.invitation.findUnique({ where: { slug } }); i++) slug = `${root}-${i}`;

  const inv = await db.invitation.create({
    data: { slug, groomName, brideName, eventDate: parseJakartaInput(date) },
  });
  redirect(`/admin/${inv.id}`);
}

export async function updateInvitation(id: string, _prev: ActionResult, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const groomName = str(fd, "groomName");
  const brideName = str(fd, "brideName");
  const date = str(fd, "eventDate");
  if (!groomName || !brideName || !date) return fail("Nama mempelai dan tanggal wajib diisi.");

  const slug = slugify(str(fd, "slug"));
  if (!slug) return fail("Slug tidak valid.");
  if (RESERVED_SLUGS.includes(slug)) return fail("Slug itu dipakai sistem. Pilih yang lain.");
  const clash = await db.invitation.findUnique({ where: { slug } });
  if (clash && clash.id !== id) return fail("Slug sudah dipakai undangan lain.");

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
      schedule: JSON.stringify(cleanSchedule(str(fd, "schedule"))),
      dressCode: str(fd, "dressCode").slice(0, 300),
      dressColors: JSON.stringify(cleanColors(str(fd, "dressColors"))),
      giftAccounts: JSON.stringify(cleanAccounts(str(fd, "giftAccounts"))),
      giftNote: str(fd, "giftNote").slice(0, 500),
      contactPhone: str(fd, "contactPhone").replace(/[^\d+]/g, "").slice(0, 20),
      notes: str(fd, "notes").slice(0, 500),
      template: TEMPLATES.some((t) => t.id === template) ? template : "elegant",
      primaryColor: color("primaryColor", "#b08968"),
      bgColor: color("bgColor", "#fffaf3"),
      textColor: color("textColor", "#3b2f2f"),
      headingFont: HEADING_FONTS.includes(str(fd, "headingFont")) ? str(fd, "headingFont") : HEADING_FONTS[0],
      bodyFont: BODY_FONTS.includes(str(fd, "bodyFont")) ? str(fd, "bodyFont") : BODY_FONTS[0],
    },
  });
  revalidatePath(`/admin/${id}`);
  revalidatePath(`/${slug}`);
  return done("Tersimpan.");
}

export async function deleteInvitation(id: string) {
  await requireAdmin();
  await db.invitation.delete({ where: { id } });
  redirect("/admin");
}

/** Satu tamu per baris. Format: "Nama" atau "Nama | 0812xxxx". */
export async function addGuests(invitationId: string, _prev: ActionResult, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const all = str(fd, "guests").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!all.length) return fail("Isi minimal satu nama.");
  const lines = all.slice(0, 500);
  const cut = all.length - lines.length;

  const existing = new Set(
    (await db.guest.findMany({ where: { invitationId }, select: { slug: true } })).map((g) => g.slug),
  );
  const rows: { invitationId: string; name: string; slug: string; phone: string }[] = [];
  let skipped = 0;
  for (const line of lines) {
    // Pemisah "|" atau tab (tempelan dari Excel/Sheets).
    const [rawName, rawPhone = ""] = line.split(/\||\t/).map((s) => s.trim());
    const name = cleanGuestName(rawName);
    if (!name) continue;
    // Nama tamu menjadi kunci di link (?to=Nama), jadi harus unik per undangan.
    const slug = slugify(name) || "tamu";
    if (existing.has(slug)) {
      skipped++;
      continue;
    }
    existing.add(slug);
    rows.push({ invitationId, name, slug, phone: rawPhone.replace(/[^\d+]/g, "").slice(0, 20) });
  }
  if (rows.length) await db.guest.createMany({ data: rows });
  revalidatePath(`/admin/${invitationId}`);
  const note =
    (skipped ? ` ${skipped} dilewati karena namanya sudah ada.` : "") +
    (cut > 0 ? ` ${cut} baris di luar batas 500 tidak diproses.` : "");
  return rows.length ? done(`${rows.length} tamu ditambahkan.${note}`) : fail(`Tidak ada tamu baru.${note}`);
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
