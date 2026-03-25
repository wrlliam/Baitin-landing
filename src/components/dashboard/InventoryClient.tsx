"use client";

import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDashboardStore } from "~/store/dashboard";
import PageShell from "./PageShell";

interface SackItem {
  itemId: string;
  itemType: string;
  name: string;
  emoji: string;
  rarity: string;
  quantity: number;
  sellPrice: number;
}

const RARITY_COLOR: Record<string, string> = {
  common: "text-zinc-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-orange-400",
  mythic: "text-red-400",
};

export default function InventoryClient({
  items,
  discordId: _discordId,
}: {
  items: SackItem[];
  discordId: string;
}) {
  const router = useRouter();
  const [selling, setSelling] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const { selectedInventoryItems, toggleInventoryItem, setInventoryItemQty, clearInventorySelection } =
    useDashboardStore();

  const selectedEntries = Array.from(selectedInventoryItems.entries());
  const totalItems = selectedEntries.reduce((sum, [, qty]) => sum + qty, 0);
  const totalEarnings = selectedEntries.reduce((sum, [id, qty]) => {
    const item = items.find((i) => i.itemId === id);
    return sum + (item?.sellPrice ?? 0) * qty;
  }, 0);

  async function handleSell() {
    if (selectedEntries.length === 0) return;
    setSelling(true);
    try {
      const res = await fetch("/api/dashboard/sack/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedEntries.map(([id, qty]) => ({ itemId: id, quantity: qty })),
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        setResult({ ok: false, msg: err.error ?? `Failed to sell (${res.status})` });
        return;
      }
      const data = (await res.json()) as { success?: boolean; data?: { coinsEarned?: number } };
      if (data.success) {
        const earned = data.data?.coinsEarned ?? totalEarnings;
        setResult({ ok: true, msg: `Sold ${totalItems} item${totalItems > 1 ? "s" : ""} for $${earned.toLocaleString()}` });
        clearInventorySelection();
        router.refresh();
      } else {
        setResult({ ok: false, msg: "Failed to sell items." });
      }
    } catch {
      setResult({ ok: false, msg: "Network error. Try again." });
    } finally {
      setSelling(false);
      setTimeout(() => setResult(null), 4000);
    }
  }

  return (
    <PageShell
      title="Inventory"
      subtitle={`${items.length} items in your sack`}
      action={
        selectedEntries.length > 0 ? (
          <motion.button
            onClick={handleSell}
            disabled={selling}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {selling ? "Selling…" : `Sell ${totalItems} ($${totalEarnings.toLocaleString()})`}
          </motion.button>
        ) : undefined
      }
    >
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

      {items.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const selected = selectedInventoryItems.has(item.itemId);
            const selectedQty = selectedInventoryItems.get(item.itemId) ?? 0;
            return (
              <motion.div
                key={item.itemId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  selected
                    ? "border-accent bg-accent/10 ring-1 ring-accent/40"
                    : "border-border bg-surface hover:border-border-bright"
                }`}
              >
                <button
                  className="w-full text-left"
                  onClick={() => toggleInventoryItem(item.itemId, item.quantity)}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-2xl">{item.emoji}</span>
                    {selected && <span className="text-xs font-semibold text-accent">Selected</span>}
                  </div>
                  <p className="font-medium text-text">{item.name}</p>
                  <p className={`text-xs capitalize ${RARITY_COLOR[item.rarity] ?? "text-muted"}`}>
                    {item.rarity}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted">
                    <span>×{item.quantity} owned</span>
                    <span>${item.sellPrice.toLocaleString()} each</span>
                  </div>
                </button>

                {selected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 flex items-center justify-between border-t border-border pt-3"
                  >
                    <span className="text-xs text-muted">
                      Sell {selectedQty} = ${(selectedQty * item.sellPrice).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setInventoryItemQty(item.itemId, selectedQty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted transition-colors hover:text-text"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-text">
                        {selectedQty}
                      </span>
                      <button
                        onClick={() => setInventoryItemQty(item.itemId, Math.min(item.quantity, selectedQty + 1))}
                        disabled={selectedQty >= item.quantity}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted transition-colors hover:text-text disabled:opacity-40"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                      {item.quantity > 1 && (
                        <button
                          onClick={() => setInventoryItemQty(item.itemId, item.quantity)}
                          className="ml-1 rounded-lg px-2 py-1 text-[10px] font-medium text-accent transition-colors hover:bg-accent/10"
                        >
                          All
                        </button>
                      )}
                    </div>
                  </motion.div>
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
      <p className="text-sm text-muted">Your sack is empty. Start fishing to fill it up!</p>
    </div>
  );
}
