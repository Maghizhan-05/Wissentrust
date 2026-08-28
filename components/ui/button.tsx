import Link from "next/link";
import { forwardRef } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-contrast hover:brightness-110 hover:-translate-y-0.5 " +
    "shadow-[0_8px_24px_-8px_var(--brand)]",
  secondary:
    "bg-surface-2 text-foreground hover:bg-surface-2/70 border border-border",
  outline:
    "border border-brand/50 text-brand hover:bg-brand/10 hover:border-brand",
  ghost: "text-foreground hover:bg-surface-2",
  danger: "bg-alert text-white hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  withArrow?: boolean;
  children?: ReactNode;
  className?: string;
}

const ArrowContent = ({
  children,
  withArrow,
  loading,
}: Pick<CommonProps, "children" | "withArrow" | "loading">) => (
  <>
    {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
    <span className="inline-flex items-center gap-2">{children}</span>
    {withArrow && !loading && (
      <span
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-1"
      >
        →
      </span>
    )}
  </>
);

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps>;

export const Button = forwardRef<HTMLButtonElement, ButtonAsButton>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading,
      withArrow,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        <ArrowContent withArrow={withArrow} loading={loading}>
          {children}
        </ArrowContent>
      </button>
    );
  },
);

type ButtonLinkProps = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps>;

/** Same visual language as Button, rendered as a Next.js Link. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  withArrow,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      <ArrowContent withArrow={withArrow}>{children}</ArrowContent>
    </Link>
  );
}
