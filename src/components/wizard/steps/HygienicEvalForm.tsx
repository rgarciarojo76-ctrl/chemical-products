/* eslint-disable */
import React, { useState, useEffect } from "react";
import { StepCard } from "../../ui/StepCard";
import type {
  HygienicEvalInput,
  HygienicAssessment,
  HazardInput,
  StoffenmanagerInput,
  StoffenmanagerResult,
} from "../../../types";

interface HygienicEvalFormProps {
  onAnalyze: (input: HygienicEvalInput) => HygienicAssessment;
  onNext: () => void;
  onBack?: () => void;
  initialData?: HygienicEvalInput;
  vlaReference?: number;
  substanceName?: string;
  hazardData?: HazardInput;
}

export const HygienicEvalForm: React.FC<HygienicEvalFormProps> = ({
  onAnalyze,
  onNext,
  onBack,
  initialData,
  vlaReference,
  substanceName,
  hazardData,
}) => {
  const [formData, setFormData] = useState<HygienicEvalInput>(
    initialData || {
      vla: vlaReference ? vlaReference : undefined,
    },
  );

  const [result, setResult] = useState<HygienicAssessment | null>(null);

  // 0: Info (Points 1 & 2)
  // 1: Stoffenmanager (Point 3)
  // 2: Strategy (Points 4 & 5 - previously 3 & 4)
  // 3: Results (Point 6 - previously 5)
  const [internalStep, setInternalStep] = useState(0);

  // Auto-fill Stoffenmanager defaults
  useEffect(() => {
    if (!formData.stoffenmanager && hazardData) {
      const isLiquid =
        hazardData.detectedPhysicalForm?.includes("liquid") || false;

      const autoStoffenmanager: StoffenmanagerInput = {
        productName: hazardData.substanceName || "",
        manufacturer: "",
        casNumber: hazardData.casNumber || "",
        hasFDS: true,
        physicalState: isLiquid ? "liquid" : "solid",
        hPhrases: hazardData.hPhrases,
        isDiluted: hazardData.isMixture,
        dilutionPercent: hazardData.concentration,

        // Defaults
        handlingType: "A",
        localControl: "none",
        roomVolume: "100_1000",
        ventilationType: "natural",
        dailyCleaning: false,
        equipmentMaintenance: false,
        workerSegregation: "none",
        ppeUsed: false,
        exposureDuration: "min_30",
        exposureFrequency: "year_1",
      };
      setFormData((prev) => ({ ...prev, stoffenmanager: autoStoffenmanager }));
    }
  }, [hazardData, formData.stoffenmanager]);

  const updateStoffenmanager = (
    field: keyof StoffenmanagerInput,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      stoffenmanager: {
        ...prev.stoffenmanager!,
        [field]: value,
      },
    }));
  };

  const calculateStoffenmanager = (
    input: StoffenmanagerInput,
  ): StoffenmanagerResult => {
    // 1. Hazard Band
    let hazardBand: "A" | "B" | "C" | "D" | "E" = "A";
    const h = input.hPhrases || [];
    if (
      h.some((p) =>
        ["H340", "H350", "H350i", "H360", "H360FD", "H310", "H330"].includes(p),
      )
    )
      hazardBand = "E";
    else if (
      h.some((p) =>
        ["H351", "H341", "H361", "H331", "H311", "H301", "H372"].includes(p),
      )
    )
      hazardBand = "D";
    else if (
      h.some((p) => ["H332", "H312", "H302", "H314", "H373"].includes(p))
    )
      hazardBand = "C";
    else if (h.some((p) => ["H315", "H319", "H335", "H317"].includes(p)))
      hazardBand = "B";

    // 2. Emission
    let E = 0;
    if (input.physicalState === "liquid") {
      const vp = input.vapourPressure || 2300;
      const Pi = Math.min(Math.max(vp, 10), 30000);
      E = Pi / 30000;
    } else {
      const dustMap: Record<string, number> = {
        solid_objects: 0,
        granules_firm: 0.01,
        granules_friable: 0.03,
        dust_coarse: 0.1,
        dust_fine: 0.3,
        dust_extreme: 1.0,
      };
      E = dustMap[input.dustiness || "solid_objects"] || 0;
    }

    // 3. Handling
    let H_factor = 0.1;
    if (input.physicalState === "liquid") {
      const liquidH: Record<string, number> = {
        A: 0,
        B: 0.03,
        C: 0.1,
        D: 0.3,
        E: 1,
        F: 3,
        G: 3,
        H: 10,
      };
      H_factor = liquidH[input.handlingType] || 0.1;
    } else {
      const solidH: Record<string, number> = { A: 0.01, B: 0.1, C: 1 };
      H_factor = solidH[input.handlingType] || 0.01;
    }

    // 4. Measures
    const lcMap: Record<string, number> = {
      none: 1,
      containment: 0.01,
      local_exhaust: 0.1,
      glove_box: 0.001,
    };
    const LC = lcMap[input.localControl] || 1;

    const gvMap: Record<string, number> = {
      none: 1,
      natural: 0.5,
      mechanical_general: 0.3,
    };
    const GV = gvMap[input.ventilationType] || 1;

    // 5. Exposure Score Calculation (Simplified)
    // Score = E * H * LC * GV * Duration * Frequency (Using abstract multipliers for now)
    const durationMap: Record<string, number> = {
      min_15: 0.1,
      min_30: 0.25,
      hour_1: 0.5,
      hour_4: 1.0,
      hour_8: 2.0,
    };
    const frequencyMap: Record<string, number> = {
      year_1: 0.1,
      month_1: 0.3,
      week_1: 0.6,
      day_1: 1.0,
    };

    // Bt (exposure score)
    const Bt = Math.round(
      E *
        H_factor *
        LC *
        GV *
        (durationMap[input.exposureDuration] || 1) *
        (frequencyMap[input.exposureFrequency] || 1) *
        1000,
    );

    // Exposure Band
    let exposureBand: 1 | 2 | 3 | 4 = 1;
    if (Bt > 100) exposureBand = 4;
    else if (Bt > 10) exposureBand = 3;
    else if (Bt > 1) exposureBand = 2;

    // Risk Priority
    let riskPriority: "I" | "II" | "III" = "III";
    if (hazardBand === "E" && exposureBand >= 3) riskPriority = "I";
    else if (hazardBand === "D" && exposureBand >= 3) riskPriority = "I";
    else if (exposureBand === 4) riskPriority = "I";
    else if (hazardBand === "A" && exposureBand <= 2) riskPriority = "III";
    else riskPriority = "II";

    return { hazardBand, exposureScore: Bt, exposureBand, riskPriority };
  };

  const handleAnalyze = () => {
    const assessment = onAnalyze(formData);
    setResult(assessment);
  };

  const handleInternalNext = () => setInternalStep((prev) => prev + 1);
  const handleInternalBack = () => setInternalStep((prev) => prev - 1);

  const isStep0 = internalStep === 0;
  const isStep1 = internalStep === 1;
  const isStep2 = internalStep === 2;
  const isStep3 = internalStep === 3;

  return (
    <StepCard
      title="Módulo C: Evaluación Higiénica Cuantitativa"
      description={`Definición de estrategia y conformidad para: ${substanceName || "Agente"}`}
      icon="🧠"
    >
      {/* Progress Indicator */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem" }}>
        {[0, 1, 2, 3].map((step) => (
          <div
            key={step}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              backgroundColor:
                step <= internalStep ? "var(--color-primary)" : "#e2e8f0",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>

      {/* STEP 0: ORIGINAL INFORMATIONAL POINTS 1 & 2 */}
      {isStep0 && (
        <>
          {/* 1. Caracterización Básica */}
          <div className="form-group mb-4">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
                borderBottom: "2px solid #0056b3",
                paddingBottom: "0.25rem",
              }}
            >
              <h4 style={{ fontSize: "1rem", margin: 0, color: "#0056b3" }}>
                1. Caracterización Básica
              </h4>
              <a
                href="https://files.infocentre.io/files/docs_clients/3646_2008110792_2318118_UNE-EN%20689_2019.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.8rem",
                  color: "#009bdb",
                  textDecoration: "none",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                📚 Norma UNE 689
              </a>
            </div>

            <div
              style={{
                backgroundColor: "#eef6fc",
                padding: "1rem",
                borderRadius: "6px",
                marginBottom: "1rem",
                borderLeft: "4px solid #009bdb",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#0056b3",
                }}
              >
                ℹ️ Criterios técnicos básicos (Factores de Exposición):
              </strong>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {[
                  {
                    label: "Organización",
                    text: "Tareas, jornada, funciones y carga.",
                    icon: "📋",
                  },
                  {
                    label: "Proceso",
                    text: "Técnicas, fuentes de emisión y producción.",
                    icon: "🏭",
                  },
                  {
                    label: "Entorno",
                    text: "Distribución, orden y limpieza.",
                    icon: "🧹",
                  },
                  {
                    label: "Medidas",
                    text: "Ventilación, procedimientos y zonas.",
                    icon: "🛡️",
                  },
                  {
                    label: "Temporalidad",
                    text: "Duración, frecuencia y variaciones.",
                    icon: "⏱️",
                  },
                  {
                    label: "Personal",
                    text: "Comportamiento y hábitos de trabajo.",
                    icon: "👷",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem 1rem",
                      backgroundColor: "#ffffff",
                      borderRadius: "6px",
                      border: "1px solid #dae1e7",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#1e3a8a",
                          fontSize: "0.9rem",
                          minWidth: "100px",
                        }}
                      >
                        {item.label}:
                      </span>
                      <span style={{ color: "#475569", fontSize: "0.9rem" }}>
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Similar Exposure Groups (GES) */}
          <div className="form-group mb-4">
            <h4
              style={{
                fontSize: "1rem",
                marginBottom: "0.5rem",
                color: "#0056b3",
                borderBottom: "2px solid #0056b3",
                paddingBottom: "0.25rem",
              }}
            >
              2. Grupos de exposición similar
            </h4>
            <div
              style={{
                backgroundColor: "#eef6fc",
                padding: "1rem",
                borderRadius: "6px",
                marginBottom: "1rem",
                borderLeft: "4px solid #009bdb",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#0056b3",
                }}
              >
                ℹ️ Criterios técnicos básicos (GES)
              </strong>
              <p
                style={{
                  fontSize: "0.85rem",
                  margin: 0,
                  color: "#333",
                  lineHeight: "1.4",
                }}
              >
                Grupo de trabajadores que tienen el mismo perfil de exposición
                para el agente químico estudiado, debido a la similitud y
                frecuencia de las tareas realizadas, los procesos y los
                materiales con los que trabajan y a la similitud de la manera
                que realizan las tareas.
              </p>
            </div>
          </div>
        </>
      )}

      {/* STEP 1: NEW STOFFENMANAGER SECTION */}
      {isStep1 && formData.stoffenmanager && (
        <>
          <div className="form-group mb-4">
            <h4
              style={{
                fontSize: "1rem",
                marginBottom: "0.5rem",
                color: "#0056b3",
                borderBottom: "2px solid #0056b3",
                paddingBottom: "0.25rem",
              }}
            >
              3. Caracterización Cualitativa (Stoffenmanager®)
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {/* Identification */}
              <div
                style={{
                  padding: "0.5rem",
                  background: "#f8f9fa",
                  borderRadius: "6px",
                }}
              >
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Estado Físico
                </label>
                <select
                  style={{ width: "100%", padding: "0.4rem" }}
                  value={formData.stoffenmanager.physicalState}
                  onChange={(e) =>
                    updateStoffenmanager("physicalState", e.target.value)
                  }
                >
                  <option value="solid">Sólido / Polvo</option>
                  <option value="liquid">Líquido</option>
                </select>
              </div>
              {/* Handling */}
              <div
                style={{
                  padding: "0.5rem",
                  background: "#f8f9fa",
                  borderRadius: "6px",
                }}
              >
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Tipo de Manipulación
                </label>
                <select
                  style={{ width: "100%", padding: "0.4rem" }}
                  value={formData.stoffenmanager.handlingType}
                  onChange={(e) =>
                    updateStoffenmanager("handlingType", e.target.value)
                  }
                >
                  <option value="A">A: Baja Energía (Pasivo)</option>
                  <option value="B">B: Baja Energía (Manual)</option>
                  <option value="C">C: Media Energía (Transferencia)</option>
                  <option value="E">E: Alta Energía (Dispersión/Spray)</option>
                </select>
              </div>
              {/* Duration */}
              <div
                style={{
                  padding: "0.5rem",
                  background: "#f8f9fa",
                  borderRadius: "6px",
                }}
              >
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Duración Exposición
                </label>
                <select
                  style={{ width: "100%", padding: "0.4rem" }}
                  value={formData.stoffenmanager.exposureDuration || "min_30"}
                  onChange={(e) =>
                    updateStoffenmanager("exposureDuration", e.target.value)
                  }
                >
                  <option value="min_15">&lt; 15 min</option>
                  <option value="min_30">15 - 30 min</option>
                  <option value="hour_1">1 hora</option>
                  <option value="hour_4">4 horas</option>
                  <option value="hour_8">8 horas</option>
                </select>
              </div>
              {/* Frequency */}
              <div
                style={{
                  padding: "0.5rem",
                  background: "#f8f9fa",
                  borderRadius: "6px",
                }}
              >
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Frecuencia
                </label>
                <select
                  style={{ width: "100%", padding: "0.4rem" }}
                  value={formData.stoffenmanager.exposureFrequency || "day_1"}
                  onChange={(e) =>
                    updateStoffenmanager("exposureFrequency", e.target.value)
                  }
                >
                  <option value="year_1">1 vez/año</option>
                  <option value="month_1">1 vez/mes</option>
                  <option value="week_1">1 vez/semana</option>
                  <option value="day_1">Diario</option>
                </select>
              </div>
            </div>

            {/* Ventilation & Controls */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.5rem",
                background: "#f0f7ff",
                borderRadius: "6px",
              }}
            >
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Medidas de Control Local
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "0.4rem",
                  marginBottom: "0.5rem",
                }}
                value={formData.stoffenmanager.localControl}
                onChange={(e) =>
                  updateStoffenmanager("localControl", e.target.value)
                }
              >
                <option value="none">Sin control localizado</option>
                <option value="local_exhaust">
                  Extracción Localizada (LEV)
                </option>
                <option value="containment">Cabina / Cerramiento</option>
                <option value="glove_box">Glove Box / Estanco</option>
              </select>

              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Ventilación General
              </label>
              <select
                style={{ width: "100%", padding: "0.4rem" }}
                value={formData.stoffenmanager.ventilationType}
                onChange={(e) =>
                  updateStoffenmanager("ventilationType", e.target.value)
                }
              >
                <option value="none">Sin ventilación específica</option>
                <option value="natural">Natural (Puertas/Ventanas)</option>
                <option value="mechanical_general">Mecánica General</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* STEP 2: STRATEGY (OLD POINT 3 & 4) */}
      {isStep2 && (
        <>
          {/* 4. Estrategia de Medición */}
          <div className="form-group mb-4">
            <h4
              style={{
                fontSize: "1rem",
                marginBottom: "0.5rem",
                color: "#0056b3",
                borderBottom: "2px solid #0056b3",
                paddingBottom: "0.25rem",
              }}
            >
              4. Estrategia de Medición (UNE-EN 689)
            </h4>
            <div
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                backgroundColor: "#fff8e1",
                borderRadius: "8px",
                border: "1px solid #ffead0",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>📉</span> Perfil de Exposición Temporal
              </div>
              <select
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "1rem",
                }}
                value={formData.strategyType || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    strategyType: e.target.value as any,
                  })
                }
              >
                <option value="">Seleccione...</option>
                <option value="continuous">Continuo</option>
                <option value="peaks">Picos</option>
                <option value="variable">Variable</option>
              </select>
            </div>
          </div>

          {/* Sampling Matrix Display */}
          {/* (Simplified for brevity, assuming existing context) */}
        </>
      )}

      {/* STEP 3: RESULTS (OLD POINT 5) */}
      {isStep3 && (
        <>
          <div className="form-group mb-4">
            <h4
              style={{
                fontSize: "1rem",
                marginBottom: "0.5rem",
                color: "#0056b3",
                borderBottom: "2px solid #0056b3",
                paddingBottom: "0.25rem",
              }}
            >
              5. Resultados de la Medición
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                backgroundColor: "#f9f9f9",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  Concentración (I)
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    value={formData.labResult || ""}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "2px solid var(--color-primary)",
                      borderRadius: "4px",
                    }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        labResult: parseFloat(e.target.value),
                      })
                    }
                  />
                  <span style={{ fontWeight: 600 }}>mg/m³</span>
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  Límite de Cuantificación (LOQ)
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    value={formData.lod || ""}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lod: parseFloat(e.target.value),
                      })
                    }
                  />
                  <span style={{ fontWeight: 600 }}>mg/m³</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ACTIONS */}
      <div
        className="actions"
        style={{
          marginTop: "var(--spacing-lg)",
          borderTop: "1px solid #eee",
          paddingTop: "var(--spacing-md)",
          display: "flex",
          gap: "1rem",
        }}
      >
        <button
          onClick={isStep0 ? onBack : handleInternalBack}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            color: "#666",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          &larr; Anterior
        </button>

        {!isStep3 ? (
          <button
            onClick={() => {
              if (isStep1) {
                // Calculate on transition from Stoffenmanager
                const res = calculateStoffenmanager(formData.stoffenmanager!);
                setFormData((prev) => ({ ...prev, stoffenmanagerResult: res }));
              }
              handleInternalNext();
            }}
            style={{
              flex: 1,
              backgroundColor: "var(--color-primary)",
              color: "white",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {isStep0
              ? "Iniciar Caracterización Stoffenmanager ®"
              : isStep1
                ? "Calcular Riesgo y Continuar"
                : "Siguiente &rarr;"}
          </button>
        ) : (
          <>
            {!result ? (
              <button
                onClick={handleAnalyze}
                style={{
                  flex: 1,
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                6. Verificar Conformidad (Test Preliminar)
              </button>
            ) : (
              <div
                className={`result-box`}
                style={{
                  flex: 1,
                  padding: "1rem",
                  backgroundColor: result.isSafe ? "#d4edda" : "#f8d7da",
                  border: `1px solid ${result.isSafe ? "#c3e6cb" : "#f5c6cb"}`,
                  borderRadius: "6px",
                }}
              >
                <h4
                  style={{
                    color: result.isSafe ? "#155724" : "#721c24",
                    marginTop: 0,
                  }}
                >
                  {result.isSafe
                    ? "CONFORME (Aceptable)"
                    : "NO CONFORME (Inaceptable)"}
                </h4>
                <button
                  onClick={onNext}
                  style={{
                    marginTop: "1rem",
                    backgroundColor: result.isSafe
                      ? "var(--color-safe)"
                      : "var(--color-danger)",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    float: "right",
                  }}
                >
                  {result.isSafe
                    ? "Finalizar Evaluación"
                    : "Ir a Plan de Medidas"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </StepCard>
  );
};
