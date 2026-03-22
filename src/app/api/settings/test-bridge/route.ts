import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { url, token } = await request.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL requise" }, { status: 400 });
  }

  try {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${url}/health`, {
      headers,
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        error: `Agent a répondu avec le statut ${res.status}`,
      });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, ...data });
  } catch {
    return NextResponse.json({
      ok: false,
      error: `Impossible de se connecter à ${url}. L'agent CLI Bridge est-il lancé ?`,
    });
  }
}
