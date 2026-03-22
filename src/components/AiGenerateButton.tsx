"use client";

import { useState } from "react";

interface AiGenerateButtonProps {
  type: string;
  projectId: string;
  label?: string;
  onGenerated: (items: Record<string, unknown>[]) => void;
}

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

  const generate = async () => {
    setLoading(true);
    setError("");
    setShowManual(false);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, projectId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 503) {
          // Ollama unavailable — use prompt from response or fetch it
          if (data.prompt) {
            setManualPrompt(data.prompt);
          } else {
            const promptRes = await fetch("/api/ai/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type, projectId, getPromptOnly: true }),
            });
            const promptData = await promptRes.json();
            setManualPrompt(promptData.prompt || "Erreur de chargement du prompt");
          }
          setShowManual(true);
        } else {
          setError(data.error || "Erreur de génération");
        }
        return;
      }
      setPreview(data.items || []);
    } catch {
      setShowManual(true);
      setManualPrompt("Erreur de connexion au serveur IA. Utilisez le mode manuel ci-dessous.");
    } finally {
      setLoading(false);
    }
  };

  const acceptAll = () => {
    if (preview) {
      onGenerated(preview);
      setPreview(null);
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
  };

  return (
    <>
      <button
        onClick={generate}
        disabled={loading}
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

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}

      {/* Manual fallback when Ollama is unavailable */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#1e293b]">
                IA non disponible — Mode manuel
              </h3>
              <p className="text-sm text-[#64748b] mt-1">
                Ollama n'est pas connecté. Copiez le prompt ci-dessous, collez-le dans ChatGPT, Claude ou un autre LLM, puis collez la réponse.
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
                    className="text-xs text-[#3b82f6] hover:underline flex items-center gap-1"
                  >
                    Copier
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
