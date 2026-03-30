"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { env } from "~/env";
import ThemeToggle from "~/components/ThemeToggle";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Wiki", href: "/wiki" },
  { label: "Commands", href: "/commands" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="border-border bg-bg/80 sticky top-0 z-50 border-b backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center px-4 py-3 sm:px-8 sm:py-4">
        {/* Brand — visible on mobile */}
        <Link href="/" className="mr-auto text-sm font-bold text-text md:hidden">
          Baitin
        </Link>

        {/* Left  — Nav links */}
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-muted hover:text-text text-[13px] font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right — theme toggle + CTAs */}
        <div className="ml-auto flex items-center gap-2.5 md:ml-0">
          <ThemeToggle />
          {/* <motion.a
            href="/dashboard"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="border-border text-text hidden items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-[13px] font-medium sm:inline-flex"
          >
            Dashboard
          </motion.a> */}
          <motion.a
            href={env.NEXT_PUBLIC_DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="bg-accent hidden items-center gap-1.5 rounded-lg px-4 py-1.5 text-[13px] font-medium text-white sm:inline-flex"
          >
            Add to Discord
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </motion.a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="border-border text-muted flex h-8 w-8 items-center justify-center rounded-md border md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-border overflow-hidden border-t md:hidden"
          >
            <div className="flex flex-col gap-0.5 px-4 py-3">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-muted hover:bg-surface hover:text-text rounded-md px-3 py-2 text-sm font-medium transition-colors"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="border-border text-text mt-2 flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <a
                href={env.NEXT_PUBLIC_DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent mt-1 flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white"
              >
                Add to Discord
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
