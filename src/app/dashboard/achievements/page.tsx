import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { botGet } from "~/lib/botApi";
import AchievementsClient from "~/components/dashboard/AchievementsClient";

export default async function AchievementsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) redirect("/login");

  const res = await botGet<{ data: unknown[] }>(
    `/user/${discordId}/achievements`,
    discordId,
  ).catch(() => null);

  return <AchievementsClient achievements={(res?.data as never[]) ?? []} />;
}
