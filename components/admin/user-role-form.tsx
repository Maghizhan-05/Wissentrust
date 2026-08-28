"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setUserRole } from "@/lib/actions/admin";
import type { UserRole } from "@/lib/constants";

export function UserRoleForm({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(next: UserRole) {
    if (next === role) return;
    const fd = new FormData();
    fd.append("user_id", userId);
    fd.append("role", next);
    startTransition(async () => {
      const res = await setUserRole(fd);
      if (res?.ok) {
        toast.success(res.message ?? "Role updated");
        router.refresh();
      } else {
        toast.error(res?.error ?? "Failed");
      }
    });
  }

  return (
    <select
      value={role}
      disabled={pending}
      onChange={(e) => change(e.target.value as UserRole)}
      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  );
}
