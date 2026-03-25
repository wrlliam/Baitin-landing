import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "~/lib/auth";
import { botGet, botMutate } from "~/lib/botApi";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) return NextResponse.json({ error: "No Discord account" }, { status: 400 });

  const qs = new URL(req.url).search;
  try {
    const data = await botGet<unknown>(`/market${qs}`, discordId);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const discordId = (session.user as { discordId?: string }).discordId;
  if (!discordId) return NextResponse.json({ error: "No Discord account" }, { status: 400 });

  const body = await req.json();
  try {
    const data = await botMutate("POST", "/market/list", discordId, body);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
