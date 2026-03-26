"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageShell from "./PageShell";

export interface Equipment {
  rod: {
    id: string;
    name: string;
    emoji: string;
    rarity: string;
    luckBonus: number;
    speedReduction: number;
    durability: number;
    buyPrice: number;
  } | null;
  bait: {
    id: string;
    name: string;
    emoji: string;
    rarity: string;
    quantity: number;
  } | null;
}

interface OwnedRod {
  id: string;
  name: string;
  emoji: string;
  rarity: string;
  luckBonus: number;
  speedReduction: number;
  durability: number;
  buyPrice: number;
  equipped: boolean;
}

const RARITY_COLOR: Record<string, string> = {
  common: "text-zinc-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-orange-400",
  mythic: "text-red-400",
};

export default function EquipmentClient({
  equipment,
  discordId: _discordId,
}: {
  equipment: Equipment | null;
  discordId: string;
}) {
  const router = useRouter();
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [equipping, setEquipping] = useState<string | null>(null);
  const [showRods, setShowRods] = useState(false);
  const [ownedRods, setOwnedRods] = useState<OwnedRod[] | null>(null);
  const [loadingRods, setLoadingRods] = useState(false);

  async function loadRods() {
    setLoadingRods(true);
    try {
      const res = await fetch("/api/dashboard/equipment/rods");
      const data = (await res.json()) as { success?: boolean; data?: { rods: OwnedRod[] } };
      setOwnedRods(data.data?.rods ?? []);
    } catch {
      setOwnedRods([]);
    } finally {
      setLoadingRods(false);
    }
  }

  async function handleEquip(rodId: string) {
    setEquipping(rodId);
    setResult(null);
    try {
      const res = await fetch("/api/dashboard/equipment/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rodId }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        setResult({ ok: false, msg: err.error ?? `Failed (${res.status})` });
        return;
      }
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data.success) {
        setResult({ ok: true, msg: "Rod equipped!" });
        setShowRods(false);
        setOwnedRods(null);
        router.refresh();
      } else {
        setResult({ ok: false, msg: data.error ?? "Failed to equip rod." });
      }
    } catch {
      setResult({ ok: false, msg: "Network error. Try again." });
    } finally {
      setEquipping(null);
      setTimeout(() => setResult(null), 4000);
    }
  }

  function openRodBrowser() {
    setShowRods(true);
    if (!ownedRods) void loadRods();
  }

  if (!equipment) {
    return (
      <PageShell title="Equipment" subtitle="Manage your rod and bait.">
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <p className="text-sm text-muted">No equipment data available.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Equipment" subtitle="Manage your rod and bait.">
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
              result.ok
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {result.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Rod card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-surface p-5"
        >
          {equipment.rod ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{equipment.rod.emoji}</span>
                <div>
                  <p className="font-bold text-text">{equipment.rod.name}</p>
                  <p className={`text-xs capitalize ${RARITY_COLOR[equipment.rod.rarity] ?? "text-muted"}`}>
                    {equipment.rod.rarity}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <Stat label="Luck Bonus" value={`+${equipment.rod.luckBonus}%`} />
                <Stat label="Speed" value={`-${equipment.rod.speedReduction}s`} />
                <Stat label="Durability" value={equipment.rod.durability > 0 ? `${equipment.rod.durability}` : "∞"} />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">No rod equipped</p>
          )}

          <motion.button
            onClick={openRodBrowser}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full rounded-xl border border-border bg-surface-2 py-2 text-sm font-semibold text-text hover:border-accent hover:text-accent transition-colors"
          >
            Change Rod
          </motion.button>
        </motion.div>

        {/* Bait card */}
        {equipment.bait ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl">{equipment.bait.emoji}</span>
              <div>
                <p className="font-bold text-text">{equipment.bait.name}</p>
                <p className={`text-xs capitalize ${RARITY_COLOR[equipment.bait.rarity] ?? "text-muted"}`}>
                  {equipment.bait.rarity}
                </p>
              </div>
            </div>
            <Stat label="Remaining" value={`×${equipment.bait.quantity}`} />
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-5 text-center">
            <p className="text-sm text-muted">No bait equipped</p>
            <p className="mt-1 text-xs text-muted">Equip bait from your inventory via /equip in Discord</p>
          </div>
        )}
      </div>

      {/* Rod browser panel */}
      <AnimatePresence>
        {showRods && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-4 rounded-2xl border border-border bg-surface p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-text">Your Rods</p>
              <button
                onClick={() => setShowRods(false)}
                className="text-xs text-muted hover:text-text transition-colors"
              >
                Close
              </button>
            </div>

            {loadingRods ? (
              <p className="py-4 text-center text-sm text-muted">Loading…</p>
            ) : !ownedRods?.length ? (
              <p className="py-4 text-center text-sm text-muted">
                No other rods in your inventory. Buy rods in-game with <code className="text-xs">/shop</code>.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {ownedRods.map((rod) => (
                  <div
                    key={rod.id}
                    className={`rounded-xl border p-4 ${rod.equipped ? "border-accent bg-accent/5" : "border-border bg-surface-2"}`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">{rod.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text">{rod.name}</p>
                        <p className={`text-xs capitalize ${RARITY_COLOR[rod.rarity] ?? "text-muted"}`}>
                          {rod.rarity}
                        </p>
                      </div>
                      {rod.equipped && (
                        <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent">
                          Equipped
                        </span>
                      )}
                    </div>
                    <div className="mb-3 grid grid-cols-3 gap-1 text-[11px] text-muted">
                      <span>+{rod.luckBonus}% luck</span>
                      <span>-{rod.speedReduction}s spd</span>
                      <span>{rod.durability > 0 ? `${rod.durability} dur` : "∞ dur"}</span>
                    </div>
                    {!rod.equipped && (
                      <motion.button
                        onClick={() => handleEquip(rod.id)}
                        disabled={equipping === rod.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full rounded-lg bg-accent py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        {equipping === rod.id ? "Equipping…" : "Equip"}
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-text">{value}</span>
    </div>
  );
}
