import type { ClosedSystemAnalysis, SystemCostEstimate } from "../types";

// Base Prices 2026 (Approved by Engineering)
const PRICES = {
  LOADING_POINT: 15000,
  PROCESS_BASE: 10000,
  PROCESS_VOL_FACTOR: 2000,
  EMPTYING_LINE: 20000,
};

export const STANDARD_REASONS = {
  loading: [
    "Granulometría incompatible",
    "Riesgo ATEX por fricción",
    "Espacio insuficiente para tolva",
    "Maquinaria obsoleta (indivisible)",
  ],
  process: [
    "Necesidad de toma de muestras manual",
    "Control visual directo requerido",
    "Venteo manual de seguridad",
    "Equipo no estanqueizable",
  ],
  emptying: [
    "Viscosidad del producto",
    "Formato de envase manual",
    "Pesaje de precisión abierto",
    "Ausencia de válvulas estancas",
  ],
  maintenance: [
    "Sistema sin CIP",
    "Desmontaje crítico frecuente",
    "Inspección legal interior",
    "Incrustaciones severas",
  ],
};

export const calculateSystemCost = (
  analysis: ClosedSystemAnalysis,
  materialFactor: 1.0 | 1.4 = 1.0,
): SystemCostEstimate => {
  let loadingCost = 0;
  let processCost = 0;
  let emptyingCost = 0;

  // Phase A: Loading
  if (analysis.phases.loading.isViable && analysis.phases.loading.costInputs) {
    const units = analysis.phases.loading.costInputs.units || 0;
    loadingCost = units * PRICES.LOADING_POINT * materialFactor;
  }

  // Phase B: Process
  if (analysis.phases.process.isViable && analysis.phases.process.costInputs) {
    const vol = analysis.phases.process.costInputs.volume || 0;
    processCost =
      (PRICES.PROCESS_BASE + vol * PRICES.PROCESS_VOL_FACTOR) * materialFactor;
  }

  // Phase C: Emptying
  if (
    analysis.phases.emptying.isViable &&
    analysis.phases.emptying.costInputs
  ) {
    const lines = analysis.phases.emptying.costInputs.units || 0;
    emptyingCost = lines * PRICES.EMPTYING_LINE * materialFactor;
  }

  return {
    totalCost: loadingCost + processCost + emptyingCost,
    currency: "EUR",
    materialFactor,
    breakdown: {
      loadingCost,
      processCost,
      emptyingCost,
    },
  };
};

export const generateJustificationText = (
  analysis: ClosedSystemAnalysis,
): string => {
  if (analysis.isClosedSystem)
    return "El sistema ya opera como circuito cerrado (Art 5.2).";

  const parts = [
    "MEMORIA TÉCNICA DE EXENCIÓN (ART 5.2 RD 665/1997)",
    "Se justifica la imposibilidad técnica de implementar un sistema cerrado estanco debido a los siguientes condicionantes operativos:",
  ];

  Object.values(analysis.phases).forEach((phase) => {
    if (!phase.isViable && phase.reasons && phase.reasons.length > 0) {
      parts.push(`\n- FASE ${phase.id} (${phase.name}):`);
      phase.reasons.forEach((r) => parts.push(`  * ${r}`));
      if (phase.comments) parts.push(`  * Obs: ${phase.comments}`);
    }
  });

  parts.push(
    "\nCONCLUSIÓN: Se procederá a aplicar medidas de extracción localizada y EPIs (Art 5.3) dado que el confinamiento total no es técnicamente viable.",
  );

  return parts.join("\n");
};

export const generateInvestmentText = (
  analysis: ClosedSystemAnalysis,
  cost: SystemCostEstimate,
): string => {
  const parts = [
    "PROPUESTA DE INVERSIÓN: ADECUACIÓN A SISTEMA CERRADO",
    `IMPORTE ESTIMADO: ${cost.totalCost.toLocaleString("es-ES", { style: "currency", currency: "EUR" })} (Material: ${cost.materialFactor === 1.4 ? "Acero INOX" : "Estándar"})`,
    "\nDESGLOSE DE ACTUACIONES:",
  ];

  if (analysis.phases.loading.isViable) {
    const units = analysis.phases.loading.costInputs?.units || 0;
    const itemCost = cost.breakdown.loadingCost.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
    });
    parts.push(
      `- FASE A (Carga): Instalación de ${units} punto(s) de carga confinada (Flujo Laminar / Vacío). Coste: ${itemCost}.`,
    );
  }

  if (analysis.phases.process.isViable) {
    const vol = analysis.phases.process.costInputs?.volume || 0;
    const itemCost = cost.breakdown.processCost.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
    });
    parts.push(
      `- FASE B (Proceso): Estanqueización de reactor/equipo de ${vol} m3. Coste: ${itemCost}.`,
    );
  }

  if (analysis.phases.emptying.isViable) {
    const lines = analysis.phases.emptying.costInputs?.units || 0;
    const itemCost = cost.breakdown.emptyingCost.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
    });
    parts.push(
      `- FASE C (Vaciado/Envasado): Automatización de ${lines} línea(s) de salida estanca. Coste: ${itemCost}.`,
    );
  }

  return parts.join("\n");
};
