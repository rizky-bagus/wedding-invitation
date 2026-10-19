"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { cleanGuestName, slugify } from "@/lib/util";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export type RsvpState = { ok: boolean; message: string };

export async function submitRsvp(
  invitationId: string,
  guestId: string | null,
  _prev: RsvpState | null,
  fd: FormData,
): Promise<RsvpState> {
  const message = str(fd, "message").slice(0, 500);
  const attendance = str(fd, "attendance"); // yes | no | ""
  const pax = Math.min(10, Math.max(1, Number(fd.get("pax")) || 1));
  const hasAttendance = attendance === "yes" || attendance === "no";

  const invitation = await db.invitation.findUnique({ where: { id: invitationId }, select: { slug: true } });
  if (!invitation) return { ok: false, message: "Undangan tidak ditemukan." };

  let name = cleanGuestName(str(fd, "name"));
  let guest = null;
  if (guestId) {
    // Tamu yang sudah terdaftar: nama selalu diambil dari database, bukan dari form.
    guest = await db.guest.findFirst({ where: { id: guestId, invitationId } });
    if (guest) name = guest.name;
  }
  if (!name) return { ok: false, message: "Nama wajib diisi." };
  if (!hasAttendance && !message) return { ok: false, message: "Pilih kehadiran atau tulis ucapan terlebih dulu." };

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
  return { ok: true, message: "Terima kasih, konfirmasi dan ucapan Anda sudah kami terima." };
}

export async function markOpened(guestId: string) {
  await db.guest.updateMany({ where: { id: guestId, openedAt: null }, data: { openedAt: new Date() } });
}
