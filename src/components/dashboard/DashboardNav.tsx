"use client";

import { ArrowLeftIcon, ExitIcon } from "@radix-ui/react-icons";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "~/components/ThemeToggle";
import { signOut, useSession } from "~/lib/auth-client";

export default function DashboardNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const segment = pathname.split("/").pop() ?? "overview";
  const pageTitle = segment.charAt(0).toUpperCase() + segment.slice(1);

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-6">
      {/* Left — breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-text md:hidden">Baitin</span>
        <span className="hidden text-sm text-muted md:block">Dashboard</span>
        <span className="hidden text-sm text-muted md:block">/</span>
        <span className="hidden text-sm font-medium text-text md:block">{pageTitle}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-text"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Back to site</span>
        </Link>

        <ThemeToggle />

        <span className="h-4 w-px bg-border" />

        {session?.user && (
          <div className="flex items-center gap-2 px-1.5">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? ""}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
                {session.user.name?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
            <span className="hidden text-sm font-medium text-text sm:block">
              {session.user.name}
            </span>
          </div>
        )}

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-red-400"
        >
          <ExitIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Log out</span>
        </motion.button>
      </div>
    </header>
  );
}
