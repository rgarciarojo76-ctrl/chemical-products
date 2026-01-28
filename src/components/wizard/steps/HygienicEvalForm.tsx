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
import { INSST_DATABASE } from "../../../data/insstDatabase";

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
              } else {
                // Determine result locally without waiting for state update if possible,
                // but calling calculateResults() triggers the internal logic.
                // We'll trust onNext() to handle the transition.
                calculateResults();
                onNext();
              }
            }}
            style={{
              backgroundColor: "#0056b3",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
            }}
          >
            Continuar →
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
            onClick={() => {
              // Calculate logic needed for state, but navigation goes to Step 4
              calculateResults();
              setInternalStep(4);
            }}
            style={{
              backgroundColor: "#0056b3",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
            }}
          >
            Siguiente: Plan de Medición →
          </button>
        </div>
      </StepCard>
    );
  }

  // --- RENDER: STEP 4 - ESTRATEGIA DE MEDICIÓN (MTA / UNE-EN 689) ---
  if (internalStep === 4) {
    const substanceName =
      formData.stoffenmanager?.productName || "Agente Desconocido";

    // Lookup logic for INSST Database (capitalization agnostic)
    let richData: any = null;
    const dbKeys = Object.keys(INSST_DATABASE);
    const matchKey = dbKeys.find((k) =>
      substanceName.toLowerCase().includes(k.toLowerCase()),
    );

    if (matchKey) {
      richData = INSST_DATABASE[matchKey];
    }

    return (
      <StepCard
        title="4. Estrategia de Medición (UNE-EN 689)"
        description="Requisitos Técnicos de Muestreo y Análisis"
        icon="🔬"
      >
        {richData ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-1">
                  Ficha Técnica Oficial: {richData.name}
                </h4>
                <p className="text-sm text-blue-700 mb-2">
                  CAS: {richData.cas} | Notas: {richData.notes}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-white p-2 rounded border border-blue-100 shadow-sm">
                    <span className="block text-xs font-bold text-gray-500 uppercase">
                      VLA-ED (Diario)
                    </span>
                    <span className="text-xl font-bold text-gray-800">
                      {richData.vla.ed_mg} mg/m³
                    </span>
                    {richData.vla.ed_ppm && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({richData.vla.ed_ppm} ppm)
                      </span>
                    )}
                  </div>
                  {richData.vla.ec_mg && (
                    <div className="bg-white p-2 rounded border border-blue-100 shadow-sm">
                      <span className="block text-xs font-bold text-gray-500 uppercase">
                        VLA-EC (Corto)
                      </span>
                      <span className="text-xl font-bold text-gray-800">
                        {richData.vla.ec_mg} mg/m³
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <p className="text-yellow-800 text-sm">
              ⚠️ No se ha encontrado ficha técnica específica en la base de
              datos interna para "{substanceName}". Por favor, configure los
              parámetros manualmente según la FDS o la web del INSST.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="order-2 md:order-1">
            <div className="p-4 bg-gray-50 rounded mb-4 border border-gray-200">
              <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">
                Configuración de Muestreo
              </h4>
              <div className="form-group mb-3">
                <label className="block text-sm font-medium mb-1">
                  Método de Referencia (MTA)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-gray-50"
                    placeholder="Ej: MTA/MA-062/A16"
                    value={
                      formData.stoffenmanager?.measurementStrategy?.technique ||
                      richData?.sampling.method ||
                      ""
                    }
                    onChange={(e) =>
                      updateStoffenmanager("measurementStrategy", {
                        ...formData.stoffenmanager?.measurementStrategy,
                        technique: e.target.value,
                      })
                    }
                  />
                  {richData?.sampling.methodUrl && (
                    <a
                      href={richData.sampling.methodUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white border text-blue-600 px-3 py-2 rounded hover:bg-blue-50 flex items-center gap-1 text-sm font-bold whitespace-nowrap"
                      title="Ver PDF Oficial"
                    >
                      📄 PDF
                    </a>
                  )}
                </div>
              </div>
              <div className="form-group mb-3">
                <label className="block text-sm font-medium mb-1">
                  Soporte de Captación
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={
                    formData.stoffenmanager?.measurementStrategy
                      ?.samplingSupport ||
                    richData?.sampling.support ||
                    ""
                  }
                  onChange={(e) =>
                    updateStoffenmanager("measurementStrategy", {
                      ...formData.stoffenmanager?.measurementStrategy,
                      samplingSupport: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group mb-3">
                <label className="block text-sm font-medium mb-1">
                  Técnica Analítica
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={
                    formData.stoffenmanager?.measurementStrategy?.labAnalysis ||
                    richData?.sampling.technique ||
                    ""
                  }
                  onChange={(e) =>
                    updateStoffenmanager("measurementStrategy", {
                      ...formData.stoffenmanager?.measurementStrategy,
                      labAnalysis: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Caudal (L/min)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Ej: 0.2"
                    defaultValue={richData?.sampling.flowRate}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Volumen Mín.
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Ej: 120 min"
                    defaultValue={richData?.sampling.minTime}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* VIDEO COLUMN */}
          <div className="order-1 md:order-2">
            {richData?.sampling.videoUrl ? (
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-black">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    width="100%"
                    height="250"
                    src={richData.sampling.videoUrl.replace(
                      "youtu.be/",
                      "www.youtube.com/embed/",
                    )}
                    title="Video Técnica de Muestreo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3 bg-gray-900 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Video Formativo APA
                  </p>
                  <p className="font-medium text-sm">
                    Técnica de Muestreo: {richData.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[200px] flex items-center justify-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 flex-col gap-2 p-6 text-center">
                <span className="text-4xl">🎬</span>
                <p className="text-sm">
                  Video de técnica de muestreo no disponible para este agente.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setInternalStep(3)}
            className="text-gray-600 border border-gray-300 px-4 py-2 rounded"
          >
            ← Atrás
          </button>
          <button
            onClick={() => setInternalStep(5)}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow-lg hover:bg-blue-700 transition-colors"
          >
            Confirmar Estrategia y Continuar →
          </button>
        </div>
      </StepCard>
    );
  }

  // --- RENDER: STEP 5 - RESULTADOS DE MEDICIÓN (Measurement Results) ---
  if (internalStep === 5) {
    const strategy = formData.stoffenmanager?.measurementStrategy;
    const vla = strategy?.vlaValue || 1;
    const conc = formData.stoffenmanager?.measurementResult?.concentration || 0;
    const index = conc / vla;

    let trafficLightColor = "#ef4444"; // Red
    if (index <= 0.1)
      trafficLightColor = "#22c55e"; // Green
    else if (index <= 1) trafficLightColor = "#eab308"; // Yellow

    return (
      <StepCard
        title="5. Resultados de la Medición"
        description="Evaluación de la conformidad (Índice I)"
        icon="📊"
      >
        <div className="p-4 bg-blue-50 rounded mb-4 border border-blue-200">
          <div className="flex justify-between items-center">
            <span>VLA de Referencia:</span>
            <span className="font-bold">{vla} mg/m³</span>
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="block text-sm font-bold mb-1">
            Concentración Ambiental (C) [mg/m³]
          </label>
          <input
            type="number"
            className="w-full p-3 border rounded text-lg"
            placeholder="Introducir valor del laboratorio..."
            value={
              formData.stoffenmanager?.measurementResult?.concentration || ""
            }
            onChange={(e) => {
              const val = Number(e.target.value);
              const idx = val / vla;
              updateStoffenmanager("measurementResult", {
                concentration: val,
                complianceIndex: idx,
                isCompliant: idx <= 1,
                nextCheckDate:
                  idx <= 0.1
                    ? "3 años"
                    : idx <= 0.5
                      ? "1 año"
                      : "Inmediato (Corrección)",
              });
            }}
          />
        </div>

        {formData.stoffenmanager?.measurementResult && (
          <div
            className="p-6 rounded-lg border text-center mt-6"
            style={{
              backgroundColor: trafficLightColor + "20",
              borderColor: trafficLightColor,
            }}
          >
            <h2
              className="text-2xl font-bold"
              style={{ color: trafficLightColor }}
            >
              Índice I = {index.toFixed(3)}
            </h2>
            <p className="text-lg font-semibold mt-2">
              {index <= 1
                ? "✅ CONFORME (Exposición Aceptable)"
                : "❌ NO CONFORME (Exposición Inaceptable)"}
            </p>
            <div className="mt-4 text-sm text-gray-700 bg-white p-3 rounded">
              <strong>Acción Requerida:</strong>
              <br />
              {index <= 0.1
                ? "Mantener condiciones. Reevaluar en 3 años."
                : index <= 1
                  ? "Mejorar medidas preventivas. Reevaluar periódicamente."
                  : "🛑 PARADA / CORRECCIÓN INMEDIATA. Implementar medidas urgentes."}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setInternalStep(4)}
            className="text-gray-600 border border-gray-300 px-4 py-2 rounded"
          >
            ← Atrás
          </button>
          <button
            onClick={onNext}
            className="bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2"
          >
            Ver Informe Final de Higiene ✨
          </button>
        </div>
      </StepCard>
    );
  }

  return <div>Error State</div>;
};
