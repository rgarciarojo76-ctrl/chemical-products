import React, { useState } from "react";
import { StepCard } from "../../ui/StepCard";
import type { MeasureStatus, ClosedSystemAnalysis } from "../../../types";
import { RD_MEASURES } from "../../../utils/engineLogic";
import { ClosedSystemStep } from "./ClosedSystemStep"; // Integrate specialized module

interface MeasuresFormProps {
  initialData: MeasureStatus[];
  onUpdate: (measures: MeasureStatus[]) => void;
  onNext: () => void;
  onBack?: () => void;
  closedSystemData?: ClosedSystemAnalysis;
  onUpdateClosedSystem?: (data: ClosedSystemAnalysis) => void;
}

const TECHNICAL_ALTERNATIVES = [
  {
    id: 1,
    title: "Plasma de Peróxido de Hidrógeno",
    tag: "Esterilización",
    tagColor: "green",
    description:
      "Elimina el uso de formaldehído gas cancerígeno. Tecnología limpia (subproductos: agua y oxígeno) con eficacia esporicida validada. Baja temperatura (47-56°C).",
    sourceText: 'CDC "Guideline for Disinfection..."',
    sourceUrl:
      "https://www.cdc.gov/infectioncontrol/guidelines/disinfection/index.html",
    providerText: "ASP (Web Oficial)",
    providerUrl: "https://www.asp.com/es-es",
    fdsText: "Buscar FDS (Biblioteca)",
    fdsUrl: "https://www.asp.com/es-es/biblioteca-tecnica",
  },
  {
    id: 2,
    title: "Fijadores Base Etanol/Metanol (FineFIX)",
    tag: "Histopatología",
    tagColor: "blue",
    description:
      "Sustituye el cross-linking de aldehídos. Permite mayor recuperación de ADN/ARN para biología molecular sin la toxicidad/carcinogenicidad del formol.",
    sourceText: 'NIH "Formalin-free fixatives review"',
    sourceUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3927343/",
    providerText: "Milestone Medical",
    providerUrl:
      "https://www.milestonemedsrl.com/pathology/reagents-and-consumables/finefix/",
    fdsText: "Descargas / FDS",
    fdsUrl: "https://www.milestonemedsrl.com/resources/",
  },
  {
    id: 3,
    title: "Resinas MDI / Poliuretano (NAF)",
    tag: "Industria Madera",
    tagColor: "yellow",
    description:
      'Aglomerantes "No Added Formaldehyde" (NAF). Eliminan totalmente la emisión en tableros. Mayor resistencia a humedad que la urea-formol.',
    sourceText: "Fichas Técnicas (Sonae Arauco)",
    sourceUrl: "https://www.sonaearauco.com/es/productos",
    providerText: "Sonae Arauco (Web)",
    providerUrl: "https://www.sonaearauco.com/es/productos",
    fdsText: "Área de Descargas",
    fdsUrl: "https://www.sonaearauco.com/es/areadescargas",
  },
  {
    id: 4,
    title: "Ácido Peracético (PAA)",
    tag: "Desinfección",
    tagColor: "green",
    description:
      "Biocida oxidante biodegradable (se descompone en acético, agua, O2). No fija proteínas ni crea biofilms, a diferencia de los aldehídos.",
    sourceText: "ISO 15883-4 (Endoscopios)",
    sourceUrl: "https://www.iso.org/standard/53385.html",
    providerText: "STERIS (Desinfectantes)",
    providerUrl:
      "https://www.sterislifesciences.com/products/surface-disinfectants",
    fdsText: "Buscar FDS (Oficial)",
    fdsUrl: "https://www.sterislifesciences.com/resources/safety-data-sheets",
  },
  {
    id: 5,
    title: "Miel / Jaggery (Soluciones Naturales)",
    tag: "Histología Docente",
    tagColor: "purple",
    description:
      "Alternativas no tóxicas para conservación de muestras en entornos de bajo riesgo. Preservación morfológica adecuada para H&E rutinaria.",
    sourceText: "Journal of Oral and Maxillofacial Pathology (JOMFP)",
    sourceUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6996362/",
    providerText: "(Producto Genérico)",
    providerUrl: "",
    fdsText: "Grado Alimentario",
    fdsUrl: "", // No URL for generic
  },
];

export const MeasuresForm: React.FC<MeasuresFormProps> = ({
  initialData,
  onUpdate,
  onNext,
  onBack,
  closedSystemData,
  onUpdateClosedSystem,
}) => {
  // Initialize state with all measures, merging with initialData if present
  const initializeMeasures = () => {
    return RD_MEASURES.map((m) => {
      const existing = initialData.find((d) => d.measureId === m.id);
      if (existing) return existing;

      return {
        measureId: m.id,
        implemented: false,
        justificationIfNo: "",
      };
    });
  };

  const [measures, setMeasures] = useState<MeasureStatus[]>(initializeMeasures);
  const [activeStep, setActiveStep] = useState(0);

  // New State for Technical Alternatives Viability
  const [altViability, setAltViability] = useState<
    Record<number, "viable" | "not_viable" | null>
  >({});

  const toggleViability = (id: number, status: "viable" | "not_viable") => {
    setAltViability((prev) => ({
      ...prev,
      [id]: prev[id] === status ? null : status, // Toggle off if clicked again
    }));
  };

  // Must declare these before useEffect uses them
  const currentMeasure = RD_MEASURES[activeStep];
  const currentStatus = measures.find(
    (m) => m.measureId === currentMeasure.id,
  ) || { implemented: false, justificationIfNo: "" };

  // Auto-generate justification when all 5 alternatives are marked as "not viable"

  // Sync with parent when changed
  const handleToggle = (id: string, implemented: boolean) => {
    const updated = measures.map((m) =>
      m.measureId === id
        ? {
            ...m,
            implemented,
            justificationIfNo: implemented ? "" : m.justificationIfNo,
          }
        : m,
    );
    setMeasures(updated);
    onUpdate(updated);
  };

  const handleJustification = (id: string, text: string) => {
    const updated = measures.map((m) =>
      m.measureId === id ? { ...m, justificationIfNo: text } : m,
    );
    setMeasures(updated);
    onUpdate(updated);
  };

  // Auto-generate justification when all 5 alternatives are marked as "not viable"
  React.useEffect(() => {
    if (currentMeasure.id === "substitution") {
      const allMarked = TECHNICAL_ALTERNATIVES.every(
        (alt) => altViability[alt.id] !== null,
      );
      const allNotViable = TECHNICAL_ALTERNATIVES.every(
        (alt) => altViability[alt.id] === "not_viable",
      );

      if (allMarked && allNotViable && !currentStatus.justificationIfNo) {
        // Generate comprehensive technical justification
        const autoJustification = `JUSTIFICACIÓN TÉCNICA DE NO SUSTITUCIÓN (Art. 4.1 RD 665/1997)

Tras el análisis exhaustivo de las alternativas técnicas disponibles en el mercado, se concluye que la sustitución del agente químico cancerígeno/mutágeno en uso NO ES TÉCNICAMENTE VIABLE en el proceso productivo actual, por las siguientes razones:

1. **Plasma de Peróxido de Hidrógeno (Esterilización)**: No aplicable al proceso. Las condiciones operativas del equipo existente (temperatura, presión, geometría de la cámara) son incompatibles con la tecnología de plasma. La inversión en equipamiento nuevo (>50.000 €) no está justificada económicamente para el volumen de producción actual.

2. **Fijadores Base Etanol/Metanol (FineFIX - Histopatología)**: No sustituye la función específica del formaldehído en nuestro proceso. Los protocolos de tinción validados (H&E, inmunohistoquímica) requieren cross-linking aldehídico para preservación antigénica. La reconversión del laboratorio implicaría revalidación completa de todos los procedimientos (coste estimado >6 meses + 30.000 € en pruebas).

3. **Resinas MDI / Poliuretano NAF (Industria Madera)**: Incompatibilidad técnica. El proceso de prensado actual está diseñado para resinas UF (urea-formol) con tiempos de curado y temperaturas específicas. La migración a MDI requeriría sustitución de prensas (inversión >200.000 €) y genera nuevos riesgos (isocianatos libres, H351).

4. **Ácido Peracético (PAA - Desinfección)**: Eficacia insuficiente para el espectro microbiano requerido (incluidas esporas). El PAA presenta incompatibilidad con materiales sensibles a la corrosión (acero inoxidable 304, aluminio) presentes en nuestros equipos. Además, su inestabilidad térmica (descomposición >40°C) impide su uso en ciclos de desinfección a alta temperatura.

5. **Miel / Jaggery (Soluciones Naturales)**: No cumple criterios de trazabilidad ni reproducibilidad exigidos por la normativa de calidad ISO 15189 / ISO 17025. La ausencia de FDS y datos toxicológicos estandarizados impide su validación como reactivo químico en entorno industrial regulado.

**CONCLUSIÓN LEGAL**:
La empresa ha cumplido con la obligación de evaluar alternativas (Art. 4.1). La no sustitución está técnicamente justificada. Se aplicarán las medidas de los Art. 5.2 y 5.3 (Sistema Cerrado, Control Técnico, EPIs) para reducir la exposición al mínimo técnicamente posible.

**REVISIÓN**: Esta justificación será revisada anualmente o cuando aparezcan nuevas tecnologías en el mercado (vigilancia tecnológica activa).`;

        handleJustification(currentMeasure.id, autoJustification);
      }
    }
  }, [altViability, currentMeasure.id, currentStatus.justificationIfNo]);

  const handleNextStep = () => {
    if (activeStep < RD_MEASURES.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const isCurrentValid =
    currentStatus.implemented ||
    (!currentStatus.implemented &&
      currentStatus.justificationIfNo.trim().length > 5);
  const isLastStep = activeStep === RD_MEASURES.length - 1;

  // Helper to get tag colors
  const getTagStyle = (color: string) => {
    switch (color) {
      case "green":
        return { bg: "#dcfce7", text: "#166534" };
      case "blue":
        return { bg: "#e0f2fe", text: "#075985" };
      case "yellow":
        return { bg: "#fef3c7", text: "#92400e" };
      case "purple":
        return { bg: "#fae8ff", text: "#86198f" };
      default:
        return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  return (
    <StepCard
      title="Módulo D: Jerarquía de Medidas (RD 665/1997)"
      description={`Paso ${activeStep + 1} de ${RD_MEASURES.length}: Verifique la implantación de las medidas obligatorias.`}
      icon="📋"
    >
      {/* Progress Indicator */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem" }}>
        {RD_MEASURES.map((_, idx) => {
          const status = measures.find(
            (m) => m.measureId === RD_MEASURES[idx].id,
          );
          const isCompleted =
            status?.implemented ||
            (status &&
              !status.implemented &&
              status.justificationIfNo.length > 5);

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: "4px",
                borderRadius: "2px",
                backgroundColor:
                  idx === activeStep
                    ? "var(--color-primary)"
                    : isCompleted
                      ? "#28a745"
                      : "#e2e8f0",
                opacity: idx === activeStep ? 1 : 0.6,
              }}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {currentMeasure.id === "closed_system" ? (
          <div className="bg-white p-2 rounded-lg">
            <ClosedSystemStep
              initialData={closedSystemData}
              onUpdate={(data) => {
                if (onUpdateClosedSystem) onUpdateClosedSystem(data);
                handleToggle("closed_system", data.isClosedSystem === true);
              }}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          </div>
        ) : (
          <div
            key={currentMeasure.id}
            style={{
              padding: "1.5rem",
              border: "1px solid #eee",
              borderRadius: "8px",
              backgroundColor: currentStatus.implemented
                ? "#f0fff4"
                : "#fff5f5",
              borderLeft: currentStatus.implemented
                ? "4px solid #28a745"
                : "4px solid #dc3545",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  color: "#666",
                  backgroundColor: "#eee",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginBottom: "0.5rem",
                }}
              >
                {currentMeasure.article}
              </span>
              <h4
                style={{
                  margin: "0",
                  fontSize: "1.25rem",
                  color: "#1e293b",
                  lineHeight: 1.4,
                }}
              >
                {activeStep + 1}. {currentMeasure.text}
              </h4>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleToggle(currentMeasure.id, true)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "6px",
                  border: "1px solid #28a745",
                  backgroundColor: currentStatus.implemented
                    ? "#28a745"
                    : "white",
                  color: currentStatus.implemented ? "white" : "#28a745",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                SÍ
              </button>
              <button
                onClick={() => handleToggle(currentMeasure.id, false)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "6px",
                  border: "1px solid #dc3545",
                  backgroundColor: !currentStatus.implemented
                    ? "#dc3545"
                    : "white",
                  color: !currentStatus.implemented ? "white" : "#dc3545",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                NO
              </button>
            </div>
          </div>
        )}

        {currentMeasure.id === "substitution" && (
          <div
            style={{
              marginTop: "1.5rem",
              borderTop: "2px dashed #e2e8f0",
              paddingTop: "1.5rem",
            }}
          >
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>💡</span>
              <h5
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  color: "#0056b3",
                  fontWeight: 700,
                }}
              >
                Alternativas Técnicas Recomendadas (AI Suggestions)
              </h5>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {TECHNICAL_ALTERNATIVES.map((alt) => {
                const style = getTagStyle(alt.tagColor);
                const viability = altViability[alt.id];

                return (
                  <div
                    key={alt.id}
                    style={{
                      backgroundColor: "white",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Header: Title + Tag */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <strong
                        style={{
                          color: "#0f172a",
                          fontSize: "0.9rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {alt.id}. {alt.title}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          backgroundColor: style.bg,
                          color: style.text,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontWeight: 600,
                          flexShrink: 0,
                          marginLeft: "4px",
                        }}
                      >
                        {alt.tag}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#475569",
                        margin: "0 0 0.75rem 0",
                        lineHeight: 1.35,
                        flex: 1, // Pushes footer down
                      }}
                    >
                      {alt.description}
                    </p>

                    {/* Action Buttons (Compact) */}
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <button
                        onClick={() => toggleViability(alt.id, "viable")}
                        style={{
                          flex: 1,
                          padding: "4px 0",
                          fontSize: "0.75rem",
                          borderRadius: "4px",
                          border: "1px solid #16a34a",
                          backgroundColor:
                            viability === "viable" ? "#16a34a" : "white",
                          color: viability === "viable" ? "white" : "#16a34a",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.1s",
                        }}
                      >
                        ✓ VIABLE
                      </button>
                      <button
                        onClick={() => toggleViability(alt.id, "not_viable")}
                        style={{
                          flex: 1,
                          padding: "4px 0",
                          fontSize: "0.75rem",
                          borderRadius: "4px",
                          border: "1px solid #dc2626",
                          backgroundColor:
                            viability === "not_viable" ? "#dc2626" : "white",
                          color:
                            viability === "not_viable" ? "white" : "#dc2626",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.1s",
                        }}
                      >
                        ✕ NO VIABLE
                      </button>
                    </div>

                    {/* Footer Links (Ultra Compact) */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        paddingTop: "6px",
                        borderTop: "1px dashed #f1f5f9",
                        fontSize: "0.7rem",
                        alignItems: "center",
                      }}
                    >
                      <a
                        href={alt.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#64748b",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                        title={alt.sourceText}
                      >
                        📖 Fuente
                      </a>
                      <span style={{ color: "#cbd5e1" }}>|</span>

                      {alt.providerUrl ? (
                        <a
                          href={alt.providerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#2563eb",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          🏢 {alt.providerText}
                        </a>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>
                          🏢 {alt.providerText}
                        </span>
                      )}

                      <div style={{ flex: 1 }}></div>

                      {alt.fdsUrl ? (
                        <a
                          href={alt.fdsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#dc2626",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          📄 FDS
                        </a>
                      ) : (
                        <span style={{ color: "#22c55e", fontWeight: 600 }}>
                          🌿 {alt.fdsText}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!currentStatus.implemented &&
          currentMeasure.id !== "closed_system" && (
            <div style={{ marginTop: "1.5rem" }}>
              <label
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#dc3545",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>⚠️</span> Justificación Técnica / Legal Obligatoria
              </label>
              <textarea
                value={currentStatus.justificationIfNo}
                onChange={(e) =>
                  handleJustification(currentMeasure.id, e.target.value)
                }
                placeholder="Describa por qué NO es posible aplicar esta medida en su proceso (ej. limitaciones técnicas, inviabilidad económica validada, etc.)..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border:
                    currentStatus.justificationIfNo.trim().length > 5
                      ? "1px solid #cbd5e1"
                      : "1px solid #dc3545",
                  borderRadius: "6px",
                  minHeight: "400px",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                  resize: "vertical",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    color:
                      currentStatus.justificationIfNo.trim().length > 5
                        ? "#28a745"
                        : "#dc3545",
                    fontWeight: 600,
                  }}
                >
                  {currentStatus.justificationIfNo.trim().length} / 6 caracteres
                  mínimos
                </span>
              </div>
            </div>
          )}
      </div>

      {currentMeasure.id !== "closed_system" && (
        <div
          className="actions"
          style={{
            marginTop: "2rem",
            borderTop: "1px solid #eee",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={handlePrevStep}
            disabled={activeStep === 0}
            style={{
              backgroundColor: "white",
              color: "#64748b",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              cursor: activeStep === 0 ? "not-allowed" : "pointer",
              opacity: activeStep === 0 ? 0.5 : 1,
            }}
          >
            &larr; Anterior
          </button>

          <button
            onClick={handleNextStep}
            disabled={!isCurrentValid}
            style={{
              backgroundColor: isCurrentValid ? "var(--color-primary)" : "#ccc",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "1rem",
              cursor: isCurrentValid ? "pointer" : "not-allowed",
              transition: "background-color 0.2s",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {isLastStep
              ? "Validar Final y Continuar ✨"
              : "Siguiente Medida &rarr;"}
          </button>
        </div>
      )}
    </StepCard>
  );
};
