"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Flag } from "lucide-react";
import { setPaymentStatus } from "@/lib/actions/admin";

export function PaymentReviewActions({
  registrationId,
}: {
  registrationId: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  function act(status: "verified" | "rejected" | "duplicate") {
    const fd = new FormData();
    fd.append("registration_id", registrationId);
    fd.append("status", status);
    fd.append("note", note);
    startTransition(async () => {
      const res = await setPaymentStatus(fd);
      if (res?.ok) {
        toast.success(res.message ?? "Updated");
        router.refresh();
      } else {
        toast.error(res?.error ?? "Failed to update");
      }
    });
  }

  return (
    <div className="space-y-3">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note (reason for rejection, etc.)"
        rows={2}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/70"
      />
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => act("verified")}
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-success px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Check className="size-4" /> Verify
        </button>
        <button
          onClick={() => act("rejected")}
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-alert px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <X className="size-4" /> Reject
        </button>
        <button
          onClick={() => act("duplicate")}
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2.5 text-sm font-medium text-warning transition-colors hover:bg-warning/20 disabled:opacity-50"
        >
          <Flag className="size-4" /> Flag
        </button>
      </div>
    </div>
  );
}
