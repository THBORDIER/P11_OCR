import { getGlobalSettings } from "./settings";

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export async function getOllamaConfig() {
  try {
    const settings = await getGlobalSettings();
    return {
      url: settings.ollamaUrl || process.env.OLLAMA_URL || "http://localhost:11434",
      model: settings.ollamaModel || "llama3.2",
    };
  } catch {
    return {
      url: process.env.OLLAMA_URL || "http://localhost:11434",
      model: "llama3.2",
    };
  }
}

export async function generateWithOllama(
  prompt: string,
  model?: string,
  url?: string
): Promise<string> {
  const config = await getOllamaConfig();
  const ollamaUrl = url || config.url;
  const ollamaModel = model || config.model;

  const res = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ollamaModel,
      prompt,
      stream: false,
      format: "json",
      options: { temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  }

  const data: OllamaResponse = await res.json();
  return data.response;
}

export async function isOllamaAvailable(url?: string): Promise<boolean> {
  const config = await getOllamaConfig();
  const ollamaUrl = url || config.url;
  try {
    const res = await fetch(`${ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getOllamaModels(url?: string): Promise<string[]> {
  const config = await getOllamaConfig();
  const ollamaUrl = url || config.url;
  try {
    const res = await fetch(`${ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map((m: { name: string }) => m.name);
  } catch {
    return [];
  }
}
