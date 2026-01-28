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
  selectedCnae?: any;
  onShowReport?: (data?: any) => void;
}

export const HygienicEvalForm: React.FC<HygienicEvalFormProps> = ({
  onAnalyze,
  onNext,
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
      // Ensure defaults for Basic Char
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

  const [result, setResult] = useState<HygienicAssessment | null>(null);

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
          vapourPressure: 1000,
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
    const assessment = onAnalyze(formData);
    setResult(assessment);
  };

  // --- RENDER: METHOD SELECTION (Step 0) ---
  if (internalStep === 0) {
    return (
      <StepCard
        title="Módulo C: Selección de Metodología"
        description="Seleccione el nivel de profundidad para la evaluación higiénica."
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
              Evaluación Simplificada
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
              Evaluación Avanzada
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Algoritmo Stoffenmanager® completo.
            </p>
          </div>
        </div>
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
            }}
          >
            Back
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
            // This would map to something in formData, assuming schema supports it or reusing a field
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
            }}
          >
            Back
          </button>
          <button
            onClick={() =>
              evaluationMethod === "advanced"
                ? setInternalStep(3)
                : calculateResults()
            }
            style={{
              backgroundColor: "#0056b3",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
            }}
          >
            {evaluationMethod === "advanced"
              ? "Siguiente: Stoffenmanager →"
              : "Calcular Resultados"}
          </button>
        </div>
        {/* Display Results Here Only for Simplified if Calculated */}
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
            <h3>
              {result.isSafe
                ? "✅ RIESGO CONTROLADO"
                : "⚠️ RIESGO NO DESCARTABLE"}
            </h3>
            <p>{result.justification.technical}</p>
            <button
              onClick={onNext}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Ver Informe
            </button>
          </div>
        )}
      </StepCard>
    );
  }

  // --- RENDER: STEP 3 - STOFFENMANAGER (Advanced Only) ---
  if (internalStep === 3) {
    return (
      <StepCard
        title="3. Algoritmo Stoffenmanager®"
        description="Parámetros cuantitativos avanzados"
        icon="🧪"
      >
        {/* ... Only Advanced Fields ... */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Estado Físico
          </label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                checked={formData.stoffenmanager?.physicalState === "liquid"}
                onChange={() => updateStoffenmanager("physicalState", "liquid")}
              />{" "}
              Líquido
            </label>
            <label>
              <input
                type="radio"
                checked={formData.stoffenmanager?.physicalState === "solid"}
                onChange={() => updateStoffenmanager("physicalState", "solid")}
              />{" "}
              Sólido
            </label>
          </div>
        </div>
        {formData.stoffenmanager?.physicalState === "liquid" ? (
          <div className="mb-4">
            <label>Presión de Vapor (Pa)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={formData.stoffenmanager?.vapourPressure}
              onChange={(e) =>
                updateStoffenmanager("vapourPressure", Number(e.target.value))
              }
            />
          </div>
        ) : (
          <div className="mb-4">
            <label>Pulverulencia</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.stoffenmanager?.dustiness}
              onChange={(e) =>
                updateStoffenmanager("dustiness", e.target.value)
              }
            >
              <option value="solid_objects">Objetos Sólidos</option>
              <option value="fine_dust">Polvo Fino</option>
            </select>
          </div>
        )}

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setInternalStep(2)}
            style={{
              color: "#666",
              background: "none",
              border: "1px solid #ccc",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
            }}
          >
            Back
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
            Calcular Resultados
          </button>
        </div>

        {result && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              borderRadius: "8px",
              backgroundColor: result.isSafe ? "#f0fdf4" : "#fef2f2",
              border: `2px solid ${result.isSafe ? "#22c55e" : "#ef4444"}`,
            }}
          >
            <h3>
              {result.isSafe
                ? "✅ RIESGO CONTROLADO"
                : "⚠️ RIESGO NO DESCARTABLE"}
            </h3>
            <p>{result.justification.technical}</p>
            <button
              onClick={onNext}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
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
