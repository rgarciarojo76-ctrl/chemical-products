/**
 * UNE-EN 482:2021 LOGIC
 * Calculates the minimum sampling volume required to validate a method
 * at 0.1 * VLA (for ED) or 0.5 * VLA (for EC).
 */

export interface VolumeValidationResult {
  cMin: number; // Concentration to validate (mg/m³)
  vMinLiters: number; // Minimum Volume in Liters
  tMinMinutes: number; // TOTAL Minimum Time (Max of Analytical vs Strategy)
  tMinAnalytical?: number; // Time for UNE-EN 482 (LOQ)
  tMinStrategy?: number; // Time for UNE-EN 689 (Representativeness)
  isValid: boolean; // plannedTime >= tMinMinutes
  message?: string;
}

/**
 * Calculates minimum sampling requirements.
 *
 * @param vla Value Limit (mg/m³)
 * @param flowRate Flow Rate (L/min)
 * @param loq Limit of Quantitation (µg) - from Lab
 * @param exposureType "ED" (Daily) or "EC" (Short Term)
 * @param plannedTime Minutes the user INTENDS to sample
 */
export function validateMinimumVolume(
  vla: number,
  flowRate: number,
  loq: number,
  exposureType: "continuous" | "variable" | "peaks", // Mapped from form
  plannedTime: number,
): VolumeValidationResult {
  // 1. Determine C_min (Concentration to validate)
  // UNE-EN 482: For ED (Continuous/Variable), range must cover 0.1 * VLA.
  // For STEL/EC (Peaks), range must cover 0.5 * VLA.

  // Default to ED logic
  let factor = 0.1;
  if (exposureType === "peaks") {
    factor = 0.5;
  }

  const cMin = vla * factor; // mg/m³

  // 2. Calculate V_min (Liters)
  // Formula: V_min = LOQ (µg) / C_min (mg/m³)
  // Dimensional analysis: µg / (mg/m³) = µg / (µg/L) = L
  // (Since 1 mg/m³ = 1 µg/L)

  // Safety check for zero
  if (cMin <= 0) {
    return {
      cMin: 0,
      vMinLiters: 0,
      tMinMinutes: 0,
      isValid: false,
      message: "VLA inválido",
    };
  }

  const vMinLiters = loq / cMin;

  // 3. Calculate t_min (Minutes)
  // t = V / Q
  if (flowRate <= 0) {
    return {
      cMin,
      vMinLiters,
      tMinMinutes: 0,
      isValid: false,
      message: "Caudal inválido",
    };
  }

  const tMinAnalytical = Math.ceil(vMinLiters / flowRate);

  // 4. UNE-EN 689 Constraint (Representativeness)
  // For VLA-ED (Daily), minimum recommended is 2 hours (120 min) to cover variability.
  let tMinStrategy = 0;
  if (exposureType === "continuous" || exposureType === "variable") {
    tMinStrategy = 120;
  }

  // Final Minimum Time is the MAX of Analytical and Strategic requirements
  const tMinTotal = Math.max(tMinAnalytical, tMinStrategy);

  // 5. Validate
  const isValid = plannedTime >= tMinTotal;

  return {
    cMin,
    vMinLiters,
    tMinMinutes: tMinTotal, // Used for validation
    tMinAnalytical, // Exposed for transparency
    tMinStrategy, // Exposed for explanation
    isValid,
  };
}
