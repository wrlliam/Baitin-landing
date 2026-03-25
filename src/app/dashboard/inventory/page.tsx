import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { botGet } from "~/lib/botApi";
import InventoryClient from "~/components/dashboard/InventoryClient";

export default async function InventoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) redirect("/login");

  const res = await botGet<{ data: unknown[] }>(
    `/user/${discordId}/sack`,
    discordId,
  ).catch(() => null);

  return <InventoryClient items={(res?.data as never[]) ?? []} discordId={discordId} />;
}
