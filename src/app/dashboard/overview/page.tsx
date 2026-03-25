import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { botGet } from "~/lib/botApi";
import OverviewClient from "~/components/dashboard/OverviewClient";

interface UserProfile {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  reputation: number;
  totalCatches: number;
  joinedAt: string;
}

export default async function OverviewPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) redirect("/login");

  const profile = await botGet<{ data: UserProfile }>(
    `/user/${discordId}`,
    discordId,
  ).catch(() => null);

  return <OverviewClient user={session.user} profile={profile?.data ?? null} />;
}
