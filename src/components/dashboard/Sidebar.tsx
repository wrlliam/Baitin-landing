"use client";

import {
  BackpackIcon,
  BarChartIcon,
  CalendarIcon,
  GearIcon,
  HomeIcon,
  MixerHorizontalIcon,
  RocketIcon,
  StarIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardStore } from "~/store/dashboard";

const NAV = [
  { href: "/dashboard/overview", label: "Overview", Icon: HomeIcon },
  { href: "/dashboard/hut", label: "My Hut", Icon: StarIcon },
  { href: "/dashboard/achievements", label: "Achievements", Icon: RocketIcon },
  { href: "/dashboard/inventory", label: "Inventory", Icon: BackpackIcon },
  {
    href: "/dashboard/equipment",
    label: "Equipment",
    Icon: MixerHorizontalIcon,
  },
  { href: "/dashboard/potions", label: "Potions", Icon: BarChartIcon },
  { href: "/dashboard/events", label: "Events", Icon: CalendarIcon },
  { href: "/dashboard/market", label: "Market", Icon: ArchiveIcon },
  { href: "/dashboard/settings", label: "Settings", Icon: GearIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const unread = useDashboardStore((s) => s.unreadNotifications);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="border-border bg-surface hidden w-56 shrink-0 flex-col border-r md:flex">
        <Link
          href="/"
          className="border-border text-text flex h-14 items-center border-b px-5 text-base font-bold tracking-tight"
        >
          Baitin
        </Link>

        <nav className="flex flex-col gap-0.5 p-3">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const isHut = href === "/dashboard/hut";
            return (
              <Link key={href} href={href} className="relative">
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="bg-accent-dim absolute inset-0 rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                    active ? "text-accent" : "text-muted hover:text-text"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  {isHut && unread > 0 && (
                    <AnimatePresence>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="bg-accent ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                      >
                        {unread > 99 ? "99+" : unread}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="border-border bg-surface fixed inset-x-0 bottom-0 z-50 flex border-t md:hidden">
        {NAV.slice(0, 5).map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="mobile-active"
                  className="bg-accent absolute inset-x-1 top-0 h-0.5 rounded-b"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
