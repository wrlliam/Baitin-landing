import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { botGet } from "~/lib/botApi";
import EquipmentClient, { type Equipment } from "~/components/dashboard/EquipmentClient";

export default async function EquipmentPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) redirect("/login");

  const res = await botGet<{ data: Equipment }>(
    `/user/${discordId}/equipment`,
    discordId,
  ).catch(() => null);

  return <EquipmentClient equipment={res?.data ?? null} discordId={discordId} />;
}
