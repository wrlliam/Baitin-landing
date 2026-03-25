"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Select from "~/components/ui/Select";
import { useDashboardStore } from "~/store/dashboard";
import PageShell from "./PageShell";

export interface InventoryItem {
  itemId: string;
  itemType: string;
  name: string;
  emoji: string;
  rarity: string;
  quantity: number;
  sellPrice: number;
}

interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string;
  item: { name: string; emoji: string; rarity: string };
  price: number;
  quantity: number;
  bidding: boolean;
  highestBid: number | null;
  endsAt: string | null;
}

const RARITY_COLOR: Record<string, string> = {
  common: "text-zinc-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-orange-400",
  mythic: "text-red-400",
};

const SORT_OPTIONS = [
  { value: "price_asc",  label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "newest",     label: "Newest" },
];

const TYPE_OPTIONS = ["all", "fish", "rod", "bait", "potion", "pet"];

export default function MarketClient({
  initialListings,
  initialTotal,
  inventory,
  discordId: _discordId,
}: {
  initialListings: MarketListing[];
  initialTotal: number;
  inventory: InventoryItem[];
  discordId: string;
}) {
  const router = useRouter();
  const [listings, setListings] = useState(initialListings);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [actioning, setActioning] = useState<string | null>(null);
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [listOpen, setListOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [listQty, setListQty] = useState("1");
  const [listError, setListError] = useState<string | null>(null);
  const [listing, setListing] = useState(false);
  const [actionResults, setActionResults] = useState<Record<string, string>>({});

  const selectedItem = useMemo(
    () => inventory.find((i) => i.itemId === selectedItemId),
    [inventory, selectedItemId],
  );

  const { marketFilters, setMarketFilter } = useDashboardStore();

  async function fetchListings(filters = marketFilters) {
    setLoading(true);
    const qs = new URLSearchParams({
      page: String(filters.page),
      limit: "20",
      sort: filters.sort,
      ...(filters.type !== "all" && { type: filters.type }),
    });
    try {
      const res = await fetch(`/api/dashboard/market?${qs}`);
      const data = (await res.json()) as { listings?: MarketListing[]; total?: number };
      setListings(data.listings ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }

  function applyFilter(key: string, value: string | number) {
    const next = { ...marketFilters, [key]: value, page: key === "page" ? (value as number) : 1 };
    setMarketFilter(key, value);
    void fetchListings(next);
  }

  async function handleBuy(listingId: string) {
    setActioning(listingId);
    try {
      const res = await fetch(`/api/dashboard/market/${listingId}/buy`, { method: "POST" });
      const data = (await res.json()) as { success?: boolean; costPaid?: number; error?: string };
      if (data.success) {
        setActionResults((r) => ({ ...r, [listingId]: `Bought for $${(data.costPaid ?? 0).toLocaleString()}!` }));
        void fetchListings();
      } else {
        setActionResults((r) => ({ ...r, [listingId]: data.error ?? "Purchase failed" }));
      }
    } catch {
      setActionResults((r) => ({ ...r, [listingId]: "Network error" }));
    }
    setActioning(null);
    setTimeout(() => setActionResults((r) => { const copy = { ...r }; delete copy[listingId]; return copy; }), 4000);
  }

  async function handleBid(listingId: string) {
    const amount = parseInt(bidAmounts[listingId] ?? "0");
    if (!amount) return;
    setActioning(listingId);
    try {
      const res = await fetch(`/api/dashboard/market/${listingId}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = (await res.json()) as { success?: boolean; newHighestBid?: number; error?: string };
      if (data.success) {
        setActionResults((r) => ({ ...r, [listingId]: `Bid placed: $${(data.newHighestBid ?? amount).toLocaleString()}` }));
        void fetchListings();
      } else {
        setActionResults((r) => ({ ...r, [listingId]: data.error ?? "Bid failed" }));
      }
    } catch {
      setActionResults((r) => ({ ...r, [listingId]: "Network error" }));
    }
    setActioning(null);
    setTimeout(() => setActionResults((r) => { const copy = { ...r }; delete copy[listingId]; return copy; }), 4000);
  }

  async function handleList() {
    if (!selectedItem) return;
    const price = parseInt(listPrice);
    const qty = parseInt(listQty) || 1;
    if (!price || price <= 0) { setListError("Enter a valid price"); return; }
    if (qty > selectedItem.quantity) { setListError(`You only have ${selectedItem.quantity}`); return; }

    setListing(true);
    setListError(null);
    try {
      const res = await fetch("/api/dashboard/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedItem.itemId,
          itemType: selectedItem.itemType,
          price,
          quantity: qty,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data.success) {
        setListOpen(false);
        setSelectedItemId("");
        setListPrice("");
        setListQty("1");
        router.refresh();
        void fetchListings();
      } else {
        setListError(data.error ?? "Failed to list item");
      }
    } catch {
      setListError("Network error. Try again.");
    } finally {
      setListing(false);
    }
  }

  return (
    <PageShell
      title="Market"
      subtitle={`${total.toLocaleString()} listings`}
      action={
        <motion.button
          onClick={() => setListOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          + List Item
        </motion.button>
      }
    >
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => applyFilter("type", t)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors ${marketFilters.type === t ? "bg-accent text-white" : "text-muted hover:text-text"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <Select
          size="sm"
          value={marketFilters.sort}
          onChange={(v) => applyFilter("sort", v)}
          options={SORT_OPTIONS}
          className="w-32"
        />
      </div>

      {/* Listings */}
      <div className={`space-y-2 transition-opacity ${loading ? "opacity-40" : ""}`}>
        {listings.length === 0 ? (
          <Empty />
        ) : (
          listings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4"
            >
              <span className="text-2xl">{listing.item.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-text">{listing.item.name}</p>
                <p className={`text-xs capitalize ${RARITY_COLOR[listing.item.rarity] ?? "text-muted"}`}>
                  {listing.item.rarity} · ×{listing.quantity} · by {listing.sellerName}
                </p>
                {actionResults[listing.id] && (
                  <p className={`mt-0.5 text-xs font-medium ${actionResults[listing.id]!.includes("failed") || actionResults[listing.id]!.includes("error") || actionResults[listing.id]!.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                    {actionResults[listing.id]}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {listing.bidding ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder={`>${listing.highestBid ?? listing.price}`}
                      value={bidAmounts[listing.id] ?? ""}
                      onChange={(e) => setBidAmounts((b) => ({ ...b, [listing.id]: e.target.value }))}
                      className="w-24 rounded-lg border border-border bg-surface-2 px-2 py-1 text-xs text-text"
                    />
                    <button
                      onClick={() => handleBid(listing.id)}
                      disabled={actioning === listing.id}
                      className="rounded-lg bg-accent-2 px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      Bid
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-accent">${listing.price.toLocaleString()}</span>
                    <motion.button
                      onClick={() => handleBuy(listing.id)}
                      disabled={actioning === listing.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      Buy
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => applyFilter("page", marketFilters.page - 1)}
            disabled={marketFilters.page <= 1}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            ←
          </button>
          <span className="px-3 py-1.5 text-sm text-muted">
            Page {marketFilters.page} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => applyFilter("page", marketFilters.page + 1)}
            disabled={marketFilters.page >= Math.ceil(total / 20)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}

      {/* List item modal */}
      <AnimatePresence>
        {listOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={(e) => e.target === e.currentTarget && setListOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-border bg-surface p-6"
            >
              <h2 className="mb-4 font-bold text-text">List an Item</h2>

              {inventory.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">
                  Your inventory is empty. Catch some fish first!
                </p>
              ) : (
                <div className="space-y-3">
                  {/* Item select */}
                  <Field label="Choose an item from your inventory">
                    <Select
                      value={selectedItemId}
                      onChange={(v) => {
                        setSelectedItemId(v);
                        setListQty("1");
                        setListError(null);
                      }}
                      placeholder="Select an item..."
                      options={inventory.map((item) => ({
                        value: item.itemId,
                        label: `${item.name} (x${item.quantity})`,
                        icon: <span className="text-base">{item.emoji}</span>,
                        sublabel: `${item.rarity} · $${item.sellPrice.toLocaleString()} each`,
                      }))}
                    />
                  </Field>

                  {/* Selected item preview */}
                  {selectedItem && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3"
                    >
                      <span className="text-2xl">{selectedItem.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-text">{selectedItem.name}</p>
                        <p className={`text-xs capitalize ${RARITY_COLOR[selectedItem.rarity] ?? "text-muted"}`}>
                          {selectedItem.rarity} · {selectedItem.quantity} available
                        </p>
                      </div>
                      <span className="text-xs text-muted">
                        Sells for ${selectedItem.sellPrice.toLocaleString()}
                      </span>
                    </motion.div>
                  )}

                  {/* Price & quantity */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Price">
                      <input
                        className={INPUT}
                        type="number"
                        min="1"
                        value={listPrice}
                        onChange={(e) => setListPrice(e.target.value)}
                        placeholder={selectedItem ? String(selectedItem.sellPrice) : "1000"}
                      />
                    </Field>
                    <Field label={`Quantity${selectedItem ? ` (max ${selectedItem.quantity})` : ""}`}>
                      <input
                        className={INPUT}
                        type="number"
                        min="1"
                        max={selectedItem?.quantity ?? 1}
                        value={listQty}
                        onChange={(e) => setListQty(e.target.value)}
                        placeholder="1"
                      />
                    </Field>
                  </div>

                  {listError && (
                    <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
                      {listError}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => { setListOpen(false); setListError(null); }}
                  className="flex-1 rounded-xl border border-border py-2 text-sm text-muted"
                >
                  Cancel
                </button>
                {inventory.length > 0 && (
                  <motion.button
                    onClick={handleList}
                    disabled={!selectedItem || listing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl bg-accent py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {listing ? "Listing..." : "List Item"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

const INPUT = "w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-10 text-center">
      <p className="text-sm text-muted">No listings found.</p>
    </div>
  );
}
