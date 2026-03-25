"use client";

import { CheckIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import PageShell from "./PageShell";

export interface UserSettings {
  dmNotifications: boolean;
  catchAlerts: boolean;
  marketAlerts: boolean;
}

const DEFAULT: UserSettings = {
  dmNotifications: true,
  catchAlerts: true,
  marketAlerts: false,
};

export default function SettingsClient({
  settings,
  discordId: _discordId,
}: {
  settings: UserSettings | null;
  discordId: string;
}) {
  const [values, setValues] = useState<UserSettings>(settings ?? DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const persist = useCallback(async (next: UserSettings) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Failed to save settings");
        setTimeout(() => setError(null), 4000);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      setError("Network error. Try again.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setSaving(false);
    }
  }, []);

  function update(partial: Partial<UserSettings>) {
    setValues((prev) => {
      const next = { ...prev, ...partial };
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => void persist(next), 400);
      return next;
    });
  }

  async function handleSave() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    await persist(values);
  }

  return (
    <PageShell title="Settings" subtitle="Manage your Baitin preferences.">
      <div className="space-y-3">
        <Toggle
          label="DM Notifications"
          description="Receive direct messages for important events"
          checked={values.dmNotifications}
          onChange={() => update({ dmNotifications: !values.dmNotifications })}
        />
        <Toggle
          label="Catch Alerts"
          description="Get notified when your hut workers catch something"
          checked={values.catchAlerts}
          onChange={() => update({ catchAlerts: !values.catchAlerts })}
        />
        <Toggle
          label="Market Alerts"
          description="Get notified when your listings sell or receive a bid"
          checked={values.marketAlerts}
          onChange={() => update({ marketAlerts: !values.marketAlerts })}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-3">
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </motion.button>
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-sm font-medium text-green-400"
            >
              <CheckIcon className="h-4 w-4" /> Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
      <div>
        <p className="text-sm font-medium text-text">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-accent" : "bg-surface-3"}`}
      >
        <motion.span
          animate={{ x: checked ? 22 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="block h-4 w-4 rounded-full bg-white shadow"
        />
      </button>
    </div>
  );
}
