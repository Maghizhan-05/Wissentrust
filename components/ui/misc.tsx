import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-5 animate-spin text-brand", className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
      {icon && <div className="mb-4 text-muted">{icon}</div>}
      <p className="font-display text-lg font-semibold text-foreground">
        {title}
      </p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Thin animated ECG divider between sections. */
export function EcgDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden py-6", className)} aria-hidden>
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="h-8 w-full text-brand/40"
      >
        <path
          className="ecg-anim"
          d="M0 20 H420 l16 -14 l14 28 l16 -34 l18 40 l14 -20 H1200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
