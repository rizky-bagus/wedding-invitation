"use client";

import { useActionState } from "react";

type Action = (prev: string | null, fd: FormData) => Promise<string | null>;

export default function ActionForm({
  action,
  children,
  submit = "Simpan",
  className,
}: {
  action: Action;
  children: React.ReactNode;
  submit?: string;
  className?: string;
}) {
  const [message, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="row">
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Memproses..." : submit}
        </button>
        {message && <span className="msg">{message}</span>}
      </div>
    </form>
  );
}
