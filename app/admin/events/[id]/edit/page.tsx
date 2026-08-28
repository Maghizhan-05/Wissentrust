import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sheet } from "lucide-react";
import { EventForm } from "@/components/admin/event-form";
import { updateEvent } from "@/lib/actions/admin";
import { getEventByIdAdmin } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Admin · Edit event" };

export default async function EditEventPage({
  params,
}: PageProps<"/admin/events/[id]/edit">) {
  const { id } = await params;
  const event = await getEventByIdAdmin(id);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to events
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
        Edit event
      </h1>
      <p className="mt-1 text-sm text-muted">{event.title}</p>
      <div className="mt-8">
        <EventForm action={updateEvent} event={event} />
      </div>
    </div>
  );
}
