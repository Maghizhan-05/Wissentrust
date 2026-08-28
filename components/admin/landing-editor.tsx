"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea, Label } from "@/components/ui/field";
import { updateLandingContent, type ContentState } from "@/lib/actions/content";
import type {
  LabelValue,
  LandingContent,
  TitledBody,
} from "@/lib/content/landing";

/* ── small building blocks ─────────────────────────────────── */

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h2>
        {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      </div>
      {children}
    </Card>
  );
}

function Text({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {textarea ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function AddRemoveHeader({
  label,
  onAdd,
}: {
  label: string;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="mb-0">{label}</Label>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-2"
      >
        <Plus className="size-3.5" /> Add
      </button>
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Remove"
      className="rounded-md p-2 text-muted hover:bg-alert/10 hover:text-alert"
    >
      <Trash2 className="size-4" />
    </button>
  );
}

/* ── list editors ──────────────────────────────────────────── */

function ParagraphList({
  items,
  onChange,
}: {
  items: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <AddRemoveHeader label="Paragraphs" onAdd={() => onChange([...items, ""])} />
      {items.map((p, i) => (
        <div key={i} className="flex gap-2">
          <Textarea
            value={p}
            rows={2}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
    </div>
  );
}

function TitledBodyList({
  label,
  items,
  onChange,
}: {
  label: string;
  items: TitledBody[];
  onChange: (v: TitledBody[]) => void;
}) {
  return (
    <div className="space-y-3">
      <AddRemoveHeader
        label={label}
        onAdd={() => onChange([...items, { title: "", body: "" }])}
      />
      {items.map((it, i) => (
        <div key={i} className="flex gap-2 rounded-xl border border-border p-3">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Title"
              value={it.title}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...it, title: e.target.value };
                onChange(next);
              }}
            />
            <Textarea
              placeholder="Body"
              rows={2}
              value={it.body}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...it, body: e.target.value };
                onChange(next);
              }}
            />
          </div>
          <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
    </div>
  );
}

function LabelValueList({
  items,
  onChange,
}: {
  items: LabelValue[];
  onChange: (v: LabelValue[]) => void;
}) {
  return (
    <div className="space-y-2">
      <AddRemoveHeader
        label="Items"
        onAdd={() => onChange([...items, { label: "", value: "" }])}
      />
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <Input
            placeholder="Label"
            className="max-w-[40%]"
            value={it.label}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...it, label: e.target.value };
              onChange(next);
            }}
          />
          <Input
            placeholder="Value"
            value={it.value}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...it, value: e.target.value };
              onChange(next);
            }}
          />
          <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
    </div>
  );
}

/* ── main editor ───────────────────────────────────────────── */

export function LandingEditor({ initial }: { initial: LandingContent }) {
  const [c, setC] = useState<LandingContent>(initial);
  const [state, action, pending] = useActionState<ContentState, FormData>(
    updateLandingContent,
    null,
  );

  useEffect(() => {
    if (state?.ok) toast.success(state.message);
    else if (state && !state.ok) toast.error(state.error);
  }, [state]);

  // typed section updaters
  const up = <K extends keyof LandingContent>(
    key: K,
    patch: Partial<LandingContent[K]>,
  ) => setC((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Section title="Hero" hint="The first thing visitors see.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Eyebrow" value={c.hero.eyebrow} onChange={(v) => up("hero", { eyebrow: v })} />
          <Text label="Date" value={c.hero.date} onChange={(v) => up("hero", { date: v })} />
          <Text label="Title" value={c.hero.titleLine1} onChange={(v) => up("hero", { titleLine1: v })} />
          <Text label="Title accent (teal)" value={c.hero.titleAccent} onChange={(v) => up("hero", { titleAccent: v })} />
          <Text label="Tagline line 1" value={c.hero.taglineLine1} onChange={(v) => up("hero", { taglineLine1: v })} />
          <Text label="Tagline line 2" value={c.hero.taglineLine2} onChange={(v) => up("hero", { taglineLine2: v })} />
          <Text label="Venue" value={c.hero.venue} onChange={(v) => up("hero", { venue: v })} />
          <Text label="Primary button" value={c.hero.ctaPrimary} onChange={(v) => up("hero", { ctaPrimary: v })} />
          <Text label="Secondary button" value={c.hero.ctaSecondary} onChange={(v) => up("hero", { ctaSecondary: v })} />
        </div>
        <Text label="Description" textarea value={c.hero.description} onChange={(v) => up("hero", { description: v })} />
      </Section>

      <Section title="Introduction">
        <div className="grid gap-4 sm:grid-cols-3">
          <Text label="Number" value={c.intro.index} onChange={(v) => up("intro", { index: v })} />
          <Text label="Eyebrow" value={c.intro.eyebrow} onChange={(v) => up("intro", { eyebrow: v })} />
          <div className="sm:col-span-3">
            <Text label="Title" value={c.intro.title} onChange={(v) => up("intro", { title: v })} />
          </div>
        </div>
        <ParagraphList items={c.intro.paragraphs} onChange={(v) => up("intro", { paragraphs: v })} />
      </Section>

      <Section title="Categories heading">
        <div className="grid gap-4 sm:grid-cols-3">
          <Text label="Number" value={c.categories.index} onChange={(v) => up("categories", { index: v })} />
          <Text label="Eyebrow" value={c.categories.eyebrow} onChange={(v) => up("categories", { eyebrow: v })} />
          <Text label="Title" value={c.categories.title} onChange={(v) => up("categories", { title: v })} />
        </div>
        <Text label="Description" textarea value={c.categories.description} onChange={(v) => up("categories", { description: v })} />
      </Section>

      <Section title="Featured heading">
        <div className="grid gap-4 sm:grid-cols-3">
          <Text label="Number" value={c.featured.index} onChange={(v) => up("featured", { index: v })} />
          <Text label="Eyebrow" value={c.featured.eyebrow} onChange={(v) => up("featured", { eyebrow: v })} />
          <Text label="Title" value={c.featured.title} onChange={(v) => up("featured", { title: v })} />
        </div>
      </Section>

      <Section title="Why participate" hint="Icons stay fixed; edit the text.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Text label="Number" value={c.why.index} onChange={(v) => up("why", { index: v })} />
          <Text label="Eyebrow" value={c.why.eyebrow} onChange={(v) => up("why", { eyebrow: v })} />
          <Text label="Title" value={c.why.title} onChange={(v) => up("why", { title: v })} />
        </div>
        <TitledBodyList label="Reasons" items={c.why.points} onChange={(v) => up("why", { points: v })} />
      </Section>

      <Section title="The experience (journey)" hint="Icons stay fixed; edit the text.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Text label="Number" value={c.journey.index} onChange={(v) => up("journey", { index: v })} />
          <Text label="Eyebrow" value={c.journey.eyebrow} onChange={(v) => up("journey", { eyebrow: v })} />
          <Text label="Title" value={c.journey.title} onChange={(v) => up("journey", { title: v })} />
        </div>
        <TitledBodyList label="Steps" items={c.journey.steps} onChange={(v) => up("journey", { steps: v })} />
      </Section>

      <Section title="Important information">
        <div className="grid gap-4 sm:grid-cols-3">
          <Text label="Number" value={c.info.index} onChange={(v) => up("info", { index: v })} />
          <Text label="Eyebrow" value={c.info.eyebrow} onChange={(v) => up("info", { eyebrow: v })} />
          <Text label="Title" value={c.info.title} onChange={(v) => up("info", { title: v })} />
        </div>
        <LabelValueList items={c.info.items} onChange={(v) => up("info", { items: v })} />
      </Section>

      <Section title="Final call-to-action">
        <Text label="Title" value={c.finalCta.title} onChange={(v) => up("finalCta", { title: v })} />
        <Text label="Description" textarea value={c.finalCta.description} onChange={(v) => up("finalCta", { description: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Primary button" value={c.finalCta.ctaPrimary} onChange={(v) => up("finalCta", { ctaPrimary: v })} />
          <Text label="Secondary button" value={c.finalCta.ctaSecondary} onChange={(v) => up("finalCta", { ctaSecondary: v })} />
        </div>
      </Section>

      <Section title="Footer">
        <div className="grid gap-4 sm:grid-cols-3">
          <Text label="Tagline" value={c.footer.tagline} onChange={(v) => up("footer", { tagline: v })} />
          <Text label="Contact email" value={c.footer.contactEmail} onChange={(v) => up("footer", { contactEmail: v })} />
          <Text label="Dates" value={c.footer.dates} onChange={(v) => up("footer", { dates: v })} />
        </div>
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" loading={pending} className="shadow-lg">
          Save landing page
        </Button>
      </div>
    </form>
  );
}
