import Link from "next/link";
import { db } from "@/lib/db";
import { createInvitation } from "@/app/actions/admin";
import ActionForm from "@/components/admin/ActionForm";
import { TEMPLATES, formatDate } from "@/lib/util";

export default async function AdminHome() {
  const invitations = await db.invitation.findMany({
    orderBy: { createdAt: "desc" },
    include: { guests: { select: { rsvp: true, pax: true } } },
  });

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Undangan digital</p>
          <h1>Rancang undangan yang tak terlupakan</h1>
          <p>Satu undangan, ratusan tamu, masing-masing dengan link pribadinya sendiri.</p>
        </div>
      </section>

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

      <h2 className="section-title">Undangan Anda</h2>
      {invitations.length === 0 ? (
        <div className="empty">Belum ada undangan. Buat yang pertama di atas.</div>
      ) : (
        <div className="inv-cards">
          {invitations.map((inv) => {
            const yes = inv.guests.filter((g) => g.rsvp === "yes");
            return (
              <Link key={inv.id} href={`/admin/${inv.id}`} className="inv-card">
                <div className="inv-card-band" style={{ backgroundColor: inv.primaryColor }}>
                  <i className="dot" style={{ background: inv.bgColor }} />
                  <i className="dot" style={{ background: inv.textColor }} />
                  <span className="chip light">{TEMPLATES.find((t) => t.id === inv.template)?.name ?? inv.template}</span>
                  <strong>
                    {inv.groomName} &amp; {inv.brideName}
                  </strong>
                </div>
                <div className="inv-card-body">
                  <span>{formatDate(inv.eventDate)}</span>
                  <span className="meta">
                    {inv.guests.length} tamu · {yes.length} hadir · <code>/u/{inv.slug}</code>
                  </span>
                  <span className="go">Kelola &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
