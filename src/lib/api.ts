import { env } from "~/env.js";
import type {
  BotBait,
  BotCommand,
  BotEgg,
  BotEvent,
  BotFish,
  BotPet,
  BotPotion,
  BotRod,
  BotServer,
  LeaderboardEntry,
  LeaderboardType,
} from "~/types/bot";

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${env.NEXT_PUBLIC_BOT_API_URL}/api${path}`;
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (err) {
    console.error(`[api] fetch failed: ${url}`, err);
    throw err;
  }
  if (!res.ok) {
    console.error(`[api] ${url} → ${res.status}`);
    throw new Error(`Bot API ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getFish() {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; fish: BotFish[] };
  }>("/fish");
  return d.data;
}

export async function getRods() {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; rods: BotRod[] };
  }>("/rods");
  return d.data;
}

export async function getBaits() {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; baits: BotBait[] };
  }>("/baits");
  return d.data;
}

export async function getPotions() {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; potions: BotPotion[] };
  }>("/potions");
  return d.data;
}

export async function getPets() {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; pets: BotPet[] };
  }>("/pets");
  return d.data;
}

export async function getEggs() {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; eggs: BotEgg[] };
  }>("/eggs");
  return d.data;
}

export async function getEvents() {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; events: BotEvent[] };
  }>("/events");
  return d.data;
}

export async function getServers() {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; servers: BotServer[] };
  }>("/servers");
  return d.data;
}

export async function getCommands() {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; commands: BotCommand[] };
  }>("/commands?limit=100");
  return d.data;
}

export async function getLeaderboard(type: LeaderboardType) {
  const d = await apiFetch<{
    success: boolean;
    data: { total: number; entries: LeaderboardEntry[] };
  }>(`/leaderboard/${type}`);
  return d.data;
}
