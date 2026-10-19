import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { publicOrigin } from "@/lib/origin";
import { TIME_ZONE, guestPath } from "@/lib/util";

// Titik koma: pemisah bawaan Excel dengan pengaturan regional Indonesia. Google Sheets mendeteksinya otomatis.
const SEP = ";";

/** Escape sel CSV dan cegah injeksi rumus (=, +, -, @) saat dibuka di Excel/Sheets. */
function cell(value: string | number): string {
  let s = String(value);
  // Nomor telepon (angka dengan + di depan) aman; selain itu, awalan rumus dinetralkan.
  if (/^[=+\-@\t\r]/.test(s) && !/^\+\d+$/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

const row = (cells: (string | number)[]) => cells.map(cell).join(SEP);

const when = (d: Date) =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: TIME_ZONE,
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return new Response("Tidak diizinkan.", { status: 401 });

  const { id } = await params;
  const type = new URL(req.url).searchParams.get("type") === "wishes" ? "wishes" : "guests";
  const inv = await db.invitation.findUnique({ where: { id }, select: { id: true, slug: true } });
  if (!inv) return new Response("Tidak ditemukan.", { status: 404 });

  const lines: string[] = [];
  if (type === "guests") {
    const origin = await publicOrigin();
    const guests = await db.guest.findMany({ where: { invitationId: id }, orderBy: { createdAt: "asc" } });
    lines.push(row(["Nama", "WhatsApp", "Status RSVP", "Jumlah orang", "Sudah dibuka", "Link undangan"]));
    for (const g of guests) {
      lines.push(
        row([
          g.name,
          g.phone,
          g.rsvp === "yes" ? "Hadir" : g.rsvp === "no" ? "Tidak hadir" : "Belum konfirmasi",
          g.rsvp === "yes" ? g.pax : 0,
          g.openedAt ? "Ya" : "Belum",
          `${origin}${guestPath(inv.slug, g.name)}`,
        ]),
      );
    }
  } else {
    const wishes = await db.wish.findMany({ where: { invitationId: id }, orderBy: { createdAt: "asc" } });
    lines.push(row(["Waktu (WIB)", "Nama", "Ucapan"]));
    for (const w of wishes) lines.push(row([when(w.createdAt), w.name, w.message]));
  }

  // BOM agar Excel membaca UTF-8 (nama dengan aksen) dengan benar.
  return new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type === "guests" ? "tamu" : "ucapan"}-${inv.slug}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
