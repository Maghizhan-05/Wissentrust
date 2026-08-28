import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Numbered editorial section heading (e.g. "01 — Featured Events"). */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {(index || eyebrow) && (
        <div
          className={cn(
            "mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-brand",
            align === "center" && "justify-center",
          )}
        >
          {index && <span className="font-mono">{index}</span>}
          {index && eyebrow && <span className="h-px w-8 bg-brand/40" />}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
