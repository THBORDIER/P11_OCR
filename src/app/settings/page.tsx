"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CliProvider {
  name: string;
  command: string;
  enabled: boolean;
}

type TestStatus = "idle" | "testing" | "ok" | "error";

export default function GlobalSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Ollama
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("llama3.2");
  const [ollamaStatus, setOllamaStatus] = useState<TestStatus>("idle");
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [ollamaError, setOllamaError] = useState("");

  // CLI
  const [cliEnabled, setCliEnabled] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [detectedProviders, setDetectedProviders] = useState<string[]>([]);
  const [cliDetecting, setCliDetecting] = useState(false);

  // CLI Providers config
  const [providers, setProviders] = useState<CliProvider[]>([
    { name: "claude", command: "claude", enabled: true },
    { name: "gemini", command: "gemini", enabled: false },
    { name: "codex", command: "codex", enabled: false },
  ]);

  // Test zone
  const [testProvider, setTestProvider] = useState("claude");
  const [testPrompt, setTestPrompt] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [testLoading, setTestLoading] = useState(false);

  // Load settings
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setOllamaUrl(data.ollamaUrl || "http://localhost:11434");
        setOllamaModel(data.ollamaModel || "llama3.2");
        setCliEnabled(data.cliBridgeEnabled || false);
        if (Array.isArray(data.cliProviders) && data.cliProviders.length > 0) {
          setProviders(data.cliProviders);
        }
      })
      .catch(() => setError("Impossible de charger les paramètres"))
      .finally(() => setLoading(false));
  }, []);

  // Detect CLI providers on mount
  const detectCli = () => {
    setCliDetecting(true);
    fetch("/api/cli/providers")
      .then((r) => r.json())
      .then((data) => {
        setIsLocal(data.local ?? false);
        setDetectedProviders(data.providers || []);
      })
      .catch(() => setIsLocal(false))
      .finally(() => setCliDetecting(false));
  };

  useEffect(() => {
    detectCli();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ollamaUrl,
          ollamaModel,
          cliBridgeEnabled: cliEnabled,
          cliProviders: providers,
        }),
      });
      if (!res.ok) throw new Error("Erreur de sauvegarde");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const testOllama = async () => {
    setOllamaStatus("testing");
    setOllamaError("");
    try {
      const res = await fetch("/api/settings/test-ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: ollamaUrl }),
      });
      const data = await res.json();
      if (data.ok) {
        setOllamaStatus("ok");
        setOllamaModels(data.models || []);
      } else {
        setOllamaStatus("error");
        setOllamaError(data.error || "Erreur de connexion");
      }
    } catch {
      setOllamaStatus("error");
      setOllamaError("Impossible de tester la connexion");
    }
  };

  const sendTestPrompt = async () => {
    if (!testPrompt.trim()) return;
    setTestLoading(true);
    setTestResponse("");
    try {
      const res = await fetch("/api/cli/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: testProvider, prompt: testPrompt }),
      });
      const data = await res.json();
      if (data.error) {
        setTestResponse(`Erreur : ${data.error}`);
      } else {
        setTestResponse(data.response || "(Pas de réponse)");
      }
    } catch {
      setTestResponse("Erreur de connexion");
    } finally {
      setTestLoading(false);
    }
  };

  const toggleProvider = (index: number) => {
    setProviders((prev) =>
      prev.map((p, i) => (i === index ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const updateProviderCommand = (index: number, command: string) => {
    setProviders((prev) =>
      prev.map((p, i) => (i === index ? { ...p, command } : p))
    );
  };

  const addProvider = () => {
    const name = window.prompt("Nom du provider :");
    if (!name?.trim()) return;
    setProviders((prev) => [
      ...prev,
      { name: name.trim().toLowerCase(), command: name.trim().toLowerCase(), enabled: true },
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2f7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const enabledProviders = providers.filter((p) => p.enabled);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2f7]">
      {/* Header */}
      <header className="border-b border-[#e2e8f0] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-[#1e293b] text-lg">DevTracker</span>
            </Link>
            <span className="text-[#94a3b8] text-sm">/</span>
            <span className="text-sm font-medium text-[#64748b]">Paramètres globaux</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#1e293b] mb-8">Paramètres globaux</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">{error}</div>
        )}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-700">
            Paramètres enregistrés.
          </div>
        )}

        {/* ── Ollama ── */}
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Ollama</h2>
          <p className="text-xs text-[#94a3b8] mb-4">Serveur de modèles IA local pour la génération automatique</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL du serveur</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={testOllama}
                  disabled={ollamaStatus === "testing"}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {ollamaStatus === "testing" ? "Test..." : "Tester"}
                </button>
              </div>
              {ollamaStatus === "ok" && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Connecté — {ollamaModels.length} modèle{ollamaModels.length > 1 ? "s" : ""}
                </p>
              )}
              {ollamaStatus === "error" && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  {ollamaError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Modèle</label>
              {ollamaModels.length > 0 ? (
                <select
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ollamaModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  placeholder="llama3.2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>
        </div>

        {/* ── CLI IA ── */}
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-[#1e293b]">CLI IA</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cliEnabled}
                onChange={(e) => setCliEnabled(e.target.checked)}
                className="rounded border-slate-300 accent-blue-600"
              />
              Activé
            </label>
          </div>
          <p className="text-xs text-[#94a3b8] mb-4">
            Exécutez Claude, Gemini ou Codex directement depuis l'application (localhost uniquement)
          </p>

          {/* Environment detection */}
          <div className={`rounded-lg p-3 mb-4 text-sm flex items-center gap-2 ${
            isLocal
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-amber-50 border border-amber-200 text-amber-700"
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isLocal ? "bg-green-500" : "bg-amber-500"}`} />
            {cliDetecting ? (
              "Détection en cours..."
            ) : isLocal ? (
              <>Environnement local détecté — {detectedProviders.length} CLI disponible{detectedProviders.length > 1 ? "s" : ""} : <strong>{detectedProviders.join(", ") || "aucun"}</strong></>
            ) : (
              "Environnement serverless détecté — les CLI ne sont disponibles qu'en localhost"
            )}
            <button
              onClick={detectCli}
              disabled={cliDetecting}
              className="ml-auto text-xs font-medium underline hover:no-underline"
            >
              Rafraîchir
            </button>
          </div>

          {/* Providers */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#1e293b]">Providers</p>
            <button
              onClick={addProvider}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Ajouter
            </button>
          </div>

          <div className="space-y-2">
            {providers.map((p, i) => (
              <div
                key={p.name}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                  p.enabled ? "border-blue-200 bg-blue-50/50" : "border-slate-200 bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={() => toggleProvider(i)}
                  className="rounded border-slate-300 accent-blue-600"
                />
                <span className="text-sm font-semibold text-[#1e293b] w-20">{p.name}</span>
                <input
                  type="text"
                  value={p.command}
                  onChange={(e) => updateProviderCommand(i, e.target.value)}
                  className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {detectedProviders.includes(p.name) ? (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                    Installé
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    Non trouvé
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Zone de test ── */}
        {cliEnabled && isLocal && (
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-1">Test rapide</h2>
            <p className="text-xs text-[#94a3b8] mb-4">Envoyez un prompt à un CLI et visualisez la réponse</p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Provider</label>
                  <select
                    value={testProvider}
                    onChange={(e) => setTestProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {enabledProviders.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} {detectedProviders.includes(p.name) ? "" : "(non installé)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prompt</label>
                <textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Posez une question..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendTestPrompt();
                  }}
                />
                <p className="text-xs text-slate-400 mt-1">Ctrl+Enter pour envoyer</p>
              </div>

              <button
                onClick={sendTestPrompt}
                disabled={testLoading || !testPrompt.trim() || !detectedProviders.includes(testProvider)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {testLoading && (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                )}
                {testLoading ? "Exécution en cours..." : "Envoyer"}
              </button>

              {testResponse && (
                <div className="bg-[#1e293b] rounded-lg p-4 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-[#94a3b8] font-mono">Réponse de {testProvider} :</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(testResponse)}
                      className="text-xs text-[#94a3b8] hover:text-white transition-colors"
                    >
                      Copier
                    </button>
                  </div>
                  <pre className="text-sm text-[#e2e8f0] whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                    {testResponse}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CLI disabled or serverless notice */}
        {cliEnabled && !isLocal && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6 text-center">
            <p className="text-sm text-amber-800 font-medium mb-1">CLI non disponible sur Vercel</p>
            <p className="text-xs text-amber-600">
              Lancez l'application en local (<code className="bg-amber-100 px-1 rounded">npm run dev</code>) pour utiliser les CLI IA.
            </p>
          </div>
        )}

        {/* ── Save ── */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
          </button>
        </div>
      </main>
    </div>
  );
}
