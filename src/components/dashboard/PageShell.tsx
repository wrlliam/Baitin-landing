"use client";

import { motion } from "motion/react";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageShell({ title, subtitle, children, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-4xl px-4 py-6 pb-20 sm:px-6 sm:py-8 sm:pb-8 md:pb-8"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}
