import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { botGet } from "~/lib/botApi";
import EventsClient from "~/components/dashboard/EventsClient";

export default async function EventsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) redirect("/login");

  const res = await botGet<{ data: unknown[] }>(
    `/events/active`,
    discordId,
  ).catch(() => null);

  return <EventsClient events={(res?.data as never[]) ?? []} discordId={discordId} />;
}
