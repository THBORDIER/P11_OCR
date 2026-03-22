"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PRESET_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#6366f1",
  "#f97316",
];

interface SiretData {
  siret: string;
  siren: string;
  denomination: string;
  activite: string;
  libelleActivite: string;
  adresse: string;
  codePostal: string;
  ville: string;
  effectifs: string;
  categorieJuridique: string;
  enseigne?: string;
}

export default function NewProjectPage() {
  const router = useRouter();

  // Project fields
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [githubRepo, setGithubRepo] = useState("");
  const [organization, setOrganization] = useState("");

  // SIRET
  const [siret, setSiret] = useState("");
  const [siretLoading, setSiretLoading] = useState(false);
  const [siretData, setSiretData] = useState<SiretData | null>(null);
  const [siretError, setSiretError] = useState("");

  // Form
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Active step (wizard-like)
  const [step, setStep] = useState(1);

  // ── SIRET lookup ──
  const handleSiretLookup = async () => {
    const clean = siret.replace(/\s/g, "");
    if (clean.length !== 14) {
      setSiretError("Le SIRET doit contenir 14 chiffres");
      return;
    }

    setSiretLoading(true);
    setSiretError("");
    setSiretData(null);

    try {
      const res = await fetch(`/api/siret/${clean}`);
      if (!res.ok) {
        const data = await res.json();
        setSiretError(data.error || "Erreur lors de la recherche");
        setSiretLoading(false);
        return;
      }
      const data: SiretData = await res.json();
      setSiretData(data);

      // Auto-fill organization if empty
      if (!organization && data.denomination) {
        setOrganization(data.denomination);
      }
      // Auto-fill subtitle with activity
      if (!subtitle && data.libelleActivite) {
        setSubtitle(data.libelleActivite);
      }
    } catch {
      setSiretError("Impossible de contacter le service");
    } finally {
      setSiretLoading(false);
    }
  };

  // ── GitHub repo validation ──
  const isValidGithubRepo = (repo: string) => {
    if (!repo) return true; // Optional field
    return /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo);
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          subtitle,
          description,
          color,
          organization,
          githubRepo: githubRepo.trim() || undefined,
          siret: siretData?.siret || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue");
        setLoading(false);
        return;
      }

      const project = await res.json();
      router.push(`/${project.id}`);
    } catch {
      setError("Une erreur est survenue");
      setLoading(false);
    }
  };

  const slugPreview = name
    .toLowerCase()
    .trim()
    .replace(/[àâäáã]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[ïîí]/g, "i")
    .replace(/[ôöòóõ]/g, "o")
    .replace(/[üûùú]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const canProceedStep1 = name.trim().length > 0;
  const canProceedStep2 = true; // Optional fields
  const canSubmit = name.trim().length > 0 && isValidGithubRepo(githubRepo);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#1e293b] transition-colors mb-8"
        >
          &larr; Retour aux projets
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => s < step && setStep(s)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  s === step
                    ? "text-white shadow-md"
                    : s < step
                    ? "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200"
                    : "bg-[#f1f5f9] text-[#94a3b8]"
                }`}
                style={s === step ? { backgroundColor: color } : {}}
                disabled={s > step}
              >
                {s < step ? "✓" : s}
              </button>
              <span
                className={`text-sm ${
                  s === step ? "text-[#1e293b] font-medium" : "text-[#94a3b8]"
                }`}
              >
                {s === 1 ? "Projet" : s === 2 ? "Entreprise" : "Intégrations"}
              </span>
              {s < 3 && (
                <div
                  className={`w-12 h-0.5 mx-1 ${
                    s < step ? "bg-green-300" : "bg-[#e2e8f0]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: color }}
            >
              {name ? name[0].toUpperCase() : "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">
                Nouveau projet
              </h1>
              <p className="text-sm text-[#94a3b8]">
                {step === 1 && "Informations de base du projet"}
                {step === 2 && "Informations entreprise (optionnel)"}
                {step === 3 && "Dépôt GitHub et intégrations"}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ─── STEP 1: Project Info ─── */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#1e293b] mb-1.5"
                  >
                    Nom du projet <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mon Projet"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-[#1e293b] placeholder:text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-shadow"
                  />
                  {slugPreview && (
                    <p className="text-xs text-[#94a3b8] mt-1.5">
                      Identifiant :{" "}
                      <span className="font-mono">{slugPreview}</span>
                    </p>
                  )}
                </div>

                {/* Subtitle */}
                <div>
                  <label
                    htmlFor="subtitle"
                    className="block text-sm font-medium text-[#1e293b] mb-1.5"
                  >
                    Sous-titre
                  </label>
                  <input
                    id="subtitle"
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Une courte description"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-[#1e293b] placeholder:text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-shadow"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[#1e293b] mb-1.5"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre projet en quelques lignes..."
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-[#1e293b] placeholder:text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-shadow resize-none"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b] mb-3">
                    Couleur du projet
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className="w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6]"
                        style={{
                          backgroundColor: c,
                          boxShadow:
                            color === c
                              ? `0 0 0 2px white, 0 0 0 4px ${c}`
                              : "none",
                        }}
                        aria-label={`Couleur ${c}`}
                      />
                    ))}
                    <label
                      className="w-8 h-8 rounded-full border-2 border-dashed border-[#cbd5e1] flex items-center justify-center cursor-pointer hover:border-[#94a3b8] transition-colors overflow-hidden"
                      title="Couleur personnalisée"
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="opacity-0 absolute w-0 h-0"
                      />
                      <span className="text-xs text-[#94a3b8]">+</span>
                    </label>
                  </div>
                </div>

                {/* Next */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f1f5f9]">
                  <Link
                    href="/"
                    className="px-5 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#1e293b] transition-colors"
                  >
                    Annuler
                  </Link>
                  <button
                    type="button"
                    disabled={!canProceedStep1}
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                    style={{ backgroundColor: color }}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 2: Enterprise / SIRET ─── */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Organization name */}
                <div>
                  <label
                    htmlFor="organization"
                    className="block text-sm font-medium text-[#1e293b] mb-1.5"
                  >
                    Organisation / Client
                  </label>
                  <input
                    id="organization"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Nom de l'entreprise ou du client"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-[#1e293b] placeholder:text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-shadow"
                  />
                </div>

                {/* SIRET Lookup */}
                <div>
                  <label
                    htmlFor="siret"
                    className="block text-sm font-medium text-[#1e293b] mb-1.5"
                  >
                    Recherche SIRET
                  </label>
                  <p className="text-xs text-[#94a3b8] mb-2">
                    Entrez un numéro SIRET (14 chiffres) pour auto-compléter les
                    informations entreprise
                  </p>
                  <div className="flex gap-2">
                    <input
                      id="siret"
                      type="text"
                      value={siret}
                      onChange={(e) => {
                        // Only allow digits and spaces
                        const val = e.target.value.replace(/[^\d\s]/g, "");
                        setSiret(val);
                        setSiretError("");
                      }}
                      placeholder="123 456 789 00012"
                      maxLength={17}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-[#1e293b] placeholder:text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-shadow font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSiretLookup}
                      disabled={siretLoading || siret.replace(/\s/g, "").length !== 14}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#1e293b] text-white hover:bg-[#334155] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                      {siretLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Recherche...
                        </span>
                      ) : (
                        "Rechercher"
                      )}
                    </button>
                  </div>

                  {siretError && (
                    <p className="text-sm text-red-600 mt-2">{siretError}</p>
                  )}

                  {/* SIRET Results Card */}
                  {siretData && (
                    <div className="mt-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-green-600 text-lg">✓</span>
                        <span className="font-medium text-green-800">
                          Entreprise trouvée
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-[#64748b]">Dénomination</span>
                          <p className="font-medium text-[#1e293b]">
                            {siretData.denomination || "—"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#64748b]">SIRET</span>
                          <p className="font-mono text-[#1e293b]">
                            {siretData.siret}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#64748b]">Activité</span>
                          <p className="text-[#1e293b]">
                            {siretData.libelleActivite || siretData.activite || "—"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#64748b]">Effectifs</span>
                          <p className="text-[#1e293b]">
                            {siretData.effectifs || "—"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#64748b]">Adresse</span>
                          <p className="text-[#1e293b]">
                            {siretData.adresse || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#1e293b] transition-colors"
                  >
                    &larr; Retour
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#1e293b] transition-colors"
                    >
                      Passer
                    </button>
                    <button
                      type="button"
                      disabled={!canProceedStep2}
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                      style={{ backgroundColor: color }}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 3: GitHub + Integrations ─── */}
            {step === 3 && (
              <div className="space-y-6">
                {/* GitHub Repo */}
                <div>
                  <label
                    htmlFor="githubRepo"
                    className="block text-sm font-medium text-[#1e293b] mb-1.5"
                  >
                    Dépôt GitHub
                  </label>
                  <p className="text-xs text-[#94a3b8] mb-2">
                    Liez un dépôt GitHub pour synchroniser issues, commits et
                    pull requests
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94a3b8] text-sm">github.com/</span>
                    <input
                      id="githubRepo"
                      type="text"
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      placeholder="user/repository"
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-[#1e293b] placeholder:text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-shadow font-mono text-sm ${
                        githubRepo && !isValidGithubRepo(githubRepo)
                          ? "border-red-300 bg-red-50"
                          : "border-[#e2e8f0]"
                      }`}
                    />
                  </div>
                  {githubRepo && !isValidGithubRepo(githubRepo) && (
                    <p className="text-xs text-red-500 mt-1">
                      Format attendu : utilisateur/nom-du-repo
                    </p>
                  )}
                </div>

                {/* Future integrations placeholder */}
                <div className="bg-[#f8fafc] border border-dashed border-[#e2e8f0] rounded-lg p-6">
                  <h3 className="text-sm font-medium text-[#94a3b8] mb-3">
                    Intégrations à venir
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: "🤖", name: "Ollama (IA locale)", ready: true },
                      { icon: "📧", name: "Resend (Mailing)", ready: true },
                      { icon: "🔗", name: "Webhooks", ready: false },
                      { icon: "📊", name: "Analytics", ready: false },
                    ].map((integration) => (
                      <div
                        key={integration.name}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                          integration.ready
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-[#f1f5f9] text-[#94a3b8]"
                        }`}
                      >
                        <span>{integration.icon}</span>
                        <span>{integration.name}</span>
                        {integration.ready && (
                          <span className="ml-auto text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
                            Actif
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                  <h3 className="text-sm font-medium text-[#1e293b] mb-2">
                    Récapitulatif
                  </h3>
                  <div className="space-y-1 text-sm text-[#64748b]">
                    <p>
                      <span className="font-medium text-[#1e293b]">{name}</span>
                      {subtitle && ` — ${subtitle}`}
                    </p>
                    {organization && <p>Client : {organization}</p>}
                    {siretData && (
                      <p>SIRET : {siretData.siret} ({siretData.denomination})</p>
                    )}
                    {githubRepo && <p>GitHub : {githubRepo}</p>}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#1e293b] transition-colors"
                  >
                    &larr; Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !canSubmit}
                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                    style={{ backgroundColor: color }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Création...
                      </span>
                    ) : (
                      "Créer le projet"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
