import { SignJWT } from "jose";
import { env } from "~/env.js";

const secret = new TextEncoder().encode(env.BOT_API_SECRET);

/** Sign a 5-minute JWT scoped to a Discord user, then call the bot API. */
export async function signedBotFetch(
  path: string,
  discordId: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await new SignJWT({ sub: discordId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);

  return fetch(`${env.BOT_API_URL}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export async function botGet<T>(path: string, discordId: string): Promise<T> {
  const res = await signedBotFetch(path, discordId);
  if (!res.ok) throw new Error(`Bot API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

/** Extract a human-readable error from a bot API response body. */
function parseErrorMessage(raw: string, status: number): string {
  try {
    const json = JSON.parse(raw) as { error?: string; message?: string };
    return json.error ?? json.message ?? `Request failed (${status})`;
  } catch {
    return raw || `Request failed (${status})`;
  }
}

export async function botMutate<T>(
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  discordId: string,
  body?: unknown,
): Promise<T> {
  const res = await signedBotFetch(path, discordId, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  // Parse the response body
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    if (!res.ok) throw new Error(parseErrorMessage(text, res.status));
    throw new Error("Invalid response from server");
  }

  // If the HTTP status is an error, extract a clean message
  if (!res.ok) {
    throw new Error(parseErrorMessage(text, res.status));
  }

  return data;
}
