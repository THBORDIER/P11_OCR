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

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, projectId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de génération");
        return;
      }
      setPreview(data.items || []);
    } catch {
      setError("Impossible de contacter le serveur IA");
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
