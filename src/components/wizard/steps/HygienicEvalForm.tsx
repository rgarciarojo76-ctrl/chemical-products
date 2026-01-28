/* eslint-disable */
import React, { useState, useEffect } from "react";
import { StepCard } from "../../ui/StepCard";
import { BasicCharacterizationStep } from "./BasicCharacterizationStep";
import { calculateStoffenmanager } from "../../../utils/stoffenmanagerLogic";
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
  selectedCnae?: any;
  onShowReport?: (data?: any) => void;
}

export const HygienicEvalForm: React.FC<HygienicEvalFormProps> = ({
  onAnalyze,
  onNext,
  onBack,
  initialData,
  vlaReference,
  hazardData,
  selectedCnae,
}) => {
  // INTERNAL STATE
  // 0: Selection Method (Simplificada / Avanzada)
  // 1: Caracterización Básica (Standard Scenarios / Wizard)
  // 2: GES (Grupos de Exposición Similar)
  // 3: Stoffenmanager (Only Advanced)
  const [internalStep, setInternalStep] = useState(0);
  const [evaluationMethod, setEvaluationMethod] = useState<
    "simplified" | "advanced"
  >("simplified");

  const [formData, setFormData] = useState<HygienicEvalInput>(
    initialData || {
      vla: vlaReference ? vlaReference : undefined,
      basicCharacterization: {
        processDescription: "",
        isOpenProcess: true,
        technicalMeasure: "none",
        cleaningMethod: "hepa_wet",
        accessRestricted: false,
        signageGHS08: false,
        respiratoryPPE: "",
        dermalPPE: "",
        frequency: "daily",
        duration: "2h_4h",
        hygieneRights: false,
      },
    },
  );

  const [result, setResult] = useState<HygienicAssessment | null>(
    initialData?.labResult ? onAnalyze(initialData) : null,
  );

  // --- LOGIC: Stoffenmanager Auto-fill ---
  useEffect(() => {
    if (!formData.stoffenmanager && hazardData) {
      const isLiquid =
        hazardData.detectedPhysicalForm?.includes("liquid") || false;
      setFormData((prev) => ({
        ...prev,
        stoffenmanager: {
          productName: hazardData.substanceName || "",
          manufacturer: "",
          casNumber: hazardData.casNumber || "",
          hasFDS: true,
          physicalState: isLiquid ? "liquid" : "solid",
          hPhrases: hazardData.hPhrases,
          isDiluted: hazardData.isMixture || false,
          dilutionPercent: hazardData.concentration,
          vapourPressure: hazardData.vapourPressure || 1000,
          dustiness: "solid_objects",
          handlingType: "A",
          localControl: "none",
          roomVolume: "100_1000",
          ventilationType: "natural",
          dailyCleaning: false,
          equipmentMaintenance: true,
          workerSegregation: "none",
          ppeUsed: false,
          exposureDuration: "min_30",
          exposureFrequency: "day_1",
        },
      }));
    }
  }, [hazardData]);

  const updateStoffenmanager = (
    field: keyof StoffenmanagerInput,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      stoffenmanager: { ...prev.stoffenmanager!, [field]: value },
    }));
  };

  const calculateResults = () => {
    if (evaluationMethod === "advanced" && formData.stoffenmanager) {
      const smResult = calculateStoffenmanager(formData.stoffenmanager);
      setResult({
        isSafe: smResult.riskPriority === "III",
        justification: {
          technical: `Puntuación de Exposición: ${smResult.exposureScore}. Prioridad de riesgo: ${smResult.riskPriority}.`,
          legal: {
            article: "NTP 937",
            text: "Modelo Stoffenmanager® (Algoritmo Simplificado)",
          },
        },
        stoffenmanagerResult: smResult,
      });
    } else {
      const assessment = onAnalyze(formData);
      setResult(assessment);
    }
  };

  // --- RENDER: METHOD SELECTION (Step 0) ---
  if (internalStep === 0) {
    return (
      <StepCard
        title="Módulo C: Selección de Metodología Caracterización Básica"
        description="Seleccione el nivel de profundidad para la caracterización básica"
        icon="🤔"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div
            onClick={() => {
              setEvaluationMethod("simplified");
              setInternalStep(1);
            }}
            style={{
              padding: "2rem",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              cursor: "pointer",
              transition: "all 0.2s",
              backgroundColor: "white",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚡</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Caracterización básica (simplificada)
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Escenarios Estándar y listas de chequeo rápidas.
            </p>
          </div>
          <div
            onClick={() => {
              setEvaluationMethod("advanced");
              setInternalStep(3);
            }}
            style={{
              padding: "2rem",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              cursor: "pointer",
              transition: "all 0.2s",
              backgroundColor: "white",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "#8b5cf6")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🧪</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Caracterización básica (avanzada)
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Algoritmo Stoffenmanager® completo.
            </p>
          </div>
        </div>

        {onBack && (
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <button
              onClick={onBack}
              style={{
                color: "#666",
                background: "none",
                border: "1px solid #ccc",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              ← Atrás
            </button>
          </div>
        )}
      </StepCard>
    );
  }

  // --- RENDER: STEP 1 - BASIC CHARACTERIZATION (Using Component) ---
  if (internalStep === 1) {
    return (
      <div className="animate-fadeIn">
        <BasicCharacterizationStep
          data={formData.basicCharacterization}
          onUpdate={(data) =>
            setFormData((prev) => ({ ...prev, basicCharacterization: data }))
          }
          hazardData={hazardData}
          selectedCnae={selectedCnae}
        />
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setInternalStep(0)}
            style={{
              color: "#666",
              background: "none",
              border: "1px solid #ccc",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ← Atrás
          </button>
          <button
            onClick={() => setInternalStep(2)}
            style={{
              backgroundColor: "#0056b3",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
            }}
          >
            Siguiente: GES →
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: STEP 2 - GES (Grupos de Exposición Similar) ---
  if (internalStep === 2) {
    return (
      <StepCard
        title="2. Definición de GES"
        description="Grupos de Exposición Similar"
        icon="👥"
      >
        <div className="form-group mb-4">
          <label className="block text-sm font-medium mb-1">
            Nombre del Grupo (GES)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Ej: Operarios de Limpieza Turno Mañana"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block text-sm font-medium mb-1">
            Nº Trabajadores Expuestos
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            defaultValue={1}
          />
        </div>

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setInternalStep(1)}
            style={{
              color: "#666",
              background: "none",
              border: "1px solid #ccc",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ← Atrás
          </button>
          <button
            onClick={() => {
              if (evaluationMethod === "advanced") {
                setInternalStep(3);
              } else if (result) {
                onNext();
              } else {
                calculateResults();
              }
            }}
            style={{
              backgroundColor: "#0056b3",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
            }}
          >
            {evaluationMethod === "advanced"
              ? "Siguiente: Stoffenmanager →"
              : result
                ? "Continuar →"
                : "Calcular Resultados"}
          </button>
        </div>

        {/* RESULTS DISPLAY for Simplified */}
        {evaluationMethod === "simplified" && result && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              borderRadius: "8px",
              backgroundColor: result.isSafe ? "#f0fdf4" : "#fef2f2",
              border: `2px solid ${result.isSafe ? "#22c55e" : "#ef4444"}`,
            }}
          >
            <h3
              style={{
                fontWeight: "bold",
                color: result.isSafe ? "#15803d" : "#b91c1c",
              }}
            >
              {result.isSafe
                ? "✅ RIESGO CONTROLADO"
                : "⚠️ RIESGO NO DESCARTABLE"}
            </h3>
            <p style={{ marginTop: "0.5rem" }}>
              {result.justification.technical}
            </p>
            <button
              onClick={onNext}
              style={{
                marginTop: "1rem",
                background: "#2563eb",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
              }}
            >
              Ver Informe
            </button>
          </div>
        )}
      </StepCard>
    );
  }

  // --- RENDER: STEP 3 - STOFFENMANAGER (Full Implementation) ---
  if (internalStep === 3) {
    return (
      <StepCard
        title="3. Algoritmo Stoffenmanager®"
        description="Parámetros del modelo (NTP 937)"
        icon="🧪"
      >
        {/* 1. EMISSION POTENTIAL (Source) */}
        <div className="p-4 bg-gray-50 rounded mb-4 border border-gray-200">
          <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">
            1. Fuente e Intrínseca
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Estado Físico
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.stoffenmanager?.physicalState}
                onChange={(e) =>
                  updateStoffenmanager("physicalState", e.target.value)
                }
              >
                <option value="liquid">Líquido</option>
                <option value="solid">Sólido</option>
              </select>
            </div>
            {formData.stoffenmanager?.physicalState === "liquid" ? (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Presión de Vapor (Pa)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={formData.stoffenmanager?.vapourPressure}
                  onChange={(e) =>
                    updateStoffenmanager(
                      "vapourPressure",
                      Number(e.target.value),
                    )
                  }
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pulverulencia (Dustiness)
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.stoffenmanager?.dustiness}
                  onChange={(e) =>
                    updateStoffenmanager("dustiness", e.target.value)
                  }
                >
                  <option value="solid_objects">
                    Objetos Sólidos (No polvo)
                  </option>
                  <option value="granules_firm">Gránulos Firmes</option>
                  <option value="granules_friable">Gránulos Friables</option>
                  <option value="dust_coarse">Polvo Grueso</option>
                  <option value="dust_fine">Polvo Fino</option>
                  <option value="dust_extreme">
                    Polvo Extremadamente Fino
                  </option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Dilución (%)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="100% si puro"
                value={formData.stoffenmanager?.dilutionPercent || 100}
                onChange={(e) =>
                  updateStoffenmanager(
                    "dilutionPercent",
                    Number(e.target.value),
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* 2. ACTIVITY & HANDLING */}
        <div className="p-4 bg-gray-50 rounded mb-4 border border-gray-200">
          <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">
            2. Manipulación (Clase de Actividad)
          </h4>
          <label className="block text-sm font-medium mb-1">
            Tipo de Tarea
          </label>
          <select
            className="w-full p-2 border rounded"
            value={formData.stoffenmanager?.handlingType}
            onChange={(e) =>
              updateStoffenmanager("handlingType", e.target.value)
            }
          >
            <option value="A">
              Clase A: Tareas de muy baja energía (inspección)
            </option>
            <option value="B">
              Clase B: Tareas de baja energía (manipulación cuidadosa)
            </option>
            <option value="C">
              Clase C: Tareas de energía media (vertido manual)
            </option>
            <option value="D">
              Clase D: Tareas de alta energía (dispersión)
            </option>
            <option value="E">Clase E: Alta difusión / Spray</option>
          </select>
        </div>

        {/* 3. CONTROL MEASURES */}
        <div className="p-4 bg-gray-50 rounded mb-4 border border-gray-200">
          <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">
            3. Medidas de Control
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Control Local
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.stoffenmanager?.localControl}
                onChange={(e) =>
                  updateStoffenmanager("localControl", e.target.value)
                }
              >
                <option value="none">Ninguno</option>
                <option value="suppression">
                  Supresión (Agua/Nebulización)
                </option>
                <option value="local_extraction">
                  Extracción Localizada (LEV)
                </option>
                <option value="containment_no_extract">
                  Cerramiento sin extracción
                </option>
                <option value="containment_extraction">
                  Cabina/Cerramiento con extracción
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Ventilación General
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.stoffenmanager?.ventilationType}
                onChange={(e) =>
                  updateStoffenmanager("ventilationType", e.target.value)
                }
              >
                <option value="none">Sin ventilación específica</option>
                <option value="natural">
                  Ventilación Natural (Puertas/Ventanas)
                </option>
                <option value="mechanical">Ventilación Mecánica General</option>
                <option value="booth">Cabina de Pulverización</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Volumen Sala (m³)
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.stoffenmanager?.roomVolume}
                onChange={(e) =>
                  updateStoffenmanager("roomVolume", e.target.value)
                }
              >
                <option value="lt_100">&lt; 100 m³</option>
                <option value="100_1000">100 - 1000 m³</option>
                <option value="gt_1000">&gt; 1000 m³</option>
                <option value="outdoor">Exterior</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. DURATION & FREQUENCY */}
        <div className="p-4 bg-gray-50 rounded mb-4 border border-gray-200">
          <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">
            4. Tiempo de Exposición
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Frecuencia
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.stoffenmanager?.exposureFrequency}
                onChange={(e) =>
                  updateStoffenmanager("exposureFrequency", e.target.value)
                }
              >
                <option value="day_1">Diario</option>
                <option value="week_4_5">4-5 días/semana</option>
                <option value="week_2_3">2-3 días/semana</option>
                <option value="week_1">1 día/semana</option>
                <option value="month_1">1 día/mes</option>
                <option value="year_1">1 día/año</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Duración (por turno)
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.stoffenmanager?.exposureDuration}
                onChange={(e) =>
                  updateStoffenmanager("exposureDuration", e.target.value)
                }
              >
                <option value="min_15">&lt; 15 min</option>
                <option value="min_30">15 - 30 min</option>
                <option value="hour_2">30 min - 2 h</option>
                <option value="hour_4">2 - 4 h</option>
                <option value="hour_8">&gt; 4 h</option>
              </select>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setInternalStep(0)}
            style={{
              color: "#666",
              background: "none",
              border: "1px solid #ccc",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ← Atrás
          </button>
          <button
            onClick={calculateResults}
            style={{
              backgroundColor: "#0056b3",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
            }}
          >
            Calcular Nivel de Riesgo
          </button>
        </div>

        {result && result.stoffenmanagerResult && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              borderRadius: "8px",
              backgroundColor: result.isSafe ? "#f0fdf4" : "#fef2f2",
              border: `2px solid ${result.isSafe ? "#22c55e" : "#ef4444"}`,
            }}
          >
            <h3
              style={{
                fontWeight: "bold",
                color: result.isSafe ? "#15803d" : "#b91c1c",
              }}
            >
              {result.isSafe
                ? `PRIORIDAD BAJA (${result.stoffenmanagerResult.riskPriority})`
                : `PRIORIDAD ALTA (${result.stoffenmanagerResult.riskPriority})`}
            </h3>
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                fontSize: "0.9rem",
              }}
            >
              <div className="bg-white p-2 rounded border">
                <strong>Puntuación Exposición:</strong>{" "}
                {result.stoffenmanagerResult.exposureScore}
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>Banda de Exposición:</strong>{" "}
                {result.stoffenmanagerResult.exposureBand}
              </div>
            </div>
            <p style={{ marginTop: "1rem" }}>
              {result.justification.technical}
            </p>
            <button
              onClick={onNext}
              style={{
                marginTop: "1rem",
                background: "#2563eb",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
              }}
            >
              Ver Informe
            </button>
          </div>
        )}
      </StepCard>
    );
  }

  return <div>Error State</div>;
};
