import { type Metadata } from "next";
import Footer from "~/components/landing/Footer";
import Navbar from "~/components/landing/Navbar";
import LeaderboardClient from "~/components/leaderboard/LeaderboardClient";
import { getLeaderboard } from "~/lib/api";

export const metadata: Metadata = {
  title: "Leaderboard — Baitin 🎣",
  description:
    "See the top players in Baitin by total catches, fishing level, and money earned.",
};

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function LeaderboardPage() {
  const [catchesData, levelData, moneyData] = await Promise.all([
    safe(() => getLeaderboard("catches"), { total: 0, entries: [] }),
    safe(() => getLeaderboard("level"),   { total: 0, entries: [] }),
    safe(() => getLeaderboard("coins"),   { total: 0, entries: [] }),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <LeaderboardClient
          catches={catchesData.entries}
          level={levelData.entries}
          money={moneyData.entries}
        />
      </main>
      <Footer />
    </>
  );
}
