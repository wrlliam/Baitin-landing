import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { botGet } from "~/lib/botApi";
import PotionsClient from "~/components/dashboard/PotionsClient";

export default async function PotionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) redirect("/login");

  const res = await botGet<{ data: unknown[] }>(
    `/user/${discordId}/potions`,
    discordId,
  ).catch(() => null);

  return <PotionsClient potions={(res?.data as never[]) ?? []} discordId={discordId} />;
}
