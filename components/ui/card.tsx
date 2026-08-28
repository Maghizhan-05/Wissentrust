import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

/** Surface panel used across dashboard, admin and content sections. */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]",
        className,
      )}
      {...props}
    />
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "brand" | "success" | "warning" | "alert" | "neutral";
}) {
  const toneText = {
    brand: "text-brand",
    success: "text-success",
    warning: "text-warning",
    alert: "text-alert",
    neutral: "text-foreground",
  }[tone];
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className={cn("mt-2 font-display text-3xl font-semibold", toneText)}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}
