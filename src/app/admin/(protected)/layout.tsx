import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/actions/admin";
import Brand from "@/components/admin/Brand";
import "../admin.css";

export const metadata = { title: "Admin Undangan", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin-page">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap"
      />
      <header className="topbar">
        <div className="topbar-in">
          <Link href="/admin" aria-label="Beranda admin">
            <Brand />
          </Link>
          <form action={logout}>
            <button className="btn small ghost" type="submit">
              Keluar
            </button>
          </form>
        </div>
      </header>
      <div className="admin">{children}</div>
    </div>
  );
}
