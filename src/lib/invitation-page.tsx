import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { publicOrigin } from "@/lib/origin";
import {
  cleanAccounts,
  cleanColors,
  cleanGuestName,
  cleanSchedule,
  formatDate,
  formatTime,
  parseGallery,
  slugify,
  TIME_ZONE,
} from "@/lib/util";
import Invitation from "@/components/invitation/Invitation";

/** Parameter ?to= bisa muncul berkali-kali; ambil yang pertama. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

async function load(slug: string, to?: string) {
  const inv = await db.invitation.findUnique({ where: { slug } });
  if (!inv) notFound();

  // Nama tamu datang dari ?to=. Jika cocok dengan daftar tamu, kehadirannya tercatat pada tamu itu.
  const name = cleanGuestName(to);
  const guest = name
    ? await db.guest.findUnique({ where: { invitationId_slug: { invitationId: inv.id, slug: slugify(name) || "tamu" } } })
    : null;
  return { inv, guest, name: guest?.name ?? name };
}

export async function invitationMetadata(slug: string, to?: string): Promise<Metadata> {
  const { inv, name } = await load(slug, to);
  const couple = `${inv.groomName} & ${inv.brideName}`;
  // Judul dan deskripsi inilah yang tampil di pratinjau link WhatsApp.
  const title = name ? `Undangan untuk ${name} · ${couple}` : `${couple} · ${inv.title}`;
  const where = inv.venueName ? ` di ${inv.venueName}` : "";
  const description = `Dengan hormat kami mengundang Anda ke pernikahan ${couple} pada ${formatDate(inv.eventDate)}${where}.`;
  return {
    metadataBase: new URL(await publicOrigin()),
    title,
    description,
    robots: { index: false, follow: false }, // link undangan bersifat pribadi
    openGraph: { title, description, type: "website", locale: "id_ID", siteName: couple },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function InvitationPage({ slug, to }: { slug: string; to?: string }) {
  const { inv, guest, name } = await load(slug, to);
  const wishes = await db.wish.findMany({
    where: { invitationId: inv.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const whenFmt = new Intl.DateTimeFormat("id-ID", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  return (
    <Invitation
      inv={{
        id: inv.id,
        title: inv.title,
        groomName: inv.groomName,
        brideName: inv.brideName,
        groomParents: inv.groomParents,
        brideParents: inv.brideParents,
        eventISO: inv.eventDate.toISOString(),
        dateText: formatDate(inv.eventDate),
        timeText: formatTime(inv.eventDate),
        venueName: inv.venueName,
        venueAddress: inv.venueAddress,
        mapEmbedUrl: inv.mapEmbedUrl,
        openingText: inv.openingText,
        closingText: inv.closingText,
        coverPhoto: inv.coverPhoto,
        groomPhoto: inv.groomPhoto,
        bridePhoto: inv.bridePhoto,
        gallery: parseGallery(inv.gallery),
        musicUrl: inv.musicUrl,
        schedule: cleanSchedule(inv.schedule),
        dressCode: inv.dressCode,
        dressColors: cleanColors(inv.dressColors),
        giftAccounts: cleanAccounts(inv.giftAccounts),
        giftNote: inv.giftNote,
        contactPhone: inv.contactPhone,
        notes: inv.notes,
        template: inv.template,
        primaryColor: inv.primaryColor,
        bgColor: inv.bgColor,
        textColor: inv.textColor,
        accentColor: inv.accentColor || inv.primaryColor,
        headingFont: inv.headingFont,
        bodyFont: inv.bodyFont,
      }}
      guest={
        name
          ? { id: guest?.id ?? null, name, rsvp: guest?.rsvp ?? "pending", pax: guest?.pax ?? 1 }
          : null
      }
      wishes={wishes.map((w) => ({
        id: w.id,
        name: w.name,
        message: w.message,
        when: whenFmt.format(w.createdAt),
      }))}
    />
  );
}
