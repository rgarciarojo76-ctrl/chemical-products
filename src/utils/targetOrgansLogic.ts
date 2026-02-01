// Mock Database (Priority 1)
// In a real app, this would be a loaded JSON or API call.
const USER_DB_TARGET_ORGANS: Record<string, string[]> = {
  // Common Carcinogens
  tricloroetileno: ["Riñón"],
  benceno: ["Médula Ósea", "Sangre", "Sistema Inmunológico"],
  amianto: ["Pulmón", "Pleura"],
  asbesto: ["Pulmón", "Pleura"],
  "polvo de madera dura": ["Fosas Nasales"],
  formaldehído: ["Nasofaringe"],
  "cromo vi": ["Pulmón", "Senos Paranasales"],
  "compuestos de cromo hexavalente": ["Pulmón", "Senos Paranasales"],
  "cloruro de vinilo": ["Hígado"],
  "oxido de etileno": ["Sangre", "Sistema Linfático"],
  "sílice cristalina": ["Pulmón"],
  plomo: ["Sistema Nervioso Central", "Riñón", "Sangre"],
  arsenico: ["Pulmón", "Piel", "Hígado"],
  niquel: ["Pulmón", "Senos Paranasales"],
  cadmio: ["Pulmón", "Riñón", "Próstata"],
};

// Toxicological Inference Map (Priority 3 - AI Fallback)
const AI_TOXICOLOGY_MAP: Record<string, string[]> = {
  wood: ["Fosas Nasales"],
  madera: ["Fosas Nasales"],
  benzene: ["Médula Ósea"],
  asbestos: ["Pulmón"],
  silica: ["Pulmón"],
  chromium: ["Pulmón"],
  nickel: ["Pulmón"],
  lead: ["Sistema Nervioso", "Riñón"],
};

export interface TargetOrganResult {
  organs: string[];
  source: "user_db" | "fds_h_phrase" | "ai_inference" | "unknown";
  confidence: "high" | "medium" | "low";
  divergenceAlert?: boolean;
  divergentOrgans?: string[];
}

/**
 * Normalizes text for comparison (lowercase, trimmed).
 */
function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Priority 2: Extract organs from H-Phrases
 */
function extractFromHPhrases(hPhrases: string[]): string[] {
  const organs: Set<string> = new Set();

  hPhrases.forEach((h) => {
    // Rule 1: Specific Target Organ Toxicity (H370-H373)
    // Often format: "H372: Provoca daños en los órganos (hígado, riñones)..."
    if (
      h.includes("370") ||
      h.includes("371") ||
      h.includes("372") ||
      h.includes("373")
    ) {
      // Try to extract content between parentheses
      const match = h.match(/\(([^)]+)\)/);
      if (match && match[1]) {
        // e.g. "hígado, riñones"
        const parts = match[1].split(/,| y | e /).map((s) => s.trim());
        parts.forEach((p) => {
          // Filter out non-organ text like "tras exposiciones prolongadas"
          if (!p.includes("exposición") && !p.includes("vía")) {
            organs.add(capitalize(p));
          }
        });
      }
    }

    // Rule 2: Specific Carcinogens (Inhalation)
    if (h.includes("350i")) {
      organs.add("Pulmón");
      organs.add("Vías Respiratorias");
    }

    // Rule 3: Resp. Sensitization / Irritation
    if (h.includes("334") || h.includes("335")) {
      organs.add("Vías Respiratorias");
    }
  });

  return Array.from(organs);
}

/**
 * Priority 3: AI Inference based on partial name matching or keywords
 */
function inferFromToxicology(substanceName: string): string[] {
  const normName = normalize(substanceName);

  for (const [key, val] of Object.entries(AI_TOXICOLOGY_MAP)) {
    if (normName.includes(key)) return val;
  }
  return [];
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * MAIN WATERFALL ALGORITHM
 */
export function determineTargetOrgans(
  substanceName: string,
  hPhrases: string[],
): TargetOrganResult {
  const normSubstance = normalize(substanceName);

  // --- STEP 1: USER DATABASE (Exact or close match) ---
  // In real app, this might be fuzzy search. Here strict for simplicity.
  const dbMatch = USER_DB_TARGET_ORGANS[normSubstance]; // Exact match
  // Also try keys that are contained in the name (e.g. "polvo de madera" inside "polvo de madera dura de roble")
  let partialDbMatch: string[] | undefined = dbMatch;
  if (!partialDbMatch) {
    const foundKey = Object.keys(USER_DB_TARGET_ORGANS).find((k) =>
      normSubstance.includes(k),
    );
    if (foundKey) partialDbMatch = USER_DB_TARGET_ORGANS[foundKey];
  }

  // --- STEP 2: FDS H-PHRASES ANALYSIS ---
  const fdsOrgans = extractFromHPhrases(hPhrases);

  // --- LOGIC FLOW ---

  if (partialDbMatch) {
    // Database Found. Check for Divergence with FDS.
    // If FDS explicitly says something DIFFERENT, we flag it.
    // E.g. DB says "Kidney", FDS says H372 (Liver).
    const divergence =
      fdsOrgans.length > 0 && !isArraySubset(fdsOrgans, partialDbMatch);

    return {
      organs: partialDbMatch,
      source: "user_db",
      confidence: "high",
      divergenceAlert: divergence,
      divergentOrgans: divergence ? fdsOrgans : undefined,
    };
  }

  // If no DB match, use FDS
  if (fdsOrgans.length > 0) {
    return {
      organs: fdsOrgans,
      source: "fds_h_phrase",
      confidence: "high", // FDS is "truth" for the specific product
    };
  }

  // If no FDS specific organs, use AI Inference
  const aiOrgans = inferFromToxicology(normSubstance);
  if (aiOrgans.length > 0) {
    return {
      organs: aiOrgans,
      source: "ai_inference",
      confidence: "medium",
    };
  }

  // Fallback
  return {
    organs: [],
    source: "unknown",
    confidence: "low",
  };
}

// Helper: Check if A is subset of B (roughly)
function isArraySubset(subset: string[], superset: string[]): boolean {
  const superLower = superset.map(normalize);
  return subset.every((s) =>
    superLower.some(
      (sup) => sup.includes(normalize(s)) || normalize(s).includes(sup),
    ),
  );
}
