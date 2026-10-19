import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { login } from "@/app/actions/admin";
import ActionForm from "@/components/admin/ActionForm";
import "../admin.css";

export const metadata = { title: "Masuk Admin" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="admin-page">
      <div className="admin login">
        <div className="card">
          <h1>Masuk Admin</h1>
          <ActionForm action={login} submit="Masuk">
            <label>
              Password
              <input type="password" name="password" required autoFocus />
            </label>
          </ActionForm>
        </div>
      </div>
    </div>
  );
}
