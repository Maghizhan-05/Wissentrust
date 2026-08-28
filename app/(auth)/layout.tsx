import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SITE } from "@/lib/constants";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-border bg-surface lg:block">
        <div className="brand-glow absolute inset-0" />
        <div className="medical-grid absolute inset-0 opacity-50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link
            href="/"
            className="font-display text-xl font-semibold text-foreground"
          >
            {SITE.name}
          </Link>
          <div>
            <Stethoscope className="size-10 text-brand" strokeWidth={1.25} />
            <p className="mt-6 max-w-sm font-display text-3xl font-semibold leading-tight text-foreground">
              {SITE.tagline}.
            </p>
            <p className="mt-3 max-w-sm text-muted">
              One account, one participant ID, every event. Register in minutes.
            </p>
          </div>
          <p className="text-xs text-muted">© 2027 {SITE.name}</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-5 lg:justify-end">
          <Link
            href="/"
            className="font-display text-lg font-semibold text-foreground lg:hidden"
          >
            {SITE.name}
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
