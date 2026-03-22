import { NextRequest, NextResponse } from "next/server";
import { executeCliPrompt, detectProviders, isLocalEnvironment } from "@/lib/cli-exec";
import { getGlobalSettings } from "@/lib/settings";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 10 CLI executions per minute
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(`cli:${ip}`, 10)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429 }
    );
  }

  if (!isLocalEnvironment()) {
    return NextResponse.json(
      { error: "CLI non disponible en environnement serverless. Lancez l'app en localhost." },
      { status: 400 }
    );
  }

  const { provider, prompt, projectSlug } = await request.json();

  if (!provider || typeof provider !== "string") {
    return NextResponse.json({ error: "provider requis" }, { status: 400 });
  }
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt requis" }, { status: 400 });
  }

  // Resolve command — use provider name as command directly if not in settings
  const settings = await getGlobalSettings();
  const providers = (settings.cliProviders || []) as { name: string; command: string; enabled: boolean }[];
  const providerConfig = providers.find((p) => p.name === provider);
  const command = providerConfig?.command || provider;

  // Check if tool is installed
  const available = await detectProviders();
  if (!available.includes(provider)) {
    return NextResponse.json(
      {
        error: `"${provider}" n'est pas installé sur cette machine. Providers détectés : ${available.join(", ") || "aucun"}`,
      },
      { status: 400 }
    );
  }

  try {
    const result = await executeCliPrompt(command, prompt, projectSlug);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur d'exécution CLI" },
      { status: 500 }
    );
  }
}
