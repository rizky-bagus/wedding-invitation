import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { login } from "@/app/actions/admin";
import ActionForm from "@/components/admin/ActionForm";
import Brand from "@/components/admin/Brand";
import "../admin.css";

export const metadata = { title: "Masuk Admin" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="admin-page login-page">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap"
      />
      <div className="login-card">
        <Brand />
        <h1>Selamat datang</h1>
        <p className="hint">Masuk untuk mengelola undangan pernikahan Anda.</p>
        <ActionForm action={login} submit="Masuk">
          <label>
            Password
            <input type="password" name="password" required autoFocus />
          </label>
        </ActionForm>
      </div>
    </div>
  );
}
