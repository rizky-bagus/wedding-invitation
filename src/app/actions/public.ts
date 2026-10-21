"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { cleanGuestName, slugify } from "@/lib/util";
import { clientIp, rsvpLimiter, waitText } from "@/lib/ratelimit";
import { tr, type Lang } from "@/lib/i18n";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export type RsvpState = { ok: boolean; message: string };

export async function submitRsvp(
  invitationId: string,
  guestId: string | null,
  lang: Lang,
  _prev: RsvpState | null,
  fd: FormData,
): Promise<RsvpState> {
  const t = tr(lang);
  // Kolom jebakan: manusia tidak melihatnya, bot biasanya mengisi semua kolom. Tampak sukses agar bot tidak belajar.
  if (str(fd, "website")) return { ok: true, message: t.rsvpThanks };

  const limitKey = `${await clientIp()}:${invitationId}`;
  const wait = rsvpLimiter.blockedFor(limitKey);
  if (wait) return { ok: false, message: t.rsvpLimit(waitText(wait)) };

  const message = str(fd, "message").slice(0, 500);
  const attendance = str(fd, "attendance"); // yes | no | ""
  const pax = Math.min(10, Math.max(1, Number(fd.get("pax")) || 1));
  const hasAttendance = attendance === "yes" || attendance === "no";

  const invitation = await db.invitation.findUnique({ where: { id: invitationId }, select: { slug: true } });
  if (!invitation) return { ok: false, message: t.rsvpNotFound };

  let name = cleanGuestName(str(fd, "name"));
  let guest = null;
  if (guestId) {
    // Tamu yang sudah terdaftar: nama selalu diambil dari database, bukan dari form.
    guest = await db.guest.findFirst({ where: { id: guestId, invitationId } });
    if (guest) name = guest.name;
  }
  if (!name) return { ok: false, message: t.rsvpNeedName };
  if (!hasAttendance && !message) return { ok: false, message: t.rsvpNeedChoice };
  rsvpLimiter.hit(limitKey); // hanya kiriman yang valid dihitung

  if (hasAttendance) {
    // Nama dari ?to= yang belum ada di daftar tercatat otomatis sebagai tamu baru.
    if (!guest) {
      const slug = slugify(name) || "tamu";
      guest = await db.guest.upsert({
        where: { invitationId_slug: { invitationId, slug } },
        update: {},
        create: { invitationId, name, slug },
      });
    }
    await db.guest.update({
      where: { id: guest.id },
      data: { rsvp: attendance, pax: attendance === "yes" ? pax : 0 },
    });
  }
  if (message) {
    await db.wish.create({ data: { invitationId, guestId: guest?.id ?? null, name, message } });
  }

  revalidatePath(`/${invitation.slug}`);
  revalidatePath(`/admin/${invitationId}`);
  return { ok: true, message: t.rsvpThanks };
}

export async function markOpened(guestId: string) {
  await db.guest.updateMany({ where: { id: guestId, openedAt: null }, data: { openedAt: new Date() } });
}
