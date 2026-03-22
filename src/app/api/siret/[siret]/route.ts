import { NextRequest, NextResponse } from "next/server";

interface SireneUniteLegale {
  denominationUniteLegale?: string;
  prenomUsuelUniteLegale?: string;
  nomUniteLegale?: string;
  activitePrincipaleUniteLegale?: string;
  categorieJuridiqueUniteLegale?: string;
  trancheEffectifsUniteLegale?: string;
}

interface SireneAdresse {
  numeroVoieEtablissement?: string;
  typeVoieEtablissement?: string;
  libelleVoieEtablissement?: string;
  codePostalEtablissement?: string;
  libelleCommuneEtablissement?: string;
}

interface SireneEtablissement {
  siret: string;
  siren: string;
  uniteLegale?: SireneUniteLegale;
  adresseEtablissement?: SireneAdresse;
  periodesEtablissement?: Array<{
    activitePrincipaleEtablissement?: string;
    enseigne1Etablissement?: string;
  }>;
}

// Mapping tranches d'effectifs INSEE
const TRANCHES_EFFECTIFS: Record<string, string> = {
  NN: "Non renseigné",
  "00": "0 salarié",
  "01": "1-2 salariés",
  "02": "3-5 salariés",
  "03": "6-9 salariés",
  "11": "10-19 salariés",
  "12": "20-49 salariés",
  "21": "50-99 salariés",
  "22": "100-199 salariés",
  "31": "200-249 salariés",
  "32": "250-499 salariés",
  "41": "500-999 salariés",
  "42": "1 000-1 999 salariés",
  "51": "2 000-4 999 salariés",
  "52": "5 000-9 999 salariés",
  "53": "10 000+ salariés",
};

// ── OAuth2 token cache ──
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getInseeToken(): Promise<string | null> {
  const clientId = process.env.SIRENE_CLIENT_ID;
  const clientSecret = process.env.SIRENE_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch("https://api.insee.fr/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) return null;

    const data = await response.json();
    cachedToken = data.access_token;
    // expires_in is in seconds
    tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    return cachedToken;
  } catch {
    return null;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siret: string }> }
) {
  const { siret } = await params;

  // Validate SIRET format (14 digits)
  const cleanSiret = siret.replace(/\s/g, "");
  if (!/^\d{14}$/.test(cleanSiret)) {
    return NextResponse.json(
      { error: "Le SIRET doit contenir exactement 14 chiffres" },
      { status: 400 }
    );
  }

  // Try INSEE Sirene API with OAuth2
  const token = await getInseeToken();

  if (token) {
    try {
      const response = await fetch(
        `https://api.insee.fr/entreprises/sirene/V3.11/siret/${cleanSiret}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const etab: SireneEtablissement = data.etablissement;
        return NextResponse.json(formatResponse(etab));
      }

      // If 404 from INSEE = SIRET genuinely not found
      if (response.status === 404) {
        // Still try fallback (INSEE might not have it but open data might)
        return await fallbackSearch(cleanSiret);
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback to open data API (no auth required)
  return await fallbackSearch(cleanSiret);
}

async function fallbackSearch(siret: string) {
  try {
    const response = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${siret}&page=1&per_page=1`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Impossible de contacter l'API Sirene" },
        { status: 502 }
      );
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: "SIRET introuvable" },
        { status: 404 }
      );
    }

    const result = data.results[0];
    const siege = result.siege || {};

    return NextResponse.json({
      siret,
      siren: result.siren || siret.substring(0, 9),
      denomination: result.nom_complet || result.nom_raison_sociale || "",
      activite: result.activite_principale || "",
      libelleActivite: result.libelle_activite_principale || "",
      adresse: [siege.adresse, siege.code_postal, siege.libelle_commune]
        .filter(Boolean)
        .join(", "),
      codePostal: siege.code_postal || "",
      ville: siege.libelle_commune || "",
      effectifs: TRANCHES_EFFECTIFS[siege.tranche_effectif_salarie] ||
        siege.tranche_effectif_salarie ||
        "Non renseigné",
      categorieJuridique: result.nature_juridique || "",
    });
  } catch {
    return NextResponse.json(
      { error: "Impossible de contacter l'API Sirene" },
      { status: 502 }
    );
  }
}

function formatResponse(etab: SireneEtablissement) {
  const ul = etab.uniteLegale || {};
  const addr = etab.adresseEtablissement || {};
  const periode = etab.periodesEtablissement?.[0];

  const denomination =
    ul.denominationUniteLegale ||
    [ul.prenomUsuelUniteLegale, ul.nomUniteLegale].filter(Boolean).join(" ") ||
    "";

  const adresseParts = [
    [addr.numeroVoieEtablissement, addr.typeVoieEtablissement, addr.libelleVoieEtablissement]
      .filter(Boolean)
      .join(" "),
    addr.codePostalEtablissement,
    addr.libelleCommuneEtablissement,
  ].filter(Boolean);

  return {
    siret: etab.siret,
    siren: etab.siren,
    denomination,
    activite: ul.activitePrincipaleUniteLegale || periode?.activitePrincipaleEtablissement || "",
    libelleActivite: "",
    adresse: adresseParts.join(", "),
    codePostal: addr.codePostalEtablissement || "",
    ville: addr.libelleCommuneEtablissement || "",
    effectifs: TRANCHES_EFFECTIFS[ul.trancheEffectifsUniteLegale || "NN"] || "Non renseigné",
    categorieJuridique: ul.categorieJuridiqueUniteLegale || "",
    enseigne: periode?.enseigne1Etablissement || "",
  };
}
