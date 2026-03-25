"use client";

import { create } from "zustand";

interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface DashboardStore {
  unreadNotifications: number;
  notifications: Notification[];
  setNotifications: (n: Notification[]) => void;
  markRead: (id: string) => void;

  selectedInventoryItems: Map<string, number>;
  toggleInventoryItem: (id: string, maxQty: number) => void;
  setInventoryItemQty: (id: string, qty: number) => void;
  clearInventorySelection: () => void;

  marketFilters: { type: string; sort: string; page: number };
  setMarketFilter: (key: string, value: string | number) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  unreadNotifications: 0,
  notifications: [],
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadNotifications: notifications.filter((n) => !n.read).length,
    }),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
      unreadNotifications: Math.max(0, s.unreadNotifications - 1),
    })),

  selectedInventoryItems: new Map(),
  toggleInventoryItem: (id, maxQty) =>
    set((s) => {
      const next = new Map(s.selectedInventoryItems);
      if (next.has(id)) next.delete(id);
      else next.set(id, maxQty);
      return { selectedInventoryItems: next };
    }),
  setInventoryItemQty: (id, qty) =>
    set((s) => {
      const next = new Map(s.selectedInventoryItems);
      if (qty <= 0) next.delete(id);
      else next.set(id, qty);
      return { selectedInventoryItems: next };
    }),
  clearInventorySelection: () => set({ selectedInventoryItems: new Map() }),

  marketFilters: { type: "all", sort: "price_asc", page: 1 },
  setMarketFilter: (key, value) =>
    set((s) => ({
      marketFilters: { ...s.marketFilters, [key]: value, page: key === "page" ? (value as number) : 1 },
    })),
}));
