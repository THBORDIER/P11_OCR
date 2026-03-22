import { NextRequest, NextResponse } from "next/server";
import { getGlobalSettings } from "@/lib/settings";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 10 bridge prompts per minute
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(`bridge:${ip}`, 10)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }

  const { provider, prompt, projectSlug } = await request.json();

  if (!provider || !prompt) {
    return NextResponse.json({ error: "provider et prompt requis" }, { status: 400 });
  }

  const settings = await getGlobalSettings();

  if (!settings.cliBridgeEnabled) {
    return NextResponse.json({ error: "CLI Bridge désactivé. Activez-le dans les paramètres." }, { status: 400 });
  }

  const bridgeUrl = settings.cliBridgeUrl || "http://localhost:3939";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (settings.cliBridgeToken) {
    headers["Authorization"] = `Bearer ${settings.cliBridgeToken}`;
  }

  try {
    const res = await fetch(`${bridgeUrl}/execute`, {
      method: "POST",
      headers,
      body: JSON.stringify({ provider, prompt, projectSlug }),
      signal: AbortSignal.timeout(120_000), // 2 min timeout for CLI execution
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Erreur inconnue" }));
      return NextResponse.json({ error: err.error || `Agent erreur ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: `Erreur de connexion à l'agent : ${e instanceof Error ? e.message : "timeout ou réseau"}` },
      { status: 502 }
    );
  }
}
