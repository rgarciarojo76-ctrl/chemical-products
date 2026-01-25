import type { AssessmentState } from "../types";
import { getLEPData, type LEPData } from "../data/lep_database";

export interface ReportData {
  meta: {
    date: string;
    version: string;
    company: string;
  };
  agent: {
    name: string;
    cas: string;
    vla_ed: string;
    vla_ec: string;
    density?: string; // e.g., "1.2 g/cm3"
    boiling_point?: string; // e.g., "80 ºC"
    cmr_alerts: string[];
    notes_alerts: string[]; // Skin, Sens, etc.
  };
  exposure: {
    description: string; // The smart narrative
    ppe_summary?: string;
  };
  conclusion: {
    type: "A" | "B"; // A = Safe, B = Measure
    text: string;
    legal_obligations: string[];
  };
}

export const generateReportData = (state: AssessmentState): ReportData => {
  const hazard = state.hazard.input;
  const basic = state.hygienicEval.input.basicCharacterization;

  // 1. Data Integration (DB Lookup)
  const lepData: LEPData | undefined = hazard.casNumber
    ? getLEPData(hazard.casNumber)
    : undefined;

  // Alerts Logic
  const notesAlerts: string[] = [];
  if (lepData?.notes.includes("piel")) {
    notesAlerts.push(
      "¡ATENCIÓN! Agente con notación 'Piel'. Existe riesgo de absorción cutánea significativa (VLB requerido).",
    );
  }
  if (lepData?.notes.includes("sen")) {
    notesAlerts.push(
      "Agente Sensibilizante. Riesgo de reacción inmunológica incluso a concentraciones muy bajas.",
    );
  }

  const cmrAlerts: string[] = [];
  if (
    lepData?.notes.some((n) => ["C1A", "C1B"].includes(n)) ||
    hazard.hPhrases.some((h) => ["H350", "H350i"].includes(h))
  ) {
    cmrAlerts.push("CANCERÍGENO (C1A/1B)");
  }
  if (lepData?.notes.some((n) => ["M1A", "M1B"].includes(n))) {
    cmrAlerts.push("MUTÁGENO (M1A/1B)");
  }
  if (lepData?.notes.some((n) => ["R1A", "R1B"].includes(n))) {
    cmrAlerts.push("TÓXICO REPRODUCCIÓN (R1A/1B)");
  }

  // --- Physical Data Formatting ---
  const densityText = hazard.density
    ? `${hazard.density} g/cm³`
    : "No disponible";
  const bpText = hazard.boilingPoint
    ? `${hazard.boilingPoint} ºC`
    : "No disponible";

  // 2. Narrative Engine
  // Default values to prevent crashes if Basic Characterization is missing (e.g. Stoffenmanager path)
  const taskName = basic?.processDescription || "Tarea genérica";
  const statePhys = hazard.detectedPhysicalForm || "estado desconocido";
  const volatility = hazard.vapourPressure
    ? `${hazard.vapourPressure} Pa`
    : "volatilidad no determinada";
  const procType = basic?.isOpenProcess ? "Sistema Abierto" : "Sistema Cerrado";
  // Determine quantity qualitatively (mock logic based on context or add field later)
  const quantity = "cantidades operativas estándar";
  const frequency = basic?.frequency || "frecuencia no definida";
  const duration = basic?.duration // Map enum to text
    ? {
        lt_15m: "< 15 min",
        "15m_2h": "15 min - 2 horas",
        "2h_4h": "2 - 4 horas",
        gt_4h: "> 4 horas",
      }[basic.duration]
    : "duración no definida";

  const narrative = `La tarea evaluada, "${taskName}", implica la manipulación del agente en estado ${statePhys} con una ${
    hazard.vapourPressure
      ? `presión de vapor de ${volatility}`
      : "volatilidad estimada"
  } (P.Ebullición: ${bpText}). El proceso se desarrolla en un régimen de ${procType}, manipulándose ${quantity}. La frecuencia de exposición es ${frequency} con una duración por ciclo de ${duration}.`;

  const ppeSummary = basic
    ? [
        basic.respiratoryPPE
          ? `Protección Respiratoria: ${basic.respiratoryPPE}`
          : null,
        basic.dermalPPE ? `Protección Dérmica: ${basic.dermalPPE}` : null,
      ]
        .filter(Boolean)
        .join(" + ")
    : "Sin EPIs definidos";

  // 3. Hygienic Strategy Logic (UNE-EN 689)
  // Scenario A: Closed System AND Low Quantity (Mock quantity check) OR Explicit "Safe" conclusion from Wizard
  const isScenarioA =
    basic?.technicalMeasure === "closed_system" ||
    state.hygienicEval.result?.isSafe;

  let conclusionText = "";
  let conclusionType: "A" | "B" = "B";

  if (isScenarioA) {
    conclusionType = "A";
    conclusionText =
      "Basado en la caracterización básica, se estima que la exposición es manifiestamente baja. No se requiere medición higiénica inmediata, siempre que se mantenga la estanqueidad del sistema. Se recomienda reevaluación periódica cualitativa.";
  } else {
    conclusionType = "B";
    const vlaRef = lepData?.vla_ed
      ? `${lepData.vla_ed} mg/m³`
      : "el VLA aplicable";
    conclusionText = `La caracterización básica no permite descartar el riesgo higiénico por inhalación. ES OBLIGATORIO REALIZAR MEDICIONES. Se debe diseñar una Estrategia de Muestreo representativa (mínimo 3 mediciones según UNE-EN 689) para verificar la conformidad con el VLA-ED de ${vlaRef}.`;
  }

  // 4. Legal Obligations (RD 665)
  const legalObligations: string[] = [];
  if (cmrAlerts.length > 0) {
    legalObligations.push(
      "Se recuerda la obligación de conservar los historiales médicos y listas de trabajadores expuestos durante 40 años (Art. 9 RD 665/1997).",
    );
  }
  // Always visible if there is potential exposure
  legalObligations.push(
    "El trabajador dispone de 10 minutos para aseo personal antes de la comida y otros 10 minutos antes de abandonar el trabajo, dentro de la jornada laboral (Art. 6 RD 665/1997).",
  );
  legalObligations.push(
    "Queda prohibido llevarse la ropa de trabajo al domicilio para su lavado (Art. 6 RD 665/1997).",
  );

  return {
    meta: {
      date: new Date().toLocaleDateString("es-ES"),
      version: "1.0",
      company: "Dirección Técnica IA LAB",
    },
    agent: {
      name: lepData?.name || hazard.substanceName || "Agente Desconocido",
      cas: lepData?.cas || hazard.casNumber || "N/A",
      vla_ed: lepData?.vla_ed ? `${lepData.vla_ed}` : "No est.",
      vla_ec: lepData?.vla_ec ? `${lepData.vla_ec}` : "No est.",
      density: densityText,
      boiling_point: bpText,
      cmr_alerts: cmrAlerts,
      notes_alerts: notesAlerts,
    },
    exposure: {
      description: narrative,
      ppe_summary: ppeSummary,
    },
    conclusion: {
      type: conclusionType,
      text: conclusionText,
      legal_obligations: legalObligations,
    },
  };
};
