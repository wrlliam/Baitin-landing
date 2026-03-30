"use client";

import { motion } from "motion/react";
import { env } from "~/env";

function stagger(delay = 0) {
  return {
    initial: { opacity: 0, y: 24, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay },
  } as const;
}

interface HeroProps {
  fishCount: number;
}

export default function Hero({ fishCount }: HeroProps) {
  return (
    <section className="relative py-20 sm:py-44 lg:py-56">
      {/* Grid backdrop */}
      <div className="grid-bg absolute inset-0 opacity-50" />

      {/* Glow orbs — use radial gradients to avoid hard blur edges */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/3"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 70%)",
          opacity: 0.06,
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-accent-2) 0%, transparent 70%)",
          opacity: 0.04,
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-8 text-center sm:px-10">
        {/* Badge */}
        <motion.div {...stagger(0.05)}>
          <span className="border-border bg-surface text-muted mb-8 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Open source &amp; free forever
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...stagger(0.12)}
          className="mb-6 text-3xl leading-[1.1] font-bold tracking-tight sm:mb-8 sm:text-5xl lg:text-6xl"
        >
          The fishing bot your{" "}
          <span className="gradient-text">Discord server</span> deserves
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...stagger(0.2)}
          className="text-muted mx-auto mb-8 max-w-lg text-sm leading-relaxed sm:mb-12 sm:text-base"
        >
          Cast lines, catch rare fish, build a thriving economy, raise pets, and
          compete in live events — all from Discord.
        </motion.p>

        {/* Slim CTA buttons */}
        <motion.div
          {...stagger(0.28)}
          className="flex flex-wrap items-center justify-center gap-3.5"
        >
          <motion.a
            href={env.NEXT_PUBLIC_DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="bg-accent inline-flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-medium text-white"
          >
            Get Started
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.a>
          <motion.a
            href="/commands"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="border-border bg-surface text-text inline-flex items-center gap-1.5 rounded-lg border px-5 py-2 text-sm font-medium"
          >
            View Commands
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...stagger(0.38)}
          className="divide-border border-border bg-surface mt-14 inline-flex items-center divide-x rounded-xl border px-1 sm:mt-24"
        >
          {[
            { value: fishCount > 0 ? `${fishCount}+` : "210+", label: "Fish" },
            { value: "42+", label: "Commands" },
            { value: "Free", label: "Forever" },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-3 text-center">
              <p className="text-text text-lg font-bold">{stat.value}</p>
              <p className="text-muted text-[11px]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
