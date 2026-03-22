"use client";

import { useState, useEffect } from "react";

interface AiGenerateButtonProps {
  type: string;
  projectId: string;
  label?: string;
  onGenerated: (items: Record<string, unknown>[]) => void;
}

type Provider = "ollama" | "claude" | "gemini" | "codex" | "manual";

const PROVIDER_LABELS: Record<Provider, string> = {
  ollama: "Ollama (local)",
  claude: "Claude CLI",
  gemini: "Gemini CLI",
  codex: "Codex CLI",
  manual: "Copier/Coller",
};

export default function AiGenerateButton({
  type,
  projectId,
  label = "Générer avec l'IA",
  onGenerated,
}: AiGenerateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Record<string, unknown>[] | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualPrompt, setManualPrompt] = useState("");
  const [pasteInput, setPasteInput] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [copied, setCopied] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Provider detection
  const [availableProviders, setAvailableProviders] = useState<Provider[]>(["manual"]);
  const [selectedProvider, setSelectedProvider] = useState<Provider>("manual");
  const [providersLoaded, setProvidersLoaded] = useState(false);

  useEffect(() => {
    async function detect() {
      const providers: Provider[] = [];

      // Check Ollama
      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, projectId, getPromptOnly: true }),
        });
        if (res.ok) {
          // Try Ollama health check
          try {
            const ollamaRes = await fetch("/api/settings/test-ollama");
            if (ollamaRes.ok) {
              const data = await ollamaRes.json();
              if (data.available) providers.push("ollama");
            }
          } catch { /* Ollama not available */ }
        }
      } catch { /* API error */ }

      // Check CLI providers
      try {
        const res = await fetch("/api/cli/providers");
        if (res.ok) {
          const data = await res.json();
          if (data.local && data.providers) {
            for (const p of data.providers) {
              if (["claude", "gemini", "codex"].includes(p)) {
                providers.push(p as Provider);
              }
            }
          }
        }
      } catch { /* CLI detection failed */ }

      // Always add manual as fallback
      providers.push("manual");

      setAvailableProviders(providers);
      setSelectedProvider(providers[0]); // Auto-select best available
      setProvidersLoaded(true);
    }
    detect();
  }, [type, projectId]);

  const generate = async () => {
    if (selectedProvider === "manual") {
      // Fetch prompt and show manual modal
      setLoading(true);
      try {
        const promptRes = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, projectId, getPromptOnly: true }),
        });
        const promptData = await promptRes.json();
        setManualPrompt(promptData.prompt || "Erreur de chargement du prompt");
        setShowManual(true);
      } catch {
        setManualPrompt("Erreur de connexion au serveur.");
        setShowManual(true);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError("");
    setShowManual(false);

    try {
      if (selectedProvider === "ollama") {
        // Use Ollama API
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, projectId }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 503 && data.prompt) {
            setManualPrompt(data.prompt);
            setShowManual(true);
          } else {
            setError(data.error || "Erreur Ollama");
          }
          return;
        }
        setPreview(data.items || []);
      } else {
        // Use CLI provider (claude/gemini/codex)
        // First get the prompt
        const promptRes = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, projectId, getPromptOnly: true }),
        });
        const promptData = await promptRes.json();
        if (!promptData.prompt) {
          setError("Impossible de générer le prompt");
          return;
        }

        // Send to CLI
        const cliRes = await fetch("/api/cli/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: selectedProvider,
            prompt: promptData.prompt + "\n\nRéponds UNIQUEMENT avec le JSON demandé, sans texte ni commentaire avant ou après.",
            projectSlug: projectId,
          }),
        });
        const cliData = await cliRes.json();
        if (!cliRes.ok) {
          setError(cliData.error || "Erreur CLI");
          return;
        }

        // Parse CLI output — extract JSON from response
        const output = cliData.output || cliData.result || "";
        const jsonMatch = output.match(/\{[\s\S]*"items"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setPreview(parsed.items || []);
        } else {
          // Try parsing the whole output
          try {
            const parsed = JSON.parse(output);
            setPreview(parsed.items || (Array.isArray(parsed) ? parsed : [parsed]));
          } catch {
            setError("La réponse CLI ne contient pas de JSON valide. Essayez le mode manuel.");
            setManualPrompt(promptData.prompt);
            setShowManual(true);
          }
        }
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const acceptAll = async () => {
    if (preview) {
      const items = preview;
      setPreview(null);
      setImporting(true);
      setImportProgress(0);

      let current = 0;
      const tick = setInterval(() => {
        if (current < 60) {
          current += Math.floor(Math.random() * 10) + 1;
        } else if (current < 85) {
          current += Math.floor(Math.random() * 4) + 1;
        } else if (current < 99) {
          current += Math.random() > 0.5 ? 1 : 0;
        } else {
          current = 99;
        }
        current = Math.min(current, 99);
        setImportProgress(current);
      }, 800);

      try {
        await onGenerated(items);
        clearInterval(tick);
        setImportProgress(100);
        await new Promise((r) => setTimeout(r, 600));
      } catch {
        clearInterval(tick);
      } finally {
        setImporting(false);
        setImportProgress(0);
      }
    }
  };

  const handlePaste = () => {
    setPasteError("");
    try {
      const parsed = JSON.parse(pasteInput);
      const items = parsed.items || (Array.isArray(parsed) ? parsed : [parsed]);
      setPreview(items);
      setShowManual(false);
      setPasteInput("");
    } catch {
      setPasteError("JSON invalide. Assurez-vous de coller la réponse complète du LLM.");
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(manualPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Import overlay */}
      {importing && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#3b82f6] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1e293b] mb-2">
              {importProgress < 100 ? "Importation en cours..." : "Terminé !"}
            </h3>
            <p className="text-sm text-[#64748b] mb-4">
              {importProgress < 100
                ? "Les données sont en cours d'insertion. Merci de patienter."
                : "Rechargement de la page..."}
            </p>
            <div className="w-full h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${importProgress}%`,
                  backgroundColor: importProgress < 100 ? "#3b82f6" : "#22c55e",
                }}
              />
            </div>
            <p className="text-xs text-[#94a3b8] mt-2 font-mono">{importProgress}%</p>
          </div>
        </div>
      )}

      {/* Button + provider selector */}
      <div className="flex items-center gap-1.5">
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value as Provider)}
          disabled={loading || importing || !providersLoaded}
          className="text-xs bg-[#f5f3ff] text-[#7c3aed] border border-[#e9e5ff] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 disabled:opacity-50"
          title="Choisir le provider IA"
        >
          {availableProviders.map((p) => (
            <option key={p} value={p}>
              {PROVIDER_LABELS[p]}
            </option>
          ))}
        </select>

        <button
          onClick={generate}
          disabled={loading || importing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#f5f3ff] text-[#7c3aed] rounded-lg hover:bg-[#ede9fe] transition-colors disabled:opacity-50"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          {loading ? "Génération..." : label}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}

      {/* Manual fallback modal */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#1e293b]">
                Mode manuel — Copier/Coller
              </h3>
              <p className="text-sm text-[#64748b] mt-1">
                Copiez le prompt ci-dessous, collez-le dans ChatGPT, Claude ou un autre LLM, puis collez la réponse JSON.
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Step 1: Copy prompt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#1e293b]">
                    1. Copiez ce prompt
                  </label>
                  <button
                    onClick={copyPrompt}
                    className={`text-xs flex items-center gap-1 transition-colors ${copied ? "text-emerald-600" : "text-[#3b82f6] hover:underline"}`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copié !
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copier
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-3 max-h-40 overflow-y-auto">
                  <pre className="text-xs text-[#475569] whitespace-pre-wrap font-mono">
                    {manualPrompt || "Chargement du prompt..."}
                  </pre>
                </div>
              </div>

              {/* Step 2: Paste result */}
              <div>
                <label className="text-sm font-medium text-[#1e293b] mb-2 block">
                  2. Collez la réponse JSON du LLM
                </label>
                <textarea
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  rows={6}
                  placeholder='Collez ici la réponse JSON, ex: { "items": [...] }'
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#3b82f6] resize-none"
                />
                {pasteError && (
                  <p className="text-xs text-red-500 mt-1">{pasteError}</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button
                onClick={() => { setShowManual(false); setPasteInput(""); setPasteError(""); }}
                className="px-4 py-2 text-sm text-[#64748b] hover:text-[#1e293b] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handlePaste}
                disabled={!pasteInput.trim()}
                className="px-4 py-2 text-sm bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50"
              >
                Valider le JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#1e293b]">
                Résultats générés ({preview.length} éléments)
              </h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {preview.map((item, i) => (
                <div key={i} className="mb-3 p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                  <pre className="text-xs text-[#475569] whitespace-pre-wrap">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 text-sm text-[#64748b] hover:text-[#1e293b] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Tout ajouter ({preview.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
