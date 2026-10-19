import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/actions/admin";
import "../admin.css";

export const metadata = { title: "Admin Undangan", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin-page">
      <div className="admin">
        <header className="top">
          <Link href="/admin">
            <strong>Admin Undangan</strong>
          </Link>
          <form action={logout}>
            <button className="btn small" type="submit">
              Keluar
            </button>
          </form>
        </header>
        {children}
      </div>
    </div>
  );
}
