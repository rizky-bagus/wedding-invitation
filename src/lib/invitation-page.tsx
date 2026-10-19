import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatDate, formatTime, parseGallery, TIME_ZONE } from "@/lib/util";
import Invitation from "@/components/invitation/Invitation";

async function load(slug: string, guestSlug?: string) {
  const inv = await db.invitation.findUnique({ where: { slug } });
  if (!inv) notFound();

  let guest = null;
  if (guestSlug) {
    guest = await db.guest.findUnique({
      where: { invitationId_slug: { invitationId: inv.id, slug: guestSlug } },
    });
    if (!guest) notFound();
  }
  return { inv, guest };
}

export async function invitationMetadata(slug: string, guestSlug?: string): Promise<Metadata> {
  const { inv } = await load(slug, guestSlug);
  return {
    title: `${inv.groomName} & ${inv.brideName} - ${inv.title}`,
    description: `Kami mengundang Anda ke pernikahan ${inv.groomName} & ${inv.brideName}, ${formatDate(inv.eventDate)}.`,
    robots: { index: false, follow: false }, // link undangan bersifat pribadi
  };
}

export async function InvitationPage({ slug, guestSlug }: { slug: string; guestSlug?: string }) {
  const { inv, guest } = await load(slug, guestSlug);
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
        template: inv.template,
        primaryColor: inv.primaryColor,
        bgColor: inv.bgColor,
        textColor: inv.textColor,
        headingFont: inv.headingFont,
        bodyFont: inv.bodyFont,
      }}
      guest={guest ? { id: guest.id, name: guest.name, rsvp: guest.rsvp, pax: guest.pax } : null}
      wishes={wishes.map((w) => ({
        id: w.id,
        name: w.name,
        message: w.message,
        when: whenFmt.format(w.createdAt),
      }))}
    />
  );
}
