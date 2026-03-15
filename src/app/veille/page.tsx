"use client";

import { useState } from "react";

// ── Types ──
type Source = { nom: string; url: string };
type Theme = {
  theme: string;
  description: string;
  sources: Source[];
  avantages: string;
  consultation: string;
  utiliseDansProjet?: boolean;
  apprentissage?: string;
};
type Categorie = {
  titre: string;
  miseAJour: string;
  items: Theme[];
};

// ╔══════════════════════════════════════════════════════════════╗
// ║  PERSONNALISEZ vos catégories de veille ci-dessous          ║
// ╚══════════════════════════════════════════════════════════════╝
const categories: Categorie[] = [
  {
    titre: "Écosystème technique",
    miseAJour: "À mettre à jour",
    items: [
      {
        theme: "Nouvelles fonctionnalités des outils",
        description:
          "Annonces et mises à jour des plateformes et frameworks utilisés dans le projet.",
        sources: [
          { nom: "Source officielle 1", url: "https://example.com" },
          { nom: "Communauté", url: "https://example.com" },
          { nom: "YouTube", url: "https://example.com" },
        ],
        avantages:
          "Rester informé des nouvelles capacités et anticiper les évolutions techniques.",
        consultation: "Newsletter hebdomadaire + check communauté chaque lundi.",
        utiliseDansProjet: true,
        apprentissage:
          "Décrivez ici ce que vous avez appris et appliqué au projet.",
      },
      {
        theme: "Bonnes pratiques de développement",
        description:
          "Recommandations pour structurer les projets et assurer la maintenabilité.",
        sources: [
          { nom: "Forum spécialisé", url: "https://example.com" },
          { nom: "Medium / Dev.to", url: "https://example.com" },
        ],
        avantages:
          "Éviter les anti-patterns et améliorer la qualité des livrables.",
        consultation: "Veille passive via Slack + lecture 1x/semaine.",
      },
    ],
  },
  {
    titre: "Domaine métier",
    miseAJour: "À mettre à jour",
    items: [
      {
        theme: "Tendances du secteur",
        description:
          "Évolutions du marché, nouveaux entrants, études de cas et benchmarks.",
        sources: [
          { nom: "Site de référence", url: "https://example.com" },
          { nom: "Rapport sectoriel", url: "https://example.com" },
        ],
        avantages:
          "Anticiper les besoins du marché et positionner le produit.",
        consultation: "Lecture mensuelle des rapports et newsletters.",
      },
      {
        theme: "Réglementation et conformité",
        description:
          "Évolutions réglementaires impactant le projet (RGPD, accessibilité, etc.).",
        sources: [
          { nom: "CNIL / autorité compétente", url: "https://example.com" },
          { nom: "Blog juridique spécialisé", url: "https://example.com" },
        ],
        avantages:
          "Assurer la conformité du produit et anticiper les obligations.",
        consultation: "Alerte Google + vérification trimestrielle.",
      },
    ],
  },
  {
    titre: "Outils et productivité",
    miseAJour: "À mettre à jour",
    items: [
      {
        theme: "Nouveaux outils et extensions",
        description:
          "Découverte d'outils complémentaires pour enrichir le projet.",
        sources: [
          { nom: "Product Hunt", url: "https://www.producthunt.com" },
          { nom: "Marketplace officielle", url: "https://example.com" },
        ],
        avantages:
          "Gagner du temps et enrichir les projets sans développement custom.",
        consultation: "Digest quotidien + check marketplace mensuel.",
      },
    ],
  },
];

export default function VeillePage() {
  const [openCat, setOpenCat] = useState<number | null>(0);

  const totalSources = categories.reduce(
    (acc, c) => acc + c.items.reduce((a, i) => a + i.sources.length, 0),
    0
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e293b]">
          Tableau de veille technologique
        </h1>
        <p className="text-[#64748b] mt-2">
          Livrable 7 — Système de veille technologique et métier
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#3b82f6]">
            {categories.length}
          </div>
          <div className="text-xs text-[#64748b]">Catégories</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#f59e0b]">
            {categories.reduce((a, c) => a + c.items.length, 0)}
          </div>
          <div className="text-xs text-[#64748b]">Thèmes</div>
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-4 text-center">
          <div className="text-2xl font-bold text-[#22c55e]">
            {totalSources}
          </div>
          <div className="text-xs text-[#64748b]">Sources</div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((cat, cIndex) => (
          <div
            key={cIndex}
            className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden"
          >
            <button
              onClick={() => setOpenCat(openCat === cIndex ? null : cIndex)}
              className="w-full text-left p-5 flex items-center justify-between hover:bg-[#f8fafc] transition-colors"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-[#1e293b]">
                  {cat.titre}
                </h2>
                <span className="text-xs bg-[#f1f5f9] px-2 py-0.5 rounded text-[#64748b]">
                  {cat.items.length} thèmes
                </span>
                <span className="text-xs text-[#94a3b8]">
                  MAJ : {cat.miseAJour}
                </span>
              </div>
              <span className="text-[#94a3b8] text-xl">
                {openCat === cIndex ? "−" : "+"}
              </span>
            </button>

            {openCat === cIndex && (
              <div className="border-t border-[#f1f5f9]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f8fafc]">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                          Thème
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                          Sources
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                          Avantages
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                          Fréquence
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-[#64748b]">
                          Utilisé
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items.map((item, iIndex) => (
                        <tr
                          key={iIndex}
                          className="border-t border-[#f1f5f9] align-top"
                        >
                          <td className="py-3 px-4">
                            <p className="font-medium text-[#1e293b]">
                              {item.theme}
                            </p>
                            <p className="text-xs text-[#64748b] mt-1">
                              {item.description}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              {item.sources.map((s, sIndex) => (
                                <a
                                  key={sIndex}
                                  href={s.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-xs text-[#3b82f6] hover:underline"
                                >
                                  {s.nom} ↗
                                </a>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs text-[#475569]">
                            {item.avantages}
                          </td>
                          <td className="py-3 px-4 text-xs text-[#475569]">
                            {item.consultation}
                          </td>
                          <td className="py-3 px-4">
                            {item.utiliseDansProjet ? (
                              <div>
                                <span className="text-xs font-semibold text-[#22c55e]">
                                  Oui
                                </span>
                                {item.apprentissage && (
                                  <p className="text-xs text-[#64748b] mt-1">
                                    {item.apprentissage}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-[#94a3b8]">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
