"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { type LeaderboardEntry, type LeaderboardType } from "~/types/bot";

const TABS: { type: LeaderboardType; label: string; emoji: string }[] = [
  { type: "catches", label: "Catches", emoji: "🎣" },
  { type: "level", label: "Level", emoji: "⭐" },
  { type: "money", label: "Money", emoji: "💰" },
];

function formatValue(type: LeaderboardType, value: number | null | undefined): string {
  const v = value ?? 0;
  if (type === "catches") return `${v.toLocaleString()} catches`;
  if (type === "level") return `Level ${v}`;
  return `$${v.toLocaleString()}`;
}

const RANK_COLORS = [
  "bg-yellow-400/20 text-yellow-500 border-yellow-400/40",
  "bg-zinc-300/20 text-zinc-400 border-zinc-300/40",
  "bg-orange-400/20 text-orange-500 border-orange-400/40",
];

function RankBadge({ rank }: { rank: number }) {
  const top = rank <= 3;
  const colorClass = top
    ? RANK_COLORS[rank - 1]
    : "bg-surface-2 text-muted border-border";
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${colorClass}`}
    >
      {rank}
    </span>
  );
}

function Avatar({
  username,
  avatar,
  userId,
}: {
  username: string | null;
  avatar: string | null;
  userId: string;
}) {
  const name = username ?? "Unknown";
  const src = avatar ?? null;

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
        unoptimized
      />
    );
  }

  const colors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-rose-500",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${color}`}
    >
      {name[0]?.toUpperCase() ?? "?"}
    </span>
  );
}

function LeaderboardRow({
  entry,
  type,
  index,
}: {
  entry: LeaderboardEntry;
  type: LeaderboardType;
  index: number;
}) {
  const isTop3 = entry.rank <= 3;
  return (
    <motion.div
      key={`${type}-${entry.rank}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
      className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors ${
        isTop3
          ? "border-accent/20 bg-accent/5"
          : "border-border bg-surface hover:bg-surface-2"
      }`}
    >
      <RankBadge rank={entry.rank} />
      <Avatar username={entry.username} avatar={entry.avatar} userId={entry.userId} />
      <span className="min-w-0 flex-1 truncate font-medium text-text">
        {entry.username ?? "Unknown"}
      </span>
      <span className="shrink-0 text-sm font-semibold text-accent">
        {formatValue(type, entry.value)}
      </span>
    </motion.div>
  );
}

interface Props {
  catches: LeaderboardEntry[];
  level: LeaderboardEntry[];
  money: LeaderboardEntry[];
}

export default function LeaderboardClient({ catches, level, money }: Props) {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("catches");

  const data: Record<LeaderboardType, LeaderboardEntry[]> = {
    catches,
    level,
    money,
  };

  const entries = data[activeTab];

  return (
    <section className="mx-auto max-w-2xl px-8 sm:px-10 py-24 sm:py-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="gradient-text mb-3 text-4xl font-bold tracking-tight md:text-5xl">
          Leaderboard
        </h1>
        <p className="text-muted">
          The top players across all Baitin servers.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 rounded-xl border border-border bg-surface p-1">
        {TABS.map(({ type, label, emoji }) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === type ? "text-text" : "text-muted hover:text-text"
            }`}
          >
            {activeTab === type && (
              <motion.span
                layoutId="lb-tab-indicator"
                className="absolute inset-0 rounded-lg bg-surface-2"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {emoji} {label}
            </span>
          </button>
        ))}
      </div>

      {/* Entries */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-2"
        >
          {entries.length === 0 ? (
            <div className="py-16 text-center text-muted">
              No data yet.
            </div>
          ) : (
            entries.map((entry, i) => (
              <LeaderboardRow key={entry.userId} entry={entry} type={activeTab} index={i} />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
