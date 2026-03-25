"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useDashboardStore } from "~/store/dashboard";
import PageShell from "./PageShell";

export interface Hut {
  name: string;
  level: number;
  income: number;
  upgradeAvailable: boolean;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function HutClient({
  hut,
  notifications,
  discordId: _discordId,
}: {
  hut: Hut | null;
  notifications: Notification[];
  discordId: string;
}) {
  const [activeTab, setActiveTab] = useState<"hut" | "notifications">("hut");
  const [upgrading, setUpgrading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const setNotifications = useDashboardStore((s) => s.setNotifications);
  const markRead = useDashboardStore((s) => s.markRead);
  const storeNotifs = useDashboardStore((s) => s.notifications);

  useEffect(() => {
    setNotifications(notifications);
  }, [notifications, setNotifications]);

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/dashboard/hut/upgrade", { method: "POST" });
      if (res.ok) setSuccess("Hut upgraded!");
      else setSuccess("Failed to upgrade.");
    } finally {
      setUpgrading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  }

  async function handleMarkRead(id: string) {
    markRead(id);
    await fetch(`/api/dashboard/hut/notifications/${id}/read`, { method: "POST" });
  }

  return (
    <PageShell title="My Hut" subtitle="Manage your fishing hut and check notifications.">
      <div className="mb-4 flex gap-2">
        {(["hut", "notifications"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === t ? "text-accent" : "text-muted hover:text-text"}`}
          >
            {activeTab === t && (
              <motion.span layoutId="hut-tab" className="absolute inset-0 rounded-lg bg-accent-dim" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10 capitalize">{t === "notifications" ? "Notifications" : "Hut"}</span>
          </button>
        ))}
      </div>

      {activeTab === "hut" ? (
        hut ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-4 text-lg font-bold text-text">{hut.name}</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <Stat label="Level" value={hut.level} />
                <Stat label="Income" value={`$${hut.income}/hr`} />
                <Stat label="Upgrade" value={hut.upgradeAvailable ? "Available" : "Max"} />
              </div>
              {hut.upgradeAvailable && (
                <motion.button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {upgrading ? "Upgrading…" : "Upgrade Hut"}
                </motion.button>
              )}
              {success && <p className="mt-3 text-center text-sm font-medium text-green-500">{success}</p>}
            </div>
          </motion.div>
        ) : (
          <Empty message="No hut data. Start fishing to build your hut!" />
        )
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {storeNotifs.length === 0 ? (
            <Empty message="No notifications." />
          ) : (
            storeNotifs.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-3 rounded-xl border p-4 ${n.read ? "border-border bg-surface opacity-60" : "border-accent/20 bg-accent/5"}`}
              >
                <span className="mt-0.5 h-4 w-4 rounded-full bg-accent/20" />
                <div className="flex-1">
                  <p className="text-sm text-text">{n.message}</p>
                  <p className="mt-1 text-xs text-muted">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <button onClick={() => handleMarkRead(n.id)} className="text-xs text-accent hover:underline">
                    Mark read
                  </button>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-lg font-bold text-text">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-10 text-center">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
