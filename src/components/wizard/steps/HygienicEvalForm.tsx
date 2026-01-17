import React, { useState } from "react";
import { StepCard } from "../../ui/StepCard";
import type { HygienicEvalInput, HygienicAssessment } from "../../../types";

interface HygienicEvalFormProps {
  onAnalyze: (input: HygienicEvalInput) => HygienicAssessment;
  onNext: () => void;
  onBack?: () => void;
  initialData?: HygienicEvalInput;
  vlaReference?: number; // Passed from prev state
  substanceName?: string;
}

export const HygienicEvalForm: React.FC<HygienicEvalFormProps> = ({
  onAnalyze,
  onNext,
  onBack,
  initialData,
  vlaReference,
  substanceName,
}) => {
  const [formData, setFormData] = useState<HygienicEvalInput>(
    initialData || {
      vla: vlaReference ? vlaReference : undefined,
    },
  );
  const [result, setResult] = useState<HygienicAssessment | null>(null);
  const [internalStep, setInternalStep] = useState(0); // 0: Basic, 1: Strategy, 2: Results

  const handleAnalyze = () => {
    const assessment = onAnalyze(formData);
    setResult(assessment);
  };

  const handleInternalNext = () => setInternalStep((prev) => prev + 1);
  const handleInternalBack = () => setInternalStep((prev) => prev - 1);

  const isStep0 = internalStep === 0;
  const isStep1 = internalStep === 1;
  const isStep2 = internalStep === 2;

  return (
    <StepCard
      title="Módulo C: Evaluación Higiénica Cuantitativa"
      description={`Definición de estrategia y conformidad para: ${substanceName || "Agente"}`}
      icon="🧠"
    >
      {/* Progress Indicator for Sub-steps */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem" }}>
        {[0, 1, 2].map((step) => (
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

      {/* STEP 0: SECTION 1 & 2 */}
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

            {/* Educational Guide for Junior Techs */}
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
                      alignItems: "center", // Align vertically
                      gap: "1rem",
                      padding: "0.75rem 1rem",
                      backgroundColor: "#ffffff", // White bg for contrast against blue container
                      borderRadius: "6px",
                      border: "1px solid #dae1e7", // Subtle border
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

      {/* STEP 1: SECTION 3 & 4 */}
      {isStep1 && (
        <>
          {/* 3. Strategy & Sampling (Planning) */}
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
              3. Estrategia de Medición (UNE-EN 689)
            </h4>

            {/* Exposure Profile */}
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
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                value={formData.strategyType || ""}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    strategyType: e.target.value as any,
                  })
                }
              >
                <option value="">Seleccione tipo de proceso...</option>
                <option value="continuous">
                  Continuo y Homogéneo (Estable)
                </option>
                <option value="peaks">
                  Variable con Picos (Tareas puntuales)
                </option>
                <option value="variable">Cíclico / Muy Variable</option>
              </select>

              {formData.strategyType && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#666",
                  }}
                >
                  {formData.strategyType === "continuous" &&
                    "ℹ️ Estrategia Recomendada: Muestreo de Larga Duración (VLA-ED, >80% jornada) en Grupo de Exposición Homogéneo (GEH)."}
                  {formData.strategyType === "peaks" &&
                    "ℹ️ Estrategia Recomendada: Muestreo VLA-ED basal + Mediciones de 15 min (VLA-EC) durante picos."}
                  {formData.strategyType === "variable" &&
                    "ℹ️ Estrategia Recomendada: Muestreo aleatorio estratificado (Mínimo 3 mediciones representativas de cada fase)."}
                </div>
              )}
            </div>

            {/* Sampling Matrix - Redesigned */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e0e6ed",
                overflow: "hidden",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#e0f2fe",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>📋</span>
                  </div>
                  <div>
                    <h5
                      style={{
                        margin: 0,
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      Método de Captación y Análisis
                    </h5>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      Protocolo oficial de higiene industrial
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {formData.samplingDetails?.methodUrl && (
                    <a
                      href={formData.samplingDetails.methodUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: "#0f172a",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span>📄</span> Ver Método INSST
                    </a>
                  )}
                  {formData.samplingDetails?.videoUrl && (
                    <a
                      href={formData.samplingDetails.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: "#ea580c", // Vibrant Orange
                        color: "white",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow: "0 2px 4px rgba(234, 88, 12, 0.25)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span>🎥</span> Video Guía
                    </a>
                  )}
                </div>
              </div>

              {/* Card Content - Metrics Grid */}
              <div className="sampling-grid">
                {/* Metric 1 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#64748b",
                      fontWeight: 700,
                    }}
                  >
                    Soporte de Muestreo
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      backgroundColor: "#f1f5f9",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>🧪</span>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#334155",
                        lineHeight: "1.3",
                      }}
                    >
                      {formData.samplingDetails?.support || "Consultar Método"}
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#64748b",
                      fontWeight: 700,
                    }}
                  >
                    Técnica Analítica
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      backgroundColor: "#f1f5f9",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>🔬</span>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#334155",
                        lineHeight: "1.3",
                      }}
                    >
                      {formData.samplingDetails?.technique ||
                        "Consultar Método"}
                    </span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#64748b",
                      fontWeight: 700,
                    }}
                  >
                    Caudal de Bomba
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      backgroundColor: "#f1f5f9",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>💨</span>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#334155",
                        lineHeight: "1.3",
                      }}
                    >
                      {formData.samplingDetails?.flowRate || "---"}
                    </span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#64748b",
                      fontWeight: 700,
                    }}
                  >
                    Tiempo Mín. Muestreo
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      backgroundColor: "#f1f5f9",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>⏱️</span>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#334155",
                        lineHeight: "1.3",
                      }}
                    >
                      {formData.samplingDetails?.minTime || "---"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. VLA Section */}
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
                4. Valor Límite Ambiental
              </h4>
              <a
                href="https://www.insst.es/documentacion/material-normativo/limites-de-exposicion-profesional-para-agentes-quimicos-2025"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  fontStyle: "italic",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                }}
              >
                📖 Ref: Límites de Exposición Profesional (INSST)
              </a>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                backgroundColor: "#f8f9fa",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#555",
                  }}
                >
                  Agente Químico
                </label>
                <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                  {substanceName || "No identificado"}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#555",
                  }}
                >
                  VLA-ED (Valor Límite Ambiental)
                </label>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: formData.vla ? "#333" : "#999",
                  }}
                >
                  {formData.vla ? `${formData.vla} mg/m³` : "---"}
                </div>
                {!formData.vla && (
                  <small style={{ color: "orange" }}>
                    No disponible en B.D.
                  </small>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* STEP 2: SECTION 5 & ACTIONS */}
      {isStep2 && (
        <>
          {/* 5. Results (Renumbered) */}
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
                5. Resultados de la Medición
              </h4>
              <a
                href="https://www.insst.es/documentacion/herramientas-de-prl/calculadores/agentes-quimicos-evaluacion-de-la-exposicion-2020"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.8rem",
                  color: "#666",
                  fontStyle: "italic",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                }}
              >
                🧮 Calculador INSST (UNE-EN 689:2019)
              </a>
            </div>

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

      {/* Actions & Navigation */}
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

        {!isStep2 ? (
          <button
            onClick={handleInternalNext}
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
            Siguiente &rarr;
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

                {result.complianceRatio && (
                  <div style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
                    Índice de Exposición (I/VLA):{" "}
                    {result.complianceRatio.toFixed(2)} (
                    {result.complianceRatio * 100}%)
                  </div>
                )}

                <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
                  {result.justification.technical}
                </p>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    borderLeft: `2px solid ${result.isSafe ? "green" : "red"}`,
                    paddingLeft: "0.5rem",
                  }}
                >
                  <strong>Base Legal:</strong>{" "}
                  {result.justification.legal.article} -{" "}
                  {result.justification.legal.text}
                </div>

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
                <div style={{ clear: "both" }}></div>
              </div>
            )}
          </>
        )}
      </div>
    </StepCard>
  );
};
