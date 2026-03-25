"use client";

import { CheckCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import PageShell from "./PageShell";

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: string | null;
  progress: number | null;
  goal: number | null;
}

const PER_PAGE = 12;

const TABS = [
  { key: "all",        label: "All" },
  { key: "completed",  label: "Completed" },
  { key: "inprogress", label: "In Progress" },
] as const;

type Tab = (typeof TABS)[number]["key"];

export default function AchievementsClient({ achievements }: { achievements: Achievement[] }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...achievements];

    // filter by tab
    if (tab === "completed") list = list.filter((a) => !!a.unlockedAt);
    else if (tab === "inprogress") list = list.filter((a) => !a.unlockedAt);

    // search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
      );
    }

    // sort: completed first, then by progress descending
    list.sort((a, b) => {
      if (a.unlockedAt && !b.unlockedAt) return -1;
      if (!a.unlockedAt && b.unlockedAt) return 1;
      const aPct = a.goal ? (a.progress ?? 0) / a.goal : 0;
      const bPct = b.goal ? (b.progress ?? 0) / b.goal : 0;
      return bPct - aPct;
    });

    return list;
  }, [achievements, tab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const completed = achievements.filter((a) => a.unlockedAt).length;

  return (
    <PageShell
      title="Achievements"
      subtitle={`${completed} / ${achievements.length} unlocked`}
    >
      {/* Search + tabs */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5 rounded-xl border border-border bg-surface p-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setPage(1); }}
              className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${tab === key ? "text-accent" : "text-muted hover:text-text"}`}
            >
              {tab === key && (
                <motion.span
                  layoutId="ach-tab"
                  className="absolute inset-0 rounded-lg bg-accent-dim"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 sm:w-64">
          <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search achievements..."
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
          />
        </div>
      </div>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <p className="text-sm text-muted">
            {search ? "No achievements match your search." : "No achievements yet. Start fishing!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {pageItems.map((a, i) => (
            <AchievementCard key={a.id} a={a} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-text disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-2 text-sm text-muted">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-text disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </PageShell>
  );
}

function AchievementCard({ a, index }: { a: Achievement; index: number }) {
  const progress = a.progress ?? 0;
  const goal = a.goal ?? 1;
  const pct = Math.min(100, (progress / goal) * 100);
  const done = !!a.unlockedAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`rounded-2xl border p-4 ${done ? "border-accent/20 bg-accent/5" : "border-border bg-surface"}`}
    >
      <div className="mb-2 flex items-center gap-3">
        <span className="text-2xl">{a.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-text">{a.name}</p>
          <p className="truncate text-xs text-muted">{a.description}</p>
        </div>
        {done && <CheckCircledIcon className="h-5 w-5 shrink-0 text-accent" />}
      </div>
      {!done && (
        <div>
          <div className="mb-1 flex justify-between text-[11px] text-muted">
            <span>{progress.toLocaleString()}</span>
            <span>{goal.toLocaleString()}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-accent"
            />
          </div>
        </div>
      )}
      {done && (
        <p className="text-[11px] text-muted">
          Unlocked {new Date(a.unlockedAt!).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
}
