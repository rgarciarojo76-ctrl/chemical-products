/* eslint-disable */
import React, { useState, useEffect } from "react";
import { StepCard } from "../../ui/StepCard";
import { BasicCharacterizationStep } from "./BasicCharacterizationStep";
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

  // 0: Selection Method
  // 1: Caracterización básica (Simplificada) -> IF selected 'simplified', else SKIP
  // 2: Caracterización básica (Avanzada: Stoffenmanager) -> IF selected 'advanced', else SKIP
  // 3: Grupos de exposición similares (GES)
  // 4: Estrategia de Medición
  // 5: Resultados
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
        [field]: value,
      },
    }));
  };

  const handleAnalyze = () => {
    const assessment = onAnalyze(formData);
    setResult(assessment);
  };

  // Branching Navigation Logic
  const handleInternalNext = () => {
    // Step 0: Selection -> Route based on method
    if (internalStep === 0) {
      if (formData.evaluationMethod === "simplified")
        setInternalStep(1); // Go to Simplified
      else if (formData.evaluationMethod === "advanced")
        setInternalStep(2); // Go to Stoffenmanager
      else alert("Por favor, seleccione un método de evaluación.");
      return;
    }

    // Step 1: Simplified -> Skip Stoffenmanager (2), go to GES (3)
    if (internalStep === 1) {
      setInternalStep(3);
      return;
    }

    // Step 2: Stoffenmanager -> Go to GES (3)
    if (internalStep === 2) {
      setInternalStep(3);
      return;
    }

    // Normal flow
    // Step 3 (GES) -> Step 4
    // Step 4 (Strategy) -> Step 5
    if (internalStep < 5) {
      setInternalStep((prev) => prev + 1);
    }
  };

  const handleInternalBack = () => {
    // Step 3 (GES) -> Go back to whichever was selected
    if (internalStep === 3) {
      if (formData.evaluationMethod === "simplified") setInternalStep(1);
      else setInternalStep(2);
      return;
    }

    // Step 1 OR 2 -> Go back to Selection (0)
    if (internalStep === 1 || internalStep === 2) {
      setInternalStep(0);
      return;
    }

    // Step 0 -> Parent back
    if (internalStep === 0 && onBack) {
      onBack();
      return;
    }

    if (internalStep > 0) {
      setInternalStep((prev) => prev - 1);
    }
  };

  const isStep0 = internalStep === 0; // Selection
  const isStep1 = internalStep === 1; // Simplified
  const isStep2 = internalStep === 2; // Stoffenmanager
  const isStep3 = internalStep === 3; // GES
  const isStep4 = internalStep === 4; // Strategy
  const isStep5 = internalStep === 5; // Results

  return (
    <StepCard
      title="Módulo C: Evaluación Higiénica Cuantitativa"
      description={`Definición de estrategia y conformidad para: ${substanceName || "Agente"}`}
      icon="🧠"
    >
      <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem" }}>
        {[0, 1, 2, 3, 4, 5].map((step) => {
          // Visual mapping
          let activeVisualStep = 0;
          if (internalStep === 0) activeVisualStep = 0;
          if (internalStep === 1 || internalStep === 2) activeVisualStep = 1;
          if (internalStep === 3) activeVisualStep = 2;
          if (internalStep === 4) activeVisualStep = 3;
          if (internalStep === 5) activeVisualStep = 4;

          if (step > 4) return null; // Only show 5 bars

          return (
            <div
              key={step}
              style={{
                flex: 1,
                height: "4px",
                borderRadius: "2px",
                backgroundColor:
                  step <= activeVisualStep ? "var(--color-primary)" : "#e2e8f0",
                transition: "background-color 0.3s",
              }}
            />
          );
        })}
      </div>

      {/* STEP 0: METHOD SELECTION */}
      {isStep0 && (
        <div className="animate-fadeIn">
          <h3 className="text-xl font-bold text-center text-slate-800 mb-6">
            Seleccione el Tipo de Evaluación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Option A: Simplified */}
            <div
              onClick={() => {
                setFormData({ ...formData, evaluationMethod: "simplified" });
                setInternalStep(1);
              }}
              style={{
                cursor: "pointer",
                padding: "2rem",
                borderRadius: "1rem",
                border:
                  formData.evaluationMethod === "simplified"
                    ? "2px solid #3b82f6"
                    : "2px solid #e2e8f0",
                backgroundColor: "white",
                textAlign: "center",
                transition: "all 0.2s",
                boxShadow:
                  formData.evaluationMethod === "simplified"
                    ? "0 10px 15px -3px rgba(59, 130, 246, 0.1)"
                    : "none",
                transform:
                  formData.evaluationMethod === "simplified"
                    ? "scale(1.02)"
                    : "scale(1)",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1.5rem",
                  background: "#eff6ff",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem auto",
                }}
              >
                🅰️
              </div>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "#1e293b",
                }}
              >
                Caracterización Básica (Simplificada)
              </h4>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#64748b",
                  marginBottom: "1.5rem",
                  lineHeight: 1.5,
                }}
              >
                Método cualitativo intuitivo. Ideal para una primera
                aproximación rápida. Utiliza el Asistente de Escenarios
                Estándar.
              </p>
              <div
                style={{
                  marginTop: "auto",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  background:
                    formData.evaluationMethod === "simplified"
                      ? "#2563eb"
                      : "#f1f5f9",
                  color:
                    formData.evaluationMethod === "simplified"
                      ? "white"
                      : "#64748b",
                }}
              >
                Seleccionar Simplificada
              </div>
            </div>

            {/* Option B: Advanced */}
            <div
              onClick={() => {
                setFormData({ ...formData, evaluationMethod: "advanced" });
                setInternalStep(2);
              }}
              style={{
                cursor: "pointer",
                padding: "2rem",
                borderRadius: "1rem",
                border:
                  formData.evaluationMethod === "advanced"
                    ? "2px solid #a855f7"
                    : "2px solid #e2e8f0",
                backgroundColor: "white",
                textAlign: "center",
                transition: "all 0.2s",
                boxShadow:
                  formData.evaluationMethod === "advanced"
                    ? "0 10px 15px -3px rgba(168, 85, 247, 0.1)"
                    : "none",
                transform:
                  formData.evaluationMethod === "advanced"
                    ? "scale(1.02)"
                    : "scale(1)",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1.5rem",
                  background: "#faf5ff",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem auto",
                }}
              >
                🅱️
              </div>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "#1e293b",
                }}
              >
                Avanzada: Stoffenmanager®
              </h4>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#64748b",
                  marginBottom: "1.5rem",
                  lineHeight: 1.5,
                }}
              >
                Estimación cuantitativa (NTP 1183). Calcula bandas de riesgo
                basándose en variables físico-químicas complejas.
              </p>
              <div
                style={{
                  marginTop: "auto",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  background:
                    formData.evaluationMethod === "advanced"
                      ? "#9333ea"
                      : "#f1f5f9",
                  color:
                    formData.evaluationMethod === "advanced"
                      ? "white"
                      : "#64748b",
                }}
              >
                Seleccionar Avanzada
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleInternalNext}
              disabled={!formData.evaluationMethod}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "0.75rem",
                fontWeight: 700,
                fontSize: "1rem",
                background: !formData.evaluationMethod
                  ? "#e2e8f0"
                  : "var(--color-primary)",
                color: !formData.evaluationMethod ? "#94a3b8" : "white",
                cursor: !formData.evaluationMethod ? "not-allowed" : "pointer",
                border: "none",
                boxShadow: !formData.evaluationMethod
                  ? "none"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* STEP 1A: Caracterización Básica (Simplificada) */}
      {isStep1 && (
        <div className="form-group mb-4 animate-slideIn">
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
              1. Caracterización Básica (Simplificada)
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

          <BasicCharacterizationStep
            data={formData.basicCharacterization}
            onUpdate={(data) =>
              setFormData((prev) => ({ ...prev, basicCharacterization: data }))
            }
            hazardData={hazardData}
          />
        </div>
      )}

      {/* STEP 1B: Caracterización Básica (Avanzada: Stoffenmanager) */}
      {isStep2 && formData.stoffenmanager && (
        <div className="form-group mb-4 animate-slideIn">
          <h4
            style={{
              fontSize: "1rem",
              marginBottom: "0.5rem",
              color: "#0056b3",
              borderBottom: "2px solid #0056b3",
              paddingBottom: "0.25rem",
            }}
          >
            2. Caracterización Básica (Avanzada: Stoffenmanager®)
          </h4>

          <div
            className="stoff-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* 1. Identification & State */}
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

            {/* 2. Handling */}
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

            {/* 3. Controls & Environment */}
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

            {/* 4. Org & Maintenance */}
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
                style={{
                  width: "100%",
                  padding: "0.4rem",
                  marginBottom: "0.5rem",
                }}
                value={formData.stoffenmanager.workerSegregation}
                onChange={(e) =>
                  updateStoffenmanager("workerSegregation", e.target.value)
                }
              >
                <option value="none">Trabajador junto a fuente</option>
                <option value="cabin">Trabajador en cabina aislada</option>
              </select>
            </div>

            {/* 5. Time & EPI */}
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

      {/* STEP 2: 3. Grupos de exposición similares (GES) */}
      {isStep3 && (
        <div className="form-group mb-4 animate-slideIn">
          <h4
            style={{
              fontSize: "1rem",
              marginBottom: "0.5rem",
              color: "#0056b3",
              borderBottom: "2px solid #0056b3",
              paddingBottom: "0.25rem",
            }}
          >
            3. Grupos de exposición similares (GES)
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
              para el agente químico estudiado.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: 4. Estrategia de Medición */}
      {isStep4 && (
        <div className="form-group mb-4 animate-slideIn">
          <h4
            style={{
              fontSize: "1rem",
              marginBottom: "0.5rem",
              color: "#0056b3",
              borderBottom: "2px solid #0056b3",
              paddingBottom: "0.25rem",
            }}
          >
            4. Estrategia de Medición
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
              style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
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
      )}

      {/* STEP 4: 5. Resultados de la Medición */}
      {isStep5 && (
        <div className="form-group mb-4 animate-slideIn">
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
            }}
          >
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                Resultado Laboratorio (mg/m³)
              </label>
              <input
                type="number"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={formData.labResult || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    labResult: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                Límite de Detección (LOD)
              </label>
              <input
                type="number"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={formData.lod || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lod: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            style={{
              marginTop: "1rem",
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Analizar Conformidad
          </button>

          {result && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: result.isSafe ? "#d4edda" : "#f8d7da",
                border: result.isSafe
                  ? "1px solid #c3e6cb"
                  : "1px solid #f5c6cb",
                borderRadius: "4px",
              }}
            >
              <h5
                style={{
                  margin: "0 0 0.5rem 0",
                  color: result.isSafe ? "#155724" : "#721c24",
                }}
              >
                {result.isSafe ? "✅ CONFORME" : "❌ NO CONFORME"}
              </h5>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                Razón: {result.justification.technical}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div
        className="nav-buttons"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1.5rem",
        }}
      >
        <button
          onClick={handleInternalBack}
          disabled={!onBack && internalStep === 0}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: !onBack && internalStep === 0 ? "not-allowed" : "pointer",
            opacity: !onBack && internalStep === 0 ? 0.5 : 1,
          }}
        >
          Anterior
        </button>

        {isStep5 ? (
          <button
            onClick={onNext}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Finalizar Módulo
          </button>
        ) : (
          <button
            onClick={handleInternalNext}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Siguiente
          </button>
        )}
      </div>
    </StepCard>
  );
};
