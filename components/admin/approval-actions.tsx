"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { setApproval } from "@/lib/actions/admin";

export function ApprovalActions({
  userId,
  compact,
}: {
  userId: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function act(status: "approved" | "rejected") {
    const fd = new FormData();
    fd.append("user_id", userId);
    fd.append("status", status);
    startTransition(async () => {
      const res = await setApproval(fd);
      if (res?.ok) {
        toast.success(status === "approved" ? "User approved" : "User rejected");
        router.refresh();
      } else {
        toast.error(res?.error ?? "Failed");
      }
    });
  }

  return (
    <div className={compact ? "flex gap-2" : "grid grid-cols-2 gap-3"}>
      <button
        onClick={() => act("approved")}
        disabled={pending}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-success px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <Check className="size-4" /> Approve
      </button>
      <button
        onClick={() => act("rejected")}
        disabled={pending}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-alert px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <X className="size-4" /> Reject
      </button>
    </div>
  );
}
