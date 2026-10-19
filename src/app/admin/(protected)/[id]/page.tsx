import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  addGuests,
  deleteGuest,
  deleteInvitation,
  deleteWish,
  updateInvitation,
} from "@/app/actions/admin";
import ActionForm from "@/components/admin/ActionForm";
import ShareButtons from "@/components/admin/ShareButtons";
import UploadField from "@/components/admin/UploadField";
import PaletteField from "@/components/admin/PaletteField";
import PreviewFrame from "@/components/admin/PreviewFrame";
import {
  BODY_FONTS,
  HEADING_FONTS,
  TEMPLATES,
  guestPath,
  invitationPath,
  parseGallery,
  toJakartaInput,
} from "@/lib/util";

export default async function ManageInvitation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await db.invitation.findUnique({
    where: { id },
    include: {
      guests: { orderBy: { createdAt: "asc" } },
      wishes: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!inv) notFound();

  const couple = `${inv.groomName} & ${inv.brideName}`;
  const yes = inv.guests.filter((g) => g.rsvp === "yes");
  const stats: [string, number, string][] = [
    ["Tamu", inv.guests.length, ""],
    ["Hadir", yes.length, "ok"],
    ["Total orang hadir", yes.reduce((n, g) => n + g.pax, 0), "ok"],
    ["Tidak hadir", inv.guests.filter((g) => g.rsvp === "no").length, "no"],
    ["Belum konfirmasi", inv.guests.filter((g) => g.rsvp === "pending").length, "wait"],
    ["Sudah dibuka", inv.guests.filter((g) => g.openedAt).length, ""],
  ];

  return (
    <>
      <p>
        <Link href="/admin">&larr; Semua undangan</Link>
      </p>
      <div className="page-head">
        <h1>{couple}</h1>
        <p className="hint">
          <span className="chip">{TEMPLATES.find((t) => t.id === inv.template)?.name ?? inv.template}</span> Link umum:{" "}
          <code>{invitationPath(inv.slug)}</code> ·{" "}
          <a href={invitationPath(inv.slug)} target="_blank" rel="noreferrer">
            Lihat undangan
          </a>
        </p>
      </div>

      <div className="manage">
        <div className="manage-main">
      <div className="stats">
        {stats.map(([label, value, tone]) => (
          <div key={label} className={`stat ${tone}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Tamu & link personal</h2>
        <ActionForm action={addGuests.bind(null, inv.id)} submit="Tambah tamu">
          <label>
            Satu tamu per baris, nama harus unik. Nomor WhatsApp opsional, pisahkan dengan |
            <textarea name="guests" rows={4} placeholder={"Budi Santoso | 081234567890\nKeluarga Pak Andi\nIbu Sari"} />
          </label>
        </ActionForm>

        {inv.guests.length > 0 && (
          <div className="table-wrap" style={{ marginTop: "1rem" }}>
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Link</th>
                  <th>RSVP</th>
                  <th>Bagikan</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {inv.guests.map((g) => {
                  const path = guestPath(inv.slug, g.name);
                  return (
                    <tr key={g.id}>
                      <td>
                        <span className="who">
                          <span className="avatar">{g.name.charAt(0).toUpperCase()}</span>
                          <span>
                            {g.name}
                            {g.openedAt && <small className="hint"> · sudah dibuka</small>}
                          </span>
                        </span>
                      </td>
                      <td>
                        <a href={path} target="_blank" rel="noreferrer">
                          <code>{path}</code>
                        </a>
                      </td>
                      <td>
                        <span className={`pill ${g.rsvp}`}>
                          {g.rsvp === "yes" ? `Hadir (${g.pax})` : g.rsvp === "no" ? "Tidak hadir" : "Belum"}
                        </span>
                      </td>
                      <td>
                        <ShareButtons path={path} guestName={g.name} phone={g.phone} couple={couple} />
                      </td>
                      <td>
                        <form action={deleteGuest.bind(null, inv.id, g.id)}>
                          <button className="btn small danger" type="submit">
                            Hapus
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ActionForm id="invitation-form" action={updateInvitation.bind(null, inv.id)} submit="Simpan perubahan" className="card">
        <h2>Detail acara</h2>
        <div className="grid2">
          <label>
            Nama mempelai pria
            <input name="groomName" defaultValue={inv.groomName} required />
          </label>
          <label>
            Nama mempelai wanita
            <input name="brideName" defaultValue={inv.brideName} required />
          </label>
          <label>
            Orang tua mempelai pria
            <input name="groomParents" defaultValue={inv.groomParents} placeholder="Putra dari Bpk. ... & Ibu ..." />
          </label>
          <label>
            Orang tua mempelai wanita
            <input name="brideParents" defaultValue={inv.brideParents} placeholder="Putri dari Bpk. ... & Ibu ..." />
          </label>
          <label>
            Judul undangan
            <input name="title" defaultValue={inv.title} />
          </label>
          <label>
            Slug URL (bagian setelah domain)
            <input name="slug" defaultValue={inv.slug} required placeholder="ani-with-budi" />
          </label>
          <label>
            Tanggal & jam (WIB)
            <input type="datetime-local" name="eventDate" defaultValue={toJakartaInput(inv.eventDate)} required />
          </label>
          <label>
            Nama lokasi
            <input name="venueName" defaultValue={inv.venueName} />
          </label>
          <label className="span2">
            Alamat lokasi
            <input name="venueAddress" defaultValue={inv.venueAddress} />
          </label>
          <label className="span2">
            Google Maps embed (URL src atau seluruh tag iframe)
            <input name="mapEmbedUrl" defaultValue={inv.mapEmbedUrl} placeholder="https://www.google.com/maps/embed?pb=..." />
          </label>
          <label className="span2">
            Kalimat pembuka
            <textarea name="openingText" rows={3} defaultValue={inv.openingText} />
          </label>
          <label className="span2">
            Kalimat penutup
            <textarea name="closingText" rows={3} defaultValue={inv.closingText} />
          </label>
        </div>

        <h2 style={{ marginTop: "1.5rem" }}>Foto & musik</h2>
        <p className="hint">Unggah file (gambar maks 8 MB, audio maks 15 MB) atau tempel URL.</p>
        <div className="grid2">
          <UploadField name="coverPhoto" label="Foto cover" kind="image" defaultValue={inv.coverPhoto} />
          <UploadField name="musicUrl" label="Musik latar" kind="audio" defaultValue={inv.musicUrl} />
          <UploadField name="groomPhoto" label="Foto mempelai pria" kind="image" defaultValue={inv.groomPhoto} />
          <UploadField name="bridePhoto" label="Foto mempelai wanita" kind="image" defaultValue={inv.bridePhoto} />
          <UploadField
            name="gallery"
            label="Galeri (satu URL per baris)"
            kind="image"
            multiple
            wide
            defaultValue={parseGallery(inv.gallery).join("\n")}
          />
        </div>

        <h2 style={{ marginTop: "1.5rem" }}>Template & tampilan</h2>
        <div className="tpl">
          {TEMPLATES.map((t) => (
            <label key={t.id}>
              <input type="radio" name="template" value={t.id} defaultChecked={inv.template === t.id} />
              <span>
                <strong>{t.name}</strong>
              </span>
              <small>{t.desc}</small>
            </label>
          ))}
        </div>
        <div className="grid2" style={{ marginTop: "0.75rem" }}>
          <PaletteField defaults={{ primary: inv.primaryColor, bg: inv.bgColor, text: inv.textColor }} />
          <label>
            Font judul
            <select name="headingFont" defaultValue={inv.headingFont}>
              {HEADING_FONTS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          <label>
            Font isi
            <select name="bodyFont" defaultValue={inv.bodyFont}>
              {BODY_FONTS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
        </div>
      </ActionForm>

      <div className="card">
        <h2>Ucapan ({inv.wishes.length})</h2>
        {inv.wishes.length === 0 && <p className="hint">Belum ada ucapan.</p>}
        {inv.wishes.map((w) => (
          <div key={w.id} className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <strong>{w.name}</strong>
              <div>{w.message}</div>
            </div>
            <form action={deleteWish.bind(null, inv.id, w.id)}>
              <button className="btn small danger" type="submit">
                Hapus
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Zona berbahaya</h2>
        <form action={deleteInvitation.bind(null, inv.id)}>
          <button className="btn danger" type="submit">
            Hapus undangan ini beserta semua tamunya
          </button>
        </form>
      </div>
        </div>
        <aside className="manage-aside">
          <PreviewFrame path={guestPath(inv.slug, "Tamu Undangan")} formId="invitation-form" />
        </aside>
      </div>
    </>
  );
}
