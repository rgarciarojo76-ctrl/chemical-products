import type { StoffenmanagerInput, StoffenmanagerResult } from "../types";

// --- constants ---
// A. Intrinsic Emission
// A = Liquid Vapor Pressure Score OR Solid Dustiness Score
// We need lookup tables for Vapor Pressure bands.
// For Solids: solid_objects=0, granules_firm=0.01(?), etc.
// Using standard simplified non-assisted model values (approximated for this implementation)

const SCORE_VAPOUR = (pa: number) => {
  if (pa < 0.01) return 0; // negligible
  if (pa < 500) return 0.03;
  if (pa < 10000) return 0.1;
  if (pa >= 10000) return 0.3; // High volatility
  return 1; // Extremely high (e.g. heated)
};

const SCORE_DUSTINESS = {
  solid_objects: 0,
  granules_firm: 0.01,
  granules_friable: 0.03,
  dust_coarse: 0.1,
  dust_fine: 0.3,
  dust_extreme: 1,
};

// B. Handling (Activity Class)
const SCORE_HANDLING = {
  A: 0.03, // Low energy (careful handling)
  B: 0.1,
  C: 0.3,
  D: 1,
  E: 3,
  F: 10, // High energy (spraying)
  G: 0, // No emission
  H: 0,
};

// C. Local Control
const SCORE_LOCAL_CONTROL = {
  containment_extraction: 0.01, // 99% reduction
  containment_no_extract: 0.1,
  local_extraction: 0.2, // 80%
  suppression: 0.5,
  none: 1,
};

// D. General Ventilation (Dispersion)
// This usually combines Room Volume + ACH + Near/Far field.
// Simplified logic:
const SCORE_VENTILATION = {
  none: 10, // Very poor
  natural: 3,
  mechanical: 1,
  booth: 0.3,
};

const SCORE_ROOM = {
  lt_100: 10, // Small room, higher concentration
  "100_1000": 3,
  gt_1000: 1,
  outdoor: 0.1,
};

// E. Duration & Frequency (Time)
const SCORE_DURATION = {
  min_15: 0.06,
  min_30: 0.12,
  hour_2: 0.25,
  hour_4: 0.5,
  hour_8: 1,
};

const SCORE_FREQUENCY = {
  year_1: 0.1,
  month_1: 0.2,
  week_bi: 0.4,
  week_1: 0.6,
  week_2_3: 0.8,
  week_4_5: 1,
  day_1: 1,
};

export function calculateStoffenmanager(
  input: StoffenmanagerInput,
): StoffenmanagerResult {
  // 1. Calculate Score A
  let scoreA = 0;
  if (input.physicalState === "liquid") {
    scoreA = SCORE_VAPOUR(input.vapourPressure || 0);
  } else {
    scoreA = SCORE_DUSTINESS[input.dustiness || "solid_objects"] || 0;
  }

  // Dilution adjustment (Approximation)
  if (input.isDiluted && input.dilutionPercent) {
    if (input.dilutionPercent < 1) scoreA *= 0.1;
    else if (input.dilutionPercent < 10) scoreA *= 0.3;
  }

  // 2. Score B
  const scoreB = SCORE_HANDLING[input.handlingType] || 1;

  // 3. Score C
  const scoreC = SCORE_LOCAL_CONTROL[input.localControl] || 1;

  // 4. Score D (General Ventilation + Room)
  // Simplified multiplication
  const vent = SCORE_VENTILATION[input.ventilationType] || 1;
  const room = SCORE_ROOM[input.roomVolume] || 1;
  const scoreD = vent * room; // Technically simpler in model but this works for valid bands

  // 5. Score E (Time)
  const dur = SCORE_DURATION[input.exposureDuration] || 1;
  const freq = SCORE_FREQUENCY[input.exposureFrequency] || 1;
  const scoreE = dur * freq;

  // TOTAL EXPOSURE SCORE
  // Baseline * A * B * C * D * E
  // Baseline is arbitrary without calibration, using 1000 as scale factor for risk bands
  const totalScore = 1000 * scoreA * scoreB * scoreC * scoreD * scoreE;

  // Determine Bands (Priorities)
  let priority: "I" | "II" | "III" = "III";
  if (totalScore > 100) priority = "I";
  else if (totalScore > 10) priority = "II";

  // Mapping to 1-4 Band
  let band: 1 | 2 | 3 | 4 = 1;
  if (totalScore < 0.1) band = 1;
  else if (totalScore < 10) band = 2;
  else if (totalScore < 100) band = 3;
  else band = 4;

  return {
    hazardBand: "C", // Placeholder, requires H-phrase lookup
    exposureScore: Math.round(totalScore * 100) / 100,
    exposureBand: band,
    riskPriority: priority,
  };
}
