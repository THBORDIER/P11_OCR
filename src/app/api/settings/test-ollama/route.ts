import { NextRequest, NextResponse } from "next/server";
import { getOllamaModels } from "@/lib/ollama";

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL requise" }, { status: 400 });
  }

  try {
    const models = await getOllamaModels(url);
    if (models.length === 0) {
      return NextResponse.json({
        ok: false,
        error: "Connexion établie mais aucun modèle trouvé. Installez un modèle avec : ollama pull llama3.2",
      });
    }
    return NextResponse.json({ ok: true, models });
  } catch {
    return NextResponse.json({
      ok: false,
      error: `Impossible de se connecter à ${url}`,
    });
  }
}
