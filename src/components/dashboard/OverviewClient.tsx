"use client";

import { motion } from "motion/react";
import Image from "next/image";
import PageShell from "./PageShell";

interface Profile {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  reputation: number;
  totalCatches: number;
  joinedAt: string;
}

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const STATS = (p: Profile) => [
  { label: "Level",         value: String(p.level) },
  { label: "Coins",         value: `$${p.coins.toLocaleString()}` },
  { label: "Gems",          value: `💎 ${p.gems.toLocaleString()}` },
  { label: "Reputation",    value: `⭐ ${p.reputation.toLocaleString()}` },
  { label: "Total Catches", value: p.totalCatches.toLocaleString() },
  { label: "XP",            value: `${p.xp.toLocaleString()} / ${p.xpToNextLevel.toLocaleString()}` },
];

export default function OverviewClient({ user, profile }: { user: User; profile: Profile | null }) {
  return (
    <PageShell title="Overview" subtitle="Your fishing empire at a glance.">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-4 rounded-2xl border border-border bg-surface p-5"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? ""}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </span>
        )}
        <div>
          <h2 className="text-lg font-bold text-text">{user.name}</h2>
          <p className="text-sm text-muted">{user.email}</p>
          {profile && (
            <p className="mt-0.5 text-xs text-muted">
              Fishing since {new Date(profile.joinedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </motion.div>

      {profile ? (
        <>
          {/* XP bar */}
          <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-text">Level {profile.level}</span>
              <span className="text-muted">{profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()} XP</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (profile.xp / profile.xpToNextLevel) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {STATS(profile).map(({ label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-1 text-lg font-bold text-text">{value}</p>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState message="Could not load profile. Make sure you have started fishing in a server with Baitin." />
      )}
    </PageShell>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-10 text-center">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
