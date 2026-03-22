import { NextRequest, NextResponse } from "next/server";
import { getGlobalSettings, updateGlobalSettings } from "@/lib/settings";
import { pick } from "@/lib/sanitize";

const ALLOWED = [
  "ollamaUrl", "ollamaModel",
  "cliBridgeUrl", "cliBridgeToken", "cliBridgeEnabled",
  "cliProviders",
];

export async function GET() {
  const settings = await getGlobalSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const raw = await request.json();
  const data = pick(raw, ALLOWED);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucun champ valide" }, { status: 400 });
  }

  const settings = await updateGlobalSettings(data);
  return NextResponse.json(settings);
}
