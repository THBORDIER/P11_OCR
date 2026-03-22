"use client";

import { useState } from "react";

interface SendPageButtonProps {
  projectId: string;
  pageType: "analyse" | "backlog" | "roadmap" | "sprints" | "recettage";
}

export default function SendPageButton({ projectId, pageType }: SendPageButtonProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/send-page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, pageType }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur d'envoi");
        return;
      }
      setSent(true);
      setTimeout(() => {
        setOpen(false);
        setSent(false);
        setEmail("");
      }, 2000);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#f1f5f9] text-[#475569] rounded-lg hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0]"
        title="Envoyer cette page par email"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Envoyer par mail
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#1e293b]">
                Envoyer par email
              </h3>
              <p className="text-sm text-[#64748b] mt-1">
                Un email formaté avec le contenu de cette page sera envoyé.
              </p>
            </div>

            <div className="p-6">
              {sent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#22c55e]">Email envoyé avec succès !</p>
                </div>
              ) : (
                <>
                  <label className="text-sm font-medium text-[#1e293b] block mb-2">
                    Destinataire(s)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com, autre@exemple.com"
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    autoFocus
                  />
                  <p className="text-[10px] text-[#94a3b8] mt-1.5">
                    Séparez plusieurs adresses par des virgules.
                  </p>
                  {error && (
                    <p className="text-xs text-red-500 mt-2">{error}</p>
                  )}
                </>
              )}
            </div>

            {!sent && (
              <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
                <button
                  onClick={() => { setOpen(false); setEmail(""); setError(""); }}
                  className="px-4 py-2 text-sm text-[#64748b] hover:text-[#1e293b] transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSend}
                  disabled={!email.trim() || sending}
                  className="px-4 py-2 text-sm bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Envoi...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Envoyer
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
