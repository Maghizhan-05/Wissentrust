import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import {
  PAYMENT_STATUS_LABELS,
  REGISTRATION_STATUS_LABELS,
  type PaymentStatus,
  type RegistrationStatus,
} from "@/lib/constants";

type Tone = "neutral" | "brand" | "success" | "warning" | "alert" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted border-border",
  brand: "bg-brand/12 text-brand border-brand/25",
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/12 text-warning border-warning/30",
  alert: "bg-alert/12 text-alert border-alert/25",
  info: "bg-brand-2/12 text-brand-2 border-brand-2/25",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const PAYMENT_TONE: Record<PaymentStatus, Tone> = {
  unpaid: "neutral",
  uploaded: "info",
  under_review: "warning",
  verified: "success",
  rejected: "alert",
  duplicate: "alert",
};

const REG_TONE: Record<RegistrationStatus, Tone> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "neutral",
  rejected: "alert",
};

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge tone={PAYMENT_TONE[status]}>{PAYMENT_STATUS_LABELS[status]}</Badge>
  );
}

export function RegistrationBadge({ status }: { status: RegistrationStatus }) {
  return (
    <Badge tone={REG_TONE[status]}>{REGISTRATION_STATUS_LABELS[status]}</Badge>
  );
}
