"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/util";

type Action = (prev: ActionResult, fd: FormData) => Promise<ActionResult>;

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
  const [result, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="row">
        <button type="submit" className="btn" disabled={pending}>
          {pending ? "Memproses..." : submit}
        </button>
        {result && (
          <span className={result.ok ? "msg" : "msg err"} role={result.ok ? "status" : "alert"}>
            {result.message}
          </span>
        )}
      </div>
    </form>
  );
}
