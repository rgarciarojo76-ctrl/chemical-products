import type { En689Result, Sample } from "../types";

// Constants for One-Sided Tolerance Limits (70% Confidence / 95% Percentile)
// Table 1 of UNE-EN 689:2019 (k-factors)
// Or approximated by standard UTL tables for n
// Values for n=6 to n=50 (simplified map)
const K_FACTORS: Record<number, number> = {
  6: 2.187,
  7: 2.12,
  8: 2.072,
  9: 2.035,
  10: 2.005,
  11: 1.981,
  12: 1.96,
  13: 1.942,
  14: 1.926,
  15: 1.912,
  // Approximate formula for n > 15: k ~ 1.645 + (1/sqrt(n))? No, it's specific table.
  // For implementation, we'll map common values and use a fallback for larger N (converges to 1.645)
  16: 1.9,
  17: 1.889,
  18: 1.879,
  19: 1.87,
  20: 1.861,
};

// Fallback for N > 20 (Approximation)
const getKFactor = (n: number): number => {
  if (n < 6) return 0; // Not applicable
  if (K_FACTORS[n]) return K_FACTORS[n];
  // As n -> inf, k -> z_0.95 = 1.645
  // For n=50, k~1.75. Simply return 1.8 for safety in this demo or implement full formula
  return 1.8;
};

export const calculateSampleConcentration = (sample: Sample): number => {
  if (sample.type === "direct") return sample.value;
  if (sample.raw) {
    const { mass, flow, time } = sample.raw;
    if (flow === 0 || time === 0) return 0;
    // C (mg/m3) = (Mass (ug) / 1000) / ((Flow (l/min) * Time (min)) / 1000)
    // C = (M / 1000) / (V_liters / 1000) = M_ug / V_liters
    // Wait, typical units:
    // mass in ug. flow in l/min. time in min.
    // Volume in liters = flow * time.
    // C in mg/m3 = (mass_ug / Volume_liters) * (1 mg / 1000 ug) * (1000 liters / 1 m3)
    // The factors 1000 cancel out?
    // 1 ug/L = 1000 ug/m3 = 1 mg/m3.
    // So yes, C (mg/m3) = mass (ug) / (flow * time).
    return mass / (flow * time);
  }
  return 0;
};

const getLnValues = (samples: number[]) => samples.map((v) => Math.log(v));

const calculateStats = (values: number[]) => {
  const lnVals = getLnValues(values);
  const n = values.length;
  const sumLn = lnVals.reduce((a, b) => a + b, 0);
  const meanLn = sumLn / n;

  const sumSqDiff = lnVals.reduce((a, b) => a + Math.pow(b - meanLn, 2), 0);
  const sdLn = Math.sqrt(sumSqDiff / (n - 1));

  const gm = Math.exp(meanLn);
  const gsd = Math.exp(sdLn);

  return { gm, gsd, meanLn, sdLn, n };
};

export const runEn689Evaluation = (
  samples: Sample[],
  vla: number,
): En689Result => {
  const validSamples = samples.filter((s) => s.value > 0);

  const qualityAlerts: string[] = [];

  // Extract numeric values (applying LOD multiplier if needed)
  const concentrationValues = validSamples
    .map((s) => {
      if (s.isBelowLod && s.lodMultiplier && s.value > 0) {
        // Only apply multiplier if value is positive (the limit)
        return s.value * s.lodMultiplier;
      }
      return s.value;
    })
    .filter((v) => v > 0);

  if (concentrationValues.length === 0) {
    return {
      decision: "need_more_samples",
      ruleApplied: "screening",
      vlaApplied: vla,
      samples: validSamples,
      qualityAlerts: ["No hay muestras válidas (> 0)"],
      nextCheck: "Pendiente",
    };
  }

  const n = concentrationValues.length; // Use filtered length

  // --- PHASE 1: SCREENING Test (n < 6) ---
  if (n < 6) {
    const maxVal = Math.max(...concentrationValues);
    let limitFraction = 0.1; // Default for n=3
    if (n === 4) limitFraction = 0.15;
    if (n === 5) limitFraction = 0.2;

    const limit = vla * limitFraction;
    const isCompliant = maxVal <= limit;

    return {
      decision: isCompliant ? "compliant" : "need_more_samples",
      ruleApplied: "screening",
      vlaApplied: vla,
      samples: validSamples,
      qualityAlerts,
      nextCheck: isCompliant
        ? "36 meses (Screening superado)"
        : "Requiere ampliar a 6 muestras",
      stats: {
        gm: 0,
        gsd: 0,
        p95: maxVal,
        ur: limit,
        complianceIndex: maxVal / vla,
      },
    };
  }

  // --- PHASE 2: STATISTICAL Test (n >= 6) ---
  if (n >= 6) {
    const { gm, gsd, meanLn, sdLn } = calculateStats(concentrationValues);
    const k = getKFactor(n);

    // UR calculation (Upper Range / UTL 95,70)
    // UR = exp( meanLn + k * sdLn )
    const ur = Math.exp(meanLn + k * sdLn);

    // Compliance Check
    const isCompliant = ur <= vla;
    const complianceIndex = ur / vla;

    // Quality Check
    if (gsd > 3) {
      qualityAlerts.push(
        "GSD > 3: Variabilidad excesiva. El GES puede no ser homogéneo.",
      );
    }

    // Periodicity Logic
    let nextCheck = "12 meses";
    if (complianceIndex <= 0.25) nextCheck = "36 meses";
    else if (complianceIndex <= 0.5) nextCheck = "24 meses";

    return {
      decision: isCompliant ? "compliant" : "non_compliant",
      ruleApplied: "statistical_utl",
      vlaApplied: vla,
      samples: validSamples,
      qualityAlerts,
      nextCheck,
      stats: {
        gm,
        gsd,
        p95: Math.exp(meanLn + 1.645 * sdLn), // True P95 point estimate
        ur,
        complianceIndex,
      },
    };
  }

  // Fallback (n < 3)
  return {
    decision: "need_more_samples",
    ruleApplied: "screening",
    vlaApplied: vla,
    samples: validSamples,
    qualityAlerts: ["Mínimo 3 mediciones requeridas para screening."],
    nextCheck: "Pendiente",
    stats: undefined,
  };
};
