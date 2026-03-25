import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { botMutate } from "~/lib/botApi";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) return NextResponse.json({ error: "No Discord account" }, { status: 400 });

  const body = (await req.json()) as { rodId: string };
  try {
    const data = await botMutate("POST", `/user/${discordId}/equipment/upgrade`, discordId, body);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
