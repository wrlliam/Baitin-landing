import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { botGet } from "~/lib/botApi";
import MarketClient, { type InventoryItem } from "~/components/dashboard/MarketClient";

export default async function MarketPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) redirect("/login");

  const [marketRes, sackRes] = await Promise.all([
    botGet<{ data: { total: number; listings: unknown[] } }>(
      `/market?page=1&limit=20&sort=price_asc`,
      discordId,
    ).catch(() => null),
    botGet<{ data: InventoryItem[] }>(
      `/user/${discordId}/sack`,
      discordId,
    ).catch(() => null),
  ]);

  return (
    <MarketClient
      initialListings={(marketRes?.data?.listings as never[]) ?? []}
      initialTotal={marketRes?.data?.total ?? 0}
      inventory={sackRes?.data ?? []}
      discordId={discordId}
    />
  );
}
