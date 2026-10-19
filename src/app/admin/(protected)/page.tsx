import Link from "next/link";
import { db } from "@/lib/db";
import { createInvitation } from "@/app/actions/admin";
import ActionForm from "@/components/admin/ActionForm";
import { formatDate } from "@/lib/util";

export default async function AdminHome() {
  const invitations = await db.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { guests: true } } },
  });

  return (
    <>
      <h1>Undangan</h1>

      <div className="card">
        <h2>Buat undangan baru</h2>
        <ActionForm action={createInvitation} submit="Buat undangan" className="grid2">
          <label>
            Nama mempelai pria
            <input name="groomName" required placeholder="Budi" />
          </label>
          <label>
            Nama mempelai wanita
            <input name="brideName" required placeholder="Ani" />
          </label>
          <label>
            Tanggal & jam acara (WIB)
            <input type="datetime-local" name="eventDate" required />
          </label>
          <label>
            Slug URL (opsional)
            <input name="slug" placeholder="budi-ani" />
          </label>
        </ActionForm>
      </div>

      {invitations.length === 0 ? (
        <p className="hint">Belum ada undangan.</p>
      ) : (
        invitations.map((inv) => (
          <div key={inv.id} className="card">
            <div className="row" style={{ justifyContent: "space-between", marginTop: 0 }}>
              <div>
                <strong>
                  {inv.groomName} &amp; {inv.brideName}
                </strong>
                <div className="hint">
                  {formatDate(inv.eventDate)} · {inv._count.guests} tamu · <code>/u/{inv.slug}</code>
                </div>
              </div>
              <Link className="btn small" href={`/admin/${inv.id}`}>
                Kelola
              </Link>
            </div>
          </div>
        ))
      )}
    </>
  );
}
