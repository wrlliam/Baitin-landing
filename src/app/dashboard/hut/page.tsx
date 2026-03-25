import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { botGet } from "~/lib/botApi";
import HutClient, { type Hut, type Notification } from "~/components/dashboard/HutClient";

export default async function HutPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) redirect("/login");

  const [hutRes, notifRes] = await Promise.all([
    botGet<{ data: Hut }>(`/user/${discordId}/hut`, discordId).catch(() => null),
    botGet<{ data: Notification[] }>(`/user/${discordId}/hut/notifications`, discordId).catch(() => null),
  ]);

  return (
    <HutClient
      hut={hutRes?.data ?? null}
      notifications={notifRes?.data ?? []}
      discordId={discordId}
    />
  );
}
