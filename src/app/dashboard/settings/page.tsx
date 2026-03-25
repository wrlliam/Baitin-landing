import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { botGet } from "~/lib/botApi";
import SettingsClient, { type UserSettings } from "~/components/dashboard/SettingsClient";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) redirect("/login");

  const res = await botGet<{ data: UserSettings }>(
    `/user/${discordId}/settings`,
    discordId,
  ).catch(() => null);

  return <SettingsClient settings={res?.data ?? null} discordId={discordId} />;
}
