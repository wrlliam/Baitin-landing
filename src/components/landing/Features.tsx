"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { env } from "~/env";

/* ── Value props (compact row) ── */
const VALUE_PROPS = [
  { emoji: "⚡", title: "Instant setup", desc: "Add to your server and start fishing in under a minute" },
  { emoji: "📈", title: "Deep progression", desc: "Level up, upgrade rods, and unlock rare catches over time" },
  { emoji: "🏆", title: "Compete", desc: "Leaderboards, live events, and player-to-player challenges" },
  { emoji: "🔓", title: "100% free", desc: "No premium tiers, no paywalls — everything is included" },
];

/* ── Bento features ── */
const FEATURES = [
  {
    id: "fishing", emoji: "🎣", title: "Fishing",
    description: "Cast your line and reel in hundreds of unique fish across different biomes and rarities. Upgrade your rod, equip bait, and level up your skills.",
    variant: "hero" as const, cls: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  },
  {
    id: "economy", emoji: "💰", title: "Economy",
    description: "Full server economy with daily rewards, work, gambling, and coin trading.",
    variant: "small" as const, cls: "",
  },
  {
    id: "huts", emoji: "🏚️", title: "Fishing Huts",
    description: "Build and upgrade huts for passive income and exclusive perks.",
    variant: "small" as const, cls: "",
  },
  {
    id: "pets", emoji: "🐾", title: "Pet System",
    description: "Hatch eggs, raise companions, and equip pets that grant passive bonuses to every catch.",
    variant: "wide" as const, cls: "sm:col-span-2 lg:col-span-2",
  },
  {
    id: "market", emoji: "🛒", title: "Player Market",
    description: "Buy, sell, and auction fish and items with other players.",
    variant: "small" as const, cls: "",
  },
  {
    id: "potions", emoji: "🧪", title: "Potion Buffs",
    description: "Brew potions for temporary luck, XP, and coin multipliers.",
    variant: "small" as const, cls: "",
  },
  {
    id: "achievements", emoji: "🏆", title: "Achievements",
    description: "Unlock achievements that track your fishing milestones and dedication.",
    variant: "wide" as const, cls: "sm:col-span-2 lg:col-span-2",
  },
  {
    id: "events", emoji: "⚡", title: "Live Events",
    description: "Server-wide fishing tournaments and timed events with doubled XP, coin multipliers, and rare-fish boosts.",
    variant: "banner" as const, cls: "sm:col-span-2 lg:col-span-4",
  },
];

/* ── How it works steps ── */
const STEPS = [
  { step: "01", title: "Invite the bot", desc: "Add Baitin to your Discord server with a single click. No setup or configuration needed." },
  { step: "02", title: "Cast your first line", desc: "Use /cast to start fishing. Catch fish, earn coins, and gain XP with every cast." },
  { step: "03", title: "Build your empire", desc: "Upgrade rods, raise pets, trade on the market, and climb the leaderboard." },
];

/* ── Command preview (inline) ── */
type TabKey = "fishing" | "economy" | "gambling";
const COMMAND_PREVIEW: Record<TabKey, { label: string; commands: { name: string; desc: string }[] }> = {
  fishing: {
    label: "🎣 Fishing",
    commands: [
      { name: "/cast", desc: "Cast your line and reel in a catch" },
      { name: "/sack", desc: "View and manage your inventory" },
      { name: "/sell", desc: "Sell fish from your inventory" },
      { name: "/profile", desc: "View your fishing profile and stats" },
      { name: "/leaderboard", desc: "Top players by various categories" },
      { name: "/almanac", desc: "Browse your lifetime fish discoveries" },
    ],
  },
  economy: {
    label: "💰 Economy",
    commands: [
      { name: "/daily", desc: "Claim your daily reward with streak bonus" },
      { name: "/work", desc: "Earn income on a cooldown" },
      { name: "/balance", desc: "Check your coin balance" },
      { name: "/trade", desc: "Trade items with another player" },
      { name: "/steal", desc: "Attempt to steal coins from a player" },
      { name: "/quests", desc: "View and track your active quests" },
    ],
  },
  gambling: {
    label: "🎰 Gambling",
    commands: [
      { name: "/blackjack", desc: "Play blackjack against the dealer" },
      { name: "/slots", desc: "Spin the slot machine for prizes" },
      { name: "/crash", desc: "Cash out before the multiplier crashes" },
      { name: "/flip", desc: "Coin flip gamble" },
      { name: "/roulette", desc: "Bet on red, black, or a number" },
      { name: "/dice", desc: "Roll dice against the house" },
    ],
  },
};
const TAB_KEYS: TabKey[] = ["fishing", "economy", "gambling"];

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Command Preview Section ── */
function CommandPreview() {
  const [active, setActive] = useState<TabKey>("fishing");
  const tab = COMMAND_PREVIEW[active];

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-8 sm:px-10">
        <Reveal>
          <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Commands</p>
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">Everything at a slash</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-5 flex gap-1 rounded-lg border border-border bg-surface p-1">
            {TAB_KEYS.map((key) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className="relative flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors"
                  style={{ color: isActive ? "var(--color-text)" : "var(--color-muted)" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="cmd-tab"
                      className="absolute inset-0 rounded-md bg-surface-2"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative z-10">{COMMAND_PREVIEW[key].label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {tab.commands.map((cmd, i) => (
              <motion.div
                key={cmd.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <p className="mb-1 font-mono text-xs font-semibold text-accent">{cmd.name}</p>
                <p className="text-xs leading-relaxed text-muted">{cmd.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ── Main export ── */
export default function Features() {
  return (
    <>
      {/* Value props — compact 4-column */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border px-2 sm:grid-cols-4 sm:px-4">
          {VALUE_PROPS.map((prop, i) => (
            <Reveal key={prop.title} delay={i * 0.08} className="px-6 py-10 text-center sm:px-8 sm:py-12">
              <span className="mb-4 inline-block text-2xl">{prop.emoji}</span>
              <h3 className="mb-2 text-sm font-semibold text-text">{prop.title}</h3>
              <p className="text-xs leading-relaxed text-muted">{prop.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bento feature grid */}
      <section id="features" className="py-32 sm:py-40">
        <div className="mx-auto max-w-6xl px-8 sm:px-10">
          <Reveal>
            <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Features</p>
            <h2 className="mb-16 text-center text-2xl font-bold tracking-tight sm:text-3xl">Everything you need to fish</h2>
          </Reveal>

          <div className="grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[180px] lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className={`rounded-xl border border-border bg-surface transition-shadow hover:shadow-sm ${f.cls}`}
              >
                {f.variant === "hero" && (
                  <div className="flex h-full flex-col justify-between p-6">
                    <span className="text-4xl">{f.emoji}</span>
                    <div>
                      <h3 className="mb-1.5 text-lg font-bold text-text">{f.title}</h3>
                      <p className="text-xs leading-relaxed text-muted">{f.description}</p>
                    </div>
                  </div>
                )}
                {f.variant === "small" && (
                  <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-dim text-base">{f.emoji}</div>
                    <div>
                      <h3 className="mb-0.5 text-xs font-semibold text-text">{f.title}</h3>
                      <p className="text-[11px] leading-relaxed text-muted">{f.description}</p>
                    </div>
                  </div>
                )}
                {f.variant === "wide" && (
                  <div className="flex h-full items-center gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-dim text-xl">{f.emoji}</div>
                    <div className="min-w-0">
                      <h3 className="mb-1 text-sm font-semibold text-text">{f.title}</h3>
                      <p className="text-xs leading-relaxed text-muted">{f.description}</p>
                    </div>
                  </div>
                )}
                {f.variant === "banner" && (
                  <div className="flex h-full items-center gap-5 p-5 lg:p-6">
                    <span className="shrink-0 text-3xl lg:text-4xl">{f.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-sm font-bold text-text lg:text-base">{f.title}</h3>
                      <p className="text-xs leading-relaxed text-muted">{f.description}</p>
                    </div>
                    <div className="hidden shrink-0 gap-1.5 lg:flex">
                      {["2x XP", "Coin Boost", "Rare Fish"].map((tag) => (
                        <span key={tag} className="rounded-full border border-accent/20 bg-accent-dim px-2.5 py-0.5 text-[10px] font-medium text-accent">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface py-32 sm:py-40">
        <div className="mx-auto max-w-4xl px-8 sm:px-10">
          <Reveal>
            <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">How it works</p>
            <h2 className="mb-16 text-center text-2xl font-bold tracking-tight sm:text-3xl">Get started in three steps</h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-14 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                    {s.step}
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-text">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-muted">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Command preview */}
      <CommandPreview />

      {/* Bottom CTA */}
      <section className="py-32 sm:py-40">
        <div className="mx-auto max-w-2xl px-8 sm:px-10 text-center">
          <Reveal>
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to start fishing?
            </h2>
            <p className="mb-10 text-sm text-muted sm:text-base">
              Add Baitin to your Discord server and start catching fish in under a minute.
              No setup required — just invite and go.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <motion.a
                href={env.NEXT_PUBLIC_DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white"
              >
                Add to Discord
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </motion.a>
              <motion.a
                href="https://github.com/wrlliam/baitin"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-text"
              >
                <svg height="14" viewBox="0 0 16 16" width="14" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                View on GitHub
              </motion.a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
