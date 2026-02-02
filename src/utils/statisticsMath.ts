/**
 * Statistical Math Helpers for UNE-EN 689 Visualization
 * Implements Probability Density Functions, Cumulative Distribution, and Probit transformations.
 */

// Error function approximation (Abramowitz and Stegun)
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

// Inverse Error Function approximation (for Probit)
export function erfinv(x: number): number {
  const a = 0.147; // Approximation constant
  const sign = x < 0 ? -1 : 1;
  const lnTerm = Math.log(1 - x * x);
  const term1 = 2 / (Math.PI * a) + lnTerm / 2;
  const term2 = lnTerm / a;

  return sign * Math.sqrt(Math.sqrt(term1 * term1 - term2) - term1);
}

// Standard Normal CDF (Phi)
export function normCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

// Inverse Standard Normal CDF (Probit Function)
// Returns Z-score for a given probability p [0, 1]
export function normInv(p: number): number {
  if (p <= 0) return -5; // Clamp for plotting
  if (p >= 1) return 5;
  return Math.sqrt(2) * erfinv(2 * p - 1);
}

// Log-Normal PDF
// mu = ln(GM), sigma = ln(GSD)
export function logNormPDF(x: number, mu: number, sigma: number): number {
  if (x <= 0 || sigma <= 0) return 0;
  const coeff = 1 / (x * sigma * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma);
  return coeff * Math.exp(exponent);
}

// Probabilities for Probability Plot (Rank positions)
// Using (i - 0.5) / n (Hazen position) or similar
export function getPlottingPositions(n: number): number[] {
  const banks = [];
  for (let i = 1; i <= n; i++) {
    // Blom's Formula: (i - 0.375) / (n + 0.25) is common, or simplified (i - 0.5)/n
    // UNE-EN 689 mentions plotting against probability.
    // We'll use (i - 0.5) / n for plotting position
    banks.push((i - 0.5) / n);
  }
  return banks;
}
