/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Info,
  FileText,
  FlaskConical,
  Wind,
  Clock,
  Play,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
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
        icon={<FlaskConical className="w-6 h-6" />}
      >
        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* LEFT COL: TECHNICAL DATA CARD */}
          <div className="space-y-6">
            {richData ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {richData.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">
                          CAS: {richData.cas}
                        </span>
                        <span>{richData.notes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-2 gap-4">
                  {/* VLA-ED CARD */}
                  <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100 relative group hover:border-blue-300 transition-colors">
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      VLA-ED (Diario)
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {richData.vla.ed_mg}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        mg/m³
                      </span>
                    </div>
                    {richData.vla.ed_ppm && (
                      <span className="text-xs text-gray-400 font-mono mt-1 block">
                        ({richData.vla.ed_ppm} ppm)
                      </span>
                    )}
                  </div>

                  {/* VLA-EC CARD */}
                  {richData.vla.ec_mg && (
                    <div className="bg-orange-50/30 rounded-lg p-4 border border-orange-100 relative group hover:border-orange-300 transition-colors">
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-400"></span>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        VLA-EC (Corto)
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {richData.vla.ec_mg}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          mg/m³
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Info className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-amber-900 mb-1">
                  Sin Datos Específicos
                </h4>
                <p className="text-sm text-amber-800">
                  No se ha encontrado ficha técnica para "{substanceName}".
                </p>
              </div>
            )}

            {/* SAMPLING CONFIG FORM */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h4 className="font-bold text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FlaskConical className="w-5 h-5 text-gray-400" />
                Configuración de Muestreo
              </h4>

              <div className="space-y-5">
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Método de Referencia (MTA)
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1 group">
                      <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        placeholder="Ej: MTA/MA-062/A16"
                        value={
                          formData.stoffenmanager?.measurementStrategy
                            ?.technique ||
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
                    </div>
                    {richData?.sampling.methodUrl && (
                      <a
                        href={richData.sampling.methodUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-white border border-gray-200 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-200 flex items-center gap-2 text-sm font-semibold transition-all shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" /> PDF
                      </a>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Soporte de Captación
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                    value={
                      formData.stoffenmanager?.measurementStrategy
                        ?.samplingSupport ||
                      richData?.sampling.support ||
                      ""
                    }
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COL: VIDEO & EXTRAS */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Play className="w-5 h-5 text-red-500" />
                  Recurso Formativo
                </h4>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  INSST / APA
                </span>
              </div>

              <div className="flex-1 bg-gray-50 flex flex-col justify-center">
                {richData?.sampling.videoUrl ? (
                  <div className="aspect-video w-full bg-black relative group">
                    <iframe
                      className="w-full h-full"
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
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <Play className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No hay vídeo disponible</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-3 text-xs">
                  <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                    <span className="block font-bold text-gray-500 mb-1 flex justify-center gap-1">
                      <Wind className="w-3 h-3" /> Caudal
                    </span>
                    <span className="text-lg font-bold text-blue-700">
                      {richData?.sampling.flowRate || "-"}
                    </span>
                  </div>
                  <div className="flex-1 bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                    <span className="block font-bold text-gray-500 mb-1 flex justify-center gap-1">
                      <Clock className="w-3 h-3" /> Tiempo
                    </span>
                    <span className="text-lg font-bold text-purple-700">
                      {richData?.sampling.minTime || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-between pt-6 border-t border-gray-100 mt-auto">
          <button
            onClick={() => setInternalStep(3)}
            className="flex items-center gap-2 px-6 py-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all rounded-lg font-medium shadow-sm"
          >
            ← Volver
          </button>
          <button
            onClick={() => setInternalStep(5)}
            className="bg-[#009bdb] hover:bg-[#0077a8] text-white px-8 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-bold tracking-wide"
          >
            <ShieldCheck className="w-4 h-4" />
            Confirmar Estrategia
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
