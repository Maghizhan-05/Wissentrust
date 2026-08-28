import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Star, Trash2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";
import { getAllEventsAdmin } from "@/lib/data/admin";
import { deleteEvent, toggleEventFlag } from "@/lib/actions/admin";
import { EVENT_CATEGORY_LABELS } from "@/lib/constants";
import { formatEventDate, formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Events" };

export default async function AdminEventsPage() {
  const events = await getAllEventsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Events
          </h1>
          <p className="mt-1 text-sm text-muted">{events.length} total</p>
        </div>
        <ButtonLink href="/admin/events/new" size="sm">
          <Plus className="size-4" /> New event
        </ButtonLink>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create your first event to open registrations."
          action={
            <ButtonLink href="/admin/events/new">
              <Plus className="size-4" /> New event
            </ButtonLink>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-surface-2/50 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Fee</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((e) => (
                <tr key={e.id} className="bg-surface hover:bg-surface-2/40">
                  <td className="px-4 py-3">
                    <Link href={`/events/${e.slug}`} className="font-medium text-foreground hover:text-brand">
                      {e.title}
                    </Link>
                    <p className="text-xs text-muted">/{e.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {EVENT_CATEGORY_LABELS[e.category]}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatEventDate(e.event_date)}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted">
                    {e.registration_fee === 0 ? "Free" : formatINR(e.registration_fee)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge tone={e.registration_open ? "success" : "neutral"}>
                        {e.registration_open ? "Open" : "Closed"}
                      </Badge>
                      {e.featured && <Badge tone="brand">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <form action={toggleEventFlag}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="field" value="featured" />
                        <input type="hidden" name="value" value={String(e.featured)} />
                        <button
                          type="submit"
                          title="Toggle featured"
                          className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-brand"
                        >
                          <Star className={e.featured ? "size-4 fill-brand text-brand" : "size-4"} />
                        </button>
                      </form>
                      <Link
                        href={`/admin/events/${e.id}/edit`}
                        title="Edit"
                        className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-foreground"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <form action={deleteEvent}>
                        <input type="hidden" name="id" value={e.id} />
                        <button
                          type="submit"
                          title="Delete event"
                          className="rounded-md p-2 text-muted hover:bg-alert/10 hover:text-alert"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
