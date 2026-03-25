"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import PageShell from "./PageShell";

interface GameEvent {
  id: string;
  name: string;
  description: string;
  effects: Array<{ type: string; value: number }>;
  endsAt: string;
  entryFee: number;
  joined: boolean;
}

export default function EventsClient({
  events,
  discordId: _discordId,
}: {
  events: GameEvent[];
  discordId: string;
}) {
  const [joining, setJoining] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  const [joined, setJoined] = useState<Set<string>>(
    new Set(events.filter((e) => e.joined).map((e) => e.id)),
  );

  async function handleJoin(eventId: string, fee: number) {
    if (!confirm(`Join this event for $${fee.toLocaleString()}?`)) return;
    setJoining(eventId);
    try {
      const res = await fetch(`/api/dashboard/events/${eventId}/join`, { method: "POST" });
      const data = (await res.json()) as { success?: boolean; feePaid?: number };
      if (data.success) {
        setJoined((s) => new Set([...s, eventId]));
        setResults((r) => ({ ...r, [eventId]: `Joined! Fee paid: $${data.feePaid?.toLocaleString()}` }));
      } else {
        setResults((r) => ({ ...r, [eventId]: "Failed to join." }));
      }
    } finally {
      setJoining(null);
    }
  }

  return (
    <PageShell title="Events" subtitle="Active events you can participate in.">
      {events.length === 0 ? (
        <Empty />
      ) : (
        <div className="space-y-3">
          {events.map((event, i) => {
            const isJoined = joined.has(event.id);
            const endsAt = new Date(event.endsAt);
            const hoursLeft = Math.max(0, Math.floor((endsAt.getTime() - Date.now()) / 36e5));

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl border p-5 ${isJoined ? "border-green-500/20 bg-green-500/5" : "border-border bg-surface"}`}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-text">{event.name}</h3>
                      {isJoined && (
                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                          Joined
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">{event.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-accent">${event.entryFee.toLocaleString()}</p>
                    <p className="text-[11px] text-muted">entry fee</p>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  {event.effects.map((e, j) => (
                    <span key={j} className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                      +{e.value}% {e.type.replace(/_/g, " ")}
                    </span>
                  ))}
                  <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                    ⏱ {hoursLeft}h left
                  </span>
                </div>

                <AnimatePresence>
                  {results[event.id] && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-2 text-xs font-medium text-green-400"
                    >
                      {results[event.id]}
                    </motion.p>
                  )}
                </AnimatePresence>

                {!isJoined && (
                  <motion.button
                    onClick={() => handleJoin(event.id, event.entryFee)}
                    disabled={joining === event.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-accent py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {joining === event.id ? "Joining…" : "Join Event"}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-10 text-center">
      <p className="text-sm text-muted">No active events right now. Check back later!</p>
    </div>
  );
}
