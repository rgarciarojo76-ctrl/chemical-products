/* eslint-disable */
import React, { useState, useEffect } from "react";
import { StepCard } from "../../ui/StepCard";
import type {
  HygienicEvalInput,
  HygienicAssessment,
  HazardInput,
  StoffenmanagerInput,
} from "../../../types";

interface HygienicEvalFormProps {
  onAnalyze: (input: HygienicEvalInput) => HygienicAssessment;
  onNext: () => void;
  onBack?: () => void;
  initialData?: HygienicEvalInput;
  vlaReference?: number; // Passed from prev state
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

  // --- LOGIC: Stoffenmanager Auto-fill ---
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

        // Defaults (NTP 1183 Baseline)
        vapourPressure: 100, // Default Pa
        dustiness: "solid_objects",
        handlingType: "A",
        localControl: "none",
        roomVolume: "100_1000",
        ventilationType: "natural",
        dailyCleaning: false,
        equipmentMaintenance: true, // Optimist default
        workerSegregation: "none",
        ppeUsed: false,
        exposureDuration: "min_30",
        exposureFrequency: "day_1",
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
        [field]: value as any,
      },
    }));
  };

  const handleAnalyze = () => {
    const assessment = onAnalyze(formData);
    setResult(assessment);
  };

  return (
    <StepCard
      title="Módulo C: Evaluación Higiénica Cuantitativa"
      description={`Definición de estrategia y conformidad para: ${substanceName || "Agente"}`}
      icon="🧠"
    >
      {/* 1. Caracterización Básica (RESTORED) */}
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
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
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

      {/* 2. Similar Exposure Groups (GES) (RESTORED) */}
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
            Grupo de trabajadores que tienen el mismo perfil de exposición para
            el agente químico estudiado, debido a la similitud y frecuencia de
            las tareas realizadas, los procesos y los materiales con los que
            trabajan y a la similitud de la manera que realizan las tareas.
          </p>
        </div>
      </div>

      {/* 3. Stoffenmanager (NEW) */}
      {formData.stoffenmanager && (
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
            3. Estimación Cualitativa (Stoffenmanager®)
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* A. Identification & State */}
            <div
              style={{
                padding: "0.5rem",
                background: "#f8f9fa",
                borderRadius: "6px",
                gridColumn: "span 2",
              }}
            >
              <h5
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                A. Identificación y Estado
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
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
                    <option value="solid">Sólido</option>
                    <option value="liquid">Líquido</option>
                  </select>
                </div>
                {formData.stoffenmanager.physicalState === "liquid" ? (
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      Presión de Vapor (Pa)
                    </label>
                    <input
                      type="number"
                      style={{ width: "100%", padding: "0.4rem" }}
                      placeholder="Ej. 2300"
                      value={formData.stoffenmanager.vapourPressure || ""}
                      onChange={(e) =>
                        updateStoffenmanager(
                          "vapourPressure",
                          parseFloat(e.target.value),
                        )
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                      Pulverulencia (Dustiness)
                    </label>
                    <select
                      style={{ width: "100%", padding: "0.4rem" }}
                      value={formData.stoffenmanager.dustiness}
                      onChange={(e) =>
                        updateStoffenmanager("dustiness", e.target.value)
                      }
                    >
                      <option value="solid_objects">
                        Objetos sólidos (No polvo)
                      </option>
                      <option value="granules_firm">Gránulos firmes</option>
                      <option value="granules_friable">
                        Gránulos friables
                      </option>
                      <option value="dust_coarse">Polvo grueso</option>
                      <option value="dust_fine">Polvo fino</option>
                      <option value="dust_extreme">
                        Polvo "fluffy" (Extremo)
                      </option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* B. Handling */}
            <div
              style={{
                padding: "0.5rem",
                background: "#f8f9fa",
                borderRadius: "6px",
                gridColumn: "span 2",
              }}
            >
              <h5
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                B. Tipo de Manipulación (Tarea)
              </h5>
              <select
                style={{ width: "100%", padding: "0.4rem" }}
                value={formData.stoffenmanager.handlingType}
                onChange={(e) =>
                  updateStoffenmanager("handlingType", e.target.value)
                }
              >
                <option value="A">
                  A: Tarea pasiva (almacenamiento, inspección)
                </option>
                <option value="B">
                  B: Manipulación de objetos / manual baja energía
                </option>
                <option value="C">
                  C: Transferencia / Mezcla abierta (Energía media)
                </option>
                <option value="D">
                  D: Tareas de alta energía (Molienda, corte, lijado)
                </option>
                <option value="E">
                  E: Procesos dispersivos (Spray, chorro)
                </option>
              </select>
            </div>

            {/* C. Controls */}
            <div
              style={{
                padding: "0.5rem",
                background: "#f0f7ff",
                borderRadius: "6px",
              }}
            >
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Control Local
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
                <option value="none">Sin control específico</option>
                <option value="suppression">
                  Supresión húmeda / abatimiento
                </option>
                <option value="local_extraction">
                  Extracción Localizada (LEV)
                </option>
                <option value="containment_no_extract">
                  Cerramiento (Sin extracción)
                </option>
                <option value="containment_extraction">
                  Cerramiento estanco con extracción
                </option>
              </select>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Volumen Sala
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "0.4rem",
                  marginBottom: "0.5rem",
                }}
                value={formData.stoffenmanager.roomVolume}
                onChange={(e) =>
                  updateStoffenmanager("roomVolume", e.target.value)
                }
              >
                <option value="lt_100">&lt; 100 m³ (Pequeña)</option>
                <option value="100_1000">100 - 1000 m³ (Mediana)</option>
                <option value="gt_1000">&gt; 1000 m³ (Grande/Nave)</option>
                <option value="outdoor">Exterior</option>
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
                <option value="none">Sin ventilación forzada</option>
                <option value="natural">Natural (Puertas/Ventanas)</option>
                <option value="mechanical">Mecánica General</option>
              </select>
            </div>

            {/* D. Organization */}
            <div
              style={{
                padding: "0.5rem",
                background: "#f0f7ff",
                borderRadius: "6px",
              }}
            >
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Frecuencia Limpieza
              </label>
              <div style={{ marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem" }}>
                  <input
                    type="checkbox"
                    checked={formData.stoffenmanager.dailyCleaning}
                    onChange={(e) =>
                      updateStoffenmanager("dailyCleaning", e.target.checked)
                    }
                  />{" "}
                  Limpieza diaria efectiva
                </label>
              </div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Mantenimiento Eq.
              </label>
              <div style={{ marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem" }}>
                  <input
                    type="checkbox"
                    checked={formData.stoffenmanager.equipmentMaintenance}
                    onChange={(e) =>
                      updateStoffenmanager(
                        "equipmentMaintenance",
                        e.target.checked,
                      )
                    }
                  />{" "}
                  Plan preventivo riguroso
                </label>
              </div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Segregación
              </label>
              <select
                style={{ width: "100%", padding: "0.4rem" }}
                value={formData.stoffenmanager.workerSegregation}
                onChange={(e) =>
                  updateStoffenmanager("workerSegregation", e.target.value)
                }
              >
                <option value="none">Trabajador junto a fuente</option>
                <option value="cabin">Trabajador en cabina aislada</option>
              </select>
            </div>

            {/* E. Duration & PPE */}
            <div
              style={{
                padding: "0.5rem",
                background: "#fff8e1",
                borderRadius: "6px",
                gridColumn: "span 2",
              }}
            >
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    Duración Tarea
                  </label>
                  <select
                    style={{ width: "100%", padding: "0.4rem" }}
                    value={formData.stoffenmanager.exposureDuration}
                    onChange={(e) =>
                      updateStoffenmanager("exposureDuration", e.target.value)
                    }
                  >
                    <option value="min_15">&lt; 15 min</option>
                    <option value="min_30">30 min</option>
                    <option value="hour_2">2 horas</option>
                    <option value="hour_4">4 horas</option>
                    <option value="hour_8">8 horas</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    Frecuencia
                  </label>
                  <select
                    style={{ width: "100%", padding: "0.4rem" }}
                    value={formData.stoffenmanager.exposureFrequency}
                    onChange={(e) =>
                      updateStoffenmanager("exposureFrequency", e.target.value)
                    }
                  >
                    <option value="year_1">1/año</option>
                    <option value="month_1">1/mes</option>
                    <option value="week_1">1/semana</option>
                    <option value="week_4_5">4-5 días/semana</option>
                    <option value="day_1">Diario</option>
                  </select>
                </div>
                <div style={{ flex: 0.5, textAlign: "center" }}>
                  <label
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      display: "block",
                    }}
                  >
                    Uso EPI
                  </label>
                  <input
                    type="checkbox"
                    checked={formData.stoffenmanager.ppeUsed}
                    onChange={(e) =>
                      updateStoffenmanager("ppeUsed", e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Strategy & Sampling (RESTORED - Renumbered) */}
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
            onChange={(e) =>
              setFormData({ ...formData, strategyType: e.target.value as any })
            }
          >
            <option value="">Seleccione tipo de proceso...</option>
            <option value="continuous">Continuo y Homogéneo (Estable)</option>
            <option value="peaks">Variable con Picos (Tareas puntuales)</option>
            <option value="variable">Cíclico / Muy Variable</option>
          </select>
        </div>
        {/* Sampling Details (Existing Code restored) */}
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
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #eee",
            }}
          >
            <span style={{ fontWeight: 600 }}>Método Captación:</span>{" "}
            {formData.samplingDetails?.technique || "---"}
          </div>
        </div>
      </div>

      {/* 5. VLA Section (RESTORED - Renumbered) */}
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
            5. Valor Límite Ambiental
          </h4>
          <a
            href="https://www.insst.es/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "0.8rem" }}
          >
            Ref INSST
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
              VLA-ED
            </label>
            <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {formData.vla ? `${formData.vla} mg/m³` : "---"}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Results (RESTORED - Renumbered) */}
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
          6. Resultados de la Medición
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
              style={{ display: "block", fontSize: "0.9rem", fontWeight: 600 }}
            >
              Concentración (I)
            </label>
            <input
              type="number"
              step="0.001"
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
          </div>
          <div>
            <label
              style={{ display: "block", fontSize: "0.9rem", fontWeight: 600 }}
            >
              Límite de Cuantificación (LOQ)
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.lod || ""}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              onChange={(e) =>
                setFormData({ ...formData, lod: parseFloat(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

      {/* Actions */}
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
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            &larr; Anterior
          </button>
        )}
        <button
          onClick={handleAnalyze}
          style={{
            flex: 1,
            backgroundColor: "var(--color-primary)",
            color: "white",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Verificar Conformidad
        </button>
      </div>
      {result && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: result.isSafe ? "#d4edda" : "#f8d7da",
            borderRadius: "6px",
            border: `1px solid ${result.isSafe ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          <h4
            style={{
              color: result.isSafe ? "#155724" : "#721c24",
              marginTop: 0,
            }}
          >
            {result.isSafe ? "CONFORME" : "NO CONFORME"}
          </h4>
          <p>{result.justification.technical}</p>
          <button
            onClick={onNext}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              float: "right",
            }}
          >
            Finalizar
          </button>
          <div style={{ clear: "both" }}></div>
        </div>
      )}
    </StepCard>
  );
};
