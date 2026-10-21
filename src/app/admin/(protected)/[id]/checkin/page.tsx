import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import CheckInClient from "@/components/admin/CheckInClient";

export const metadata = { title: "Check-in tamu" };

export default async function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await db.invitation.findUnique({
    where: { id },
    include: { guests: { orderBy: { name: "asc" } } },
  });
  if (!inv) notFound();

  return (
    <>
      <p>
        <Link href={`/admin/${inv.id}`}>&larr; Kembali ke {inv.groomName} &amp; {inv.brideName}</Link>
      </p>
      <div className="page-head">
        <h1>Check-in tamu</h1>
        <p className="hint">Dipakai di meja penerima tamu pada hari acara. Buka halaman ini di HP petugas.</p>
      </div>
      <CheckInClient
        invId={inv.id}
        guests={inv.guests.map((g) => ({ id: g.id, name: g.name, rsvp: g.rsvp, pax: g.pax, checkedIn: !!g.checkedInAt }))}
      />
    </>
  );
}
