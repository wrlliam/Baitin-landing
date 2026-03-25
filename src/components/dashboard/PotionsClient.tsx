"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import PageShell from "./PageShell";

interface PotionEffect {
  type: string;
  amount: number;
  durationMinutes: number;
}

interface Potion {
  itemId: string;
  name: string;
  emoji: string;
  rarity: string;
  quantity: number;
  effects: PotionEffect[];
  activeUntil?: string;
}

const RARITY_COLOR: Record<string, string> = {
  common: "text-zinc-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-orange-400",
  mythic: "text-red-400",
};

export default function PotionsClient({
  potions,
  discordId: _discordId,
}: {
  potions: Potion[];
  discordId: string;
}) {
  const [activating, setActivating] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  async function handleActivate(itemId: string) {
    setActivating(itemId);
    try {
      const res = await fetch(`/api/dashboard/potions/${itemId}/activate`, {
        method: "POST",
      });
      const data = (await res.json()) as { success?: boolean; activeUntil?: string };
      setResults((r) => ({
        ...r,
        [itemId]: data.success
          ? `Active until ${new Date(data.activeUntil!).toLocaleTimeString()}`
          : "Failed to activate.",
      }));
    } finally {
      setActivating(null);
    }
  }

  return (
    <PageShell title="Potions" subtitle="Activate potions for temporary buffs.">
      {potions.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {potions.map((potion, i) => {
            const isActive = potion.activeUntil && new Date(potion.activeUntil) > new Date();
            return (
              <motion.div
                key={potion.itemId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border p-5 ${isActive ? "border-accent/30 bg-accent/5" : "border-border bg-surface"}`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">{potion.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-text">{potion.name}</p>
                    <p className={`text-xs capitalize ${RARITY_COLOR[potion.rarity] ?? "text-muted"}`}>
                      {potion.rarity} · ×{potion.quantity}
                    </p>
                  </div>
                  {isActive && <span className="ml-auto text-xs font-medium text-accent">Active</span>}
                </div>

                <div className="mb-3 space-y-1">
                  {potion.effects.map((e, j) => (
                    <p key={j} className="text-xs text-muted">
                      +{e.amount}% {e.type.replace(/_/g, " ")} for {e.durationMinutes}m
                    </p>
                  ))}
                </div>

                <AnimatePresence>
                  {results[potion.itemId] && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-2 text-xs font-medium text-green-400"
                    >
                      {results[potion.itemId]}
                    </motion.p>
                  )}
                </AnimatePresence>

                {!isActive && (
                  <motion.button
                    onClick={() => handleActivate(potion.itemId)}
                    disabled={activating === potion.itemId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-accent py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {activating === potion.itemId ? "Activating…" : "Activate"}
                  </motion.button>
                )}

                {isActive && (
                  <p className="text-center text-xs text-muted">
                    Expires {new Date(potion.activeUntil!).toLocaleTimeString()}
                  </p>
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
      <p className="text-sm text-muted">No potions in your sack.</p>
    </div>
  );
}
