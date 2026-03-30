"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { type BotServer } from "~/types/bot";

interface TopServersProps {
  servers: BotServer[];
}

function ServerCard({ server, index }: { server: BotServer; index: number }) {
  const fallbackColor = `hsl(${(server.name.charCodeAt(0) * 37) % 360}, 45%, 50%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.05 }}
      whileHover={{ y: -1 }}
      className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 transition-shadow hover:shadow-sm"
    >
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
        {server.icon ? (
          <Image
            src={server.icon}
            alt={server.name}
            width={32}
            height={32}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: fallbackColor }}
          >
            {server.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-text">{server.name}</p>
        <p className="text-[10px] text-muted">{server.memberCount.toLocaleString()} members</p>
      </div>
    </motion.div>
  );
}

export default function TopServers({ servers }: TopServersProps) {
  if (servers.length === 0) return null;

  return (
    <section className="py-7 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-2"
        >
          Trusted by servers everywhere
        </motion.p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {servers.map((server, i) => (
            <ServerCard key={server.id} server={server} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
