import { NextResponse } from "next/server";
import { detectProviders, isLocalEnvironment } from "@/lib/cli-exec";

export async function GET() {
  if (!isLocalEnvironment()) {
    return NextResponse.json({
      local: false,
      providers: [],
      message: "CLI non disponible en environnement serverless. Lancez l'app en local.",
    });
  }

  const providers = await detectProviders();
  return NextResponse.json({ local: true, providers });
}
