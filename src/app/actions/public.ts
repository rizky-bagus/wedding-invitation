"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export type RsvpState = { ok: boolean; message: string };

export async function submitRsvp(
  invitationId: string,
  guestId: string | null,
  _prev: RsvpState | null,
  fd: FormData,
): Promise<RsvpState> {
  const message = str(fd, "message").slice(0, 500);
  const attendance = str(fd, "attendance"); // yes | no
  const pax = Math.min(10, Math.max(1, Number(fd.get("pax")) || 1));

  let name = str(fd, "name").slice(0, 80);
  let guest = null;
  if (guestId) {
    // Nama tamu selalu diambil dari database, bukan dari form.
    guest = await db.guest.findFirst({ where: { id: guestId, invitationId } });
    if (guest) name = guest.name;
  }
  if (!name) return { ok: false, message: "Nama wajib diisi." };

  if (guest && (attendance === "yes" || attendance === "no")) {
    await db.guest.update({
      where: { id: guest.id },
      data: { rsvp: attendance, pax: attendance === "yes" ? pax : 0 },
    });
  }
  if (message) {
    await db.wish.create({
      data: { invitationId, guestId: guest?.id ?? null, name, message },
    });
  }
  if (!guest && !message) return { ok: false, message: "Tulis ucapan terlebih dulu." };

  const inv = await db.invitation.findUnique({ where: { id: invitationId }, select: { slug: true } });
  if (inv) revalidatePath(`/u/${inv.slug}`, "layout");
  revalidatePath(`/admin/${invitationId}`);
  return { ok: true, message: "Terima kasih, konfirmasi dan ucapan Anda sudah kami terima." };
}

export async function markOpened(guestId: string) {
  await db.guest.updateMany({ where: { id: guestId, openedAt: null }, data: { openedAt: new Date() } });
}
