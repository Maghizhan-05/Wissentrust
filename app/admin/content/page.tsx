import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { LandingEditor } from "@/components/admin/landing-editor";
import { getLandingContent } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Admin · Landing page" };

export default async function AdminContentPage() {
  const content = await getLandingContent();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Landing page
          </h1>
          <p className="mt-1 text-sm text-muted">
            Edit everything on the public home page — no developer needed.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
        >
          Preview <ArrowUpRight className="size-4" />
        </a>
      </div>

      <LandingEditor initial={content} />
    </div>
  );
}
