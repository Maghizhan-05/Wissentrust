"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/field";
import { setAdminAccess } from "@/lib/actions/admin";
import {
  ADMIN_SCOPES,
  ADMIN_SCOPE_LABELS,
  type AdminScope,
  type UserRole,
} from "@/lib/constants";

export function AdminAccessForm({
  userId,
  role: initialRole,
  isSuper: initialSuper,
  scopes: initialScopes,
}: {
  userId: string;
  role: UserRole;
  isSuper: boolean;
  scopes: AdminScope[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isSuper, setIsSuper] = useState(initialSuper);
  const [scopes, setScopes] = useState<AdminScope[]>(initialScopes);

  function toggleScope(s: AdminScope) {
    setScopes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function save() {
    const fd = new FormData();
    fd.append("user_id", userId);
    fd.append("role", role);
    if (role === "admin" && isSuper) fd.append("is_super_admin", "on");
    if (role === "admin" && !isSuper)
      scopes.forEach((s) => fd.append("scopes", s));
    startTransition(async () => {
      const res = await setAdminAccess(fd);
      if (res?.ok) {
        toast.success(res.message ?? "Updated");
        router.refresh();
      } else {
        toast.error(res?.error ?? "Failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </Select>
      </div>

      {role === "admin" && (
        <>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={isSuper}
              onChange={(e) => setIsSuper(e.target.checked)}
              className="size-4 accent-[var(--brand)]"
            />
            Super admin (all permissions)
          </label>

          {!isSuper && (
            <div className="rounded-xl border border-border p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                Permissions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ADMIN_SCOPES.map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={scopes.includes(s)}
                      onChange={() => toggleScope(s)}
                      className="size-4 accent-[var(--brand)]"
                    />
                    {ADMIN_SCOPE_LABELS[s]}
                  </label>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Button onClick={save} loading={pending} size="sm">
        Save access
      </Button>
    </div>
  );
}
