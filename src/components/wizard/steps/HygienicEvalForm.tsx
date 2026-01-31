/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  FileText,
  FlaskConical,
  Wind,
  Clock,
  Microscope,
  Video,
  Info,
} from "lucide-react";
import { StepCard } from "../../ui/StepCard";
import { BasicCharacterizationStep } from "./BasicCharacterizationStep";
import { GesConstitutionStep } from "./GesConstitutionStep";
import { MeasurementResultsStep } from "./MeasurementResultsStep";
import { ClosedSystemStep } from "./ClosedSystemStep";
import { calculateStoffenmanager } from "../../../utils/stoffenmanagerLogic";
import type {
  HygienicEvalInput,
  HygienicAssessment,
  HazardInput,
  StoffenmanagerInput,
} from "../../../types";
import { INSST_DATABASE } from "../../../data/insstDatabase";
import "./HygienicStep4.css";

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
  // 4: ESTRATEGIA INTEGRADA (Exposición + Medición)
  // 6: RESULTADOS (Saltamos el 5 antiguo)
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
      stoffenmanager: {
        // Initialize with defaults to avoid null checks on strategyType
        strategyType: undefined,
      } as any,
    },
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
          strategyType: undefined, // Ensure field exists
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
      calculateStoffenmanager(formData.stoffenmanager);
    } else {
      onAnalyze(formData);
    }
  };

  // DEBUG LOG
  console.log("HygienicEvalForm Render: internalStep =", internalStep);

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
            <button onClick={onBack} className="step4-btn-back">
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
          <button onClick={() => setInternalStep(0)} className="step4-btn-back">
            ← Atrás
          </button>
          <button
            onClick={() => setInternalStep(8)}
            className="step4-btn-confirm"
          >
            Siguiente: Sistemas Cerrados →
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: STEP 8 - CLOSED SYSTEM (Art. 5.2) ---
  if (internalStep === 8) {
    return (
      <ClosedSystemStep
        initialData={formData.closedSystem}
        onUpdate={(data) =>
          setFormData((prev) => ({ ...prev, closedSystem: data }))
        }
        onBack={() => setInternalStep(1)}
        onNext={() => setInternalStep(2)} // Continue to GES
      />
    );
  }

  // --- RENDER: STEP 2 - GES (Grupos de Exposición Similar) ---
  if (internalStep === 2) {
    return (
      <GesConstitutionStep
        basicCharData={formData.basicCharacterization}
        evaluationMethod={evaluationMethod}
        stoffenmanagerData={formData.stoffenmanager}
        substanceName={
          hazardData?.substanceName ||
          formData.stoffenmanager?.productName ||
          "Agente Químico"
        }
        initialData={formData.ges}
        onUpdate={(data) => setFormData((prev) => ({ ...prev, ges: data }))}
        onNext={() => {
          // Proceed to Strategy (Step 4) regardless of method
          setInternalStep(4);
        }}
        onBack={() => setInternalStep(evaluationMethod === "advanced" ? 3 : 1)} // Back to Basic Characterization or Stoffenmanager
      />
    );
  }

  // --- RENDER: STEP 3 - STOFFENMANAGER (Full Implementation) ---
  if (internalStep === 3) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeIn">
        {/* HEADER: 2. Caracterización Básica... */}
        <h3 className="stoff-header-title">
          2. Caracterización Básica (Avanzada: Stoffenmanager®)
        </h3>

        {/* SECTION A: Identificación y Estado (Gray) */}
        <div className="stoff-gray-box">
          <h4 className="stoff-section-title">A. Identificación y Estado</h4>
          <div className="stoff-grid-2">
            <div>
              <label className="stoff-label">Estado Físico</label>
              <select
                className="stoff-control"
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
                <label className="stoff-label">Presión de Vapor (Pa)</label>
                <input
                  type="number"
                  className="stoff-control"
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
                <label className="stoff-label">Pulverulencia (Dustiness)</label>
                <select
                  className="stoff-control"
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
          </div>
        </div>

        {/* SECTION B: Tipo de Manipulación (Gray) */}
        <div className="stoff-gray-box">
          <h4 className="stoff-section-title">
            B. Tipo de Manipulación (Tarea)
          </h4>
          <select
            className="stoff-control"
            value={formData.stoffenmanager?.handlingType}
            onChange={(e) =>
              updateStoffenmanager("handlingType", e.target.value)
            }
          >
            <option value="A">
              Class A: Tarea pasiva (almacenamiento, inspección)
            </option>
            <option value="B">Class B: Manipulación cuidadosa</option>
            <option value="C">Class C: Vertido manual / Carga</option>
            <option value="D">Class D: Alta energía / Dispersión</option>
            <option value="E">Class E: Spray / Alta difusión</option>
          </select>
        </div>

        {/* MIDDLE SECTION: BLUE Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LEFT BLUE BOX: CONTROLS */}
          <div className="stoff-blue-box">
            <div className="space-y-4">
              <div>
                <label className="stoff-label">Control local</label>
                <select
                  className="stoff-control"
                  value={formData.stoffenmanager?.localControl}
                  onChange={(e) =>
                    updateStoffenmanager("localControl", e.target.value)
                  }
                >
                  <option value="none">Sin control específico</option>
                  <option value="suppression">Supresión</option>
                  <option value="local_extraction">
                    Extracción Localizada
                  </option>
                  <option value="containment_no_extract">
                    Cerramiento sin extracción
                  </option>
                  <option value="containment_extraction">
                    Cabina con extracción
                  </option>
                </select>
              </div>
              <div>
                <label className="stoff-label">Volumen Sala</label>
                <select
                  className="stoff-control"
                  value={formData.stoffenmanager?.roomVolume}
                  onChange={(e) =>
                    updateStoffenmanager("roomVolume", e.target.value)
                  }
                >
                  <option value="lt_100">&lt; 100 m³ (Pequeña)</option>
                  <option value="100_1000">100 - 1000 m³ (Mediana)</option>
                  <option value="gt_1000">&gt; 1000 m³ (Grande)</option>
                  <option value="outdoor">Exterior</option>
                </select>
              </div>
              <div>
                <label className="stoff-label">Ventilación general</label>
                <select
                  className="stoff-control"
                  value={formData.stoffenmanager?.ventilationType}
                  onChange={(e) =>
                    updateStoffenmanager("ventilationType", e.target.value)
                  }
                >
                  <option value="none">Sin ventilación</option>
                  <option value="natural">Natural (Puertas/Ventanas)</option>
                  <option value="mechanical">Mecánica General</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT BLUE BOX: ORG & CLEANING */}
          <div className="stoff-blue-box">
            <div className="space-y-4">
              <div>
                <label className="stoff-label">Frecuencia Limpieza</label>
                <div className="stoff-check-group">
                  <input
                    type="checkbox"
                    className="stoff-check-input"
                    checked={formData.stoffenmanager?.dailyCleaning}
                    onChange={(e) =>
                      updateStoffenmanager("dailyCleaning", e.target.checked)
                    }
                  />
                  <span className="text-sm text-gray-700">Limpieza diaria</span>
                </div>
              </div>

              <div>
                <label className="stoff-label">Mantenimiento Eq.</label>
                <div className="stoff-check-group">
                  <input
                    type="checkbox"
                    className="stoff-check-input"
                    checked={formData.stoffenmanager?.equipmentMaintenance}
                    onChange={(e) =>
                      updateStoffenmanager(
                        "equipmentMaintenance",
                        e.target.checked,
                      )
                    }
                  />
                  <span className="text-sm text-gray-700">
                    Plan preventivo riguroso
                  </span>
                </div>
              </div>

              <div>
                <label className="stoff-label">Segregación</label>
                <select
                  className="stoff-control"
                  value={formData.stoffenmanager?.workerSegregation}
                  onChange={(e) =>
                    updateStoffenmanager("workerSegregation", e.target.value)
                  }
                >
                  <option value="none">Trabajador junto a fuente</option>
                  <option value="cabin">Cabina de control</option>
                  <option value="isolated">Sala de control separada</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: YELLOW (Time & PPE) */}
        <div className="stoff-yellow-box">
          <div className="stoff-grid-3">
            <div>
              <label className="stoff-label">Duración Tarea</label>
              <select
                className="stoff-control"
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
            <div>
              <label className="stoff-label">Frecuencia</label>
              <select
                className="stoff-control"
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
              <label className="stoff-label">Uso de EPI</label>
              <div
                className="stoff-check-group"
                style={{ marginTop: "0.5rem" }}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={formData.stoffenmanager?.ppeUsed}
                  onChange={(e) =>
                    updateStoffenmanager("ppeUsed", e.target.checked)
                  }
                />
                <span className="text-sm text-gray-700 ml-2">
                  ¿Utiliza protección respiratoria?
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="step4-actions">
          <button onClick={() => setInternalStep(0)} className="step4-btn-back">
            ← Anterior
          </button>
          <button
            onClick={() => {
              calculateResults();
              setInternalStep(2); // Goes to GES
            }}
            className="step4-btn-confirm"
          >
            Calcular Riesgo y Continuar
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: STEP 4 - ESTRATEGIA (COMBINADO: Expo + Medición) ---
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

    // Fallback values if no DB match
    const samplingSupport =
      formData.stoffenmanager?.measurementStrategy?.samplingSupport ||
      richData?.sampling.support ||
      "Filtro de Membrana";
    const flowRate = richData?.sampling.flowRate || "2 L/min";
    const minTime = richData?.sampling.minTime || "60 min";

    return (
      <StepCard
        title="Estrategia de Muestreo y Exposición"
        description="Definición del perfil estratégico y métodos técnicos"
        icon={<FlaskConical className="w-6 h-6" />}
      >
        {/* SECTION 1: 3. TIPO DE EXPOSICIÓN (First as requested) */}
        <div className="mb-8 border-b pb-8 border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📉</span>
            <h3 className="text-lg font-bold text-gray-800">
              Tipo de Exposición (Perfil Temporal)
            </h3>
          </div>

          <div className="bg-[#fffbeb] border border-[#fcd34d] rounded-lg p-6">
            <label className="block text-[#92400e] font-semibold mb-2">
              ¿Cómo es el perfil de exposición temporal?
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded bg-white text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={formData.strategyType || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  strategyType: e.target.value as any,
                }))
              }
            >
              <option value="" disabled>
                Seleccione tipo de proceso...
              </option>
              <option value="continuous">
                Exposición Continua (Constante en jornada)
              </option>
              <option value="variable">
                Exposición Variable (Picos o cambios)
              </option>
              <option value="peaks">
                Tarea Puntual / Picos (Muy corta duración)
              </option>
            </select>

            {/* Strategy Logic Feedback */}
            {formData.strategyType && (
              <div className="mt-4 animate-fadeIn">
                <div className="bg-white/50 backdrop-blur-sm border border-orange-200 rounded-md p-4">
                  <h4 className="font-bold text-orange-800 mb-1 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Info className="w-4 h-4" /> Recomendación Técnica
                  </h4>
                  {formData.strategyType === "continuous" && (
                    <p className="text-orange-900 text-sm">
                      Recomendado: <strong>1 muestreo de larga duración</strong>{" "}
                      (mín. 80% jornada) o{" "}
                      <strong>3 muestras aleatorias</strong> de 2 horas (UNE-EN
                      689).
                    </p>
                  )}
                  {formData.strategyType === "variable" && (
                    <p className="text-orange-900 text-sm">
                      Recomendado: <strong>Muestreo Estratificado</strong>.
                      Identifique fases de alta exposición y muestree por
                      separado (min. 15 min).
                    </p>
                  )}
                  {formData.strategyType === "peaks" && (
                    <p className="text-orange-900 text-sm">
                      Recomendado: <strong>STEL (15 min)</strong>. Realizar
                      durante el momento de mayor actividad. Repetir 3 veces
                      para validar.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: 4. ESTRATEGIA DE MEDICIÓN (Second as requested) */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Estrategia de Medición (UNE-EN 689)
                </h3>
                <p className="text-sm text-gray-500">
                  Métodos de captación y análisis oficiales.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {richData?.sampling.methodUrl && (
                <a
                  href={richData.sampling.methodUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 border border-gray-200"
                >
                  <FileText className="w-3 h-3" /> Método INSST
                </a>
              )}
              {richData?.sampling.videoUrl && (
                <a
                  href={richData.sampling.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 border border-orange-200"
                >
                  <Video className="w-3 h-3" /> Vídeo Guía
                </a>
              )}
            </div>
          </div>

          {/* Premium 2x2 Metric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. SOPORTE */}
            <div className="group bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Soporte de Muestreo
                </p>
                <p className="font-bold text-gray-900 text-sm leading-tight">
                  {samplingSupport}
                </p>
              </div>
            </div>

            {/* 2. TÉCNICA */}
            <div className="group bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Microscope className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Técnica Analítica
                </p>
                <p className="font-bold text-gray-900 text-sm leading-tight">
                  {richData?.sampling.technique || "Cromatografía (HPLC)"}
                </p>
              </div>
            </div>

            {/* 3. CAUDAL */}
            <div className="group bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-5 hover:shadow-lg hover:border-cyan-200 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Wind className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Caudal de Bomba
                </p>
                <p className="font-bold text-gray-900 text-sm leading-tight">
                  {flowRate}
                </p>
              </div>
            </div>

            {/* 4. TIEMPO */}
            <div className="group bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-5 hover:shadow-lg hover:border-amber-200 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Tiempo Mín. Muestreo
                </p>
                <p className="font-bold text-gray-900 text-sm leading-tight">
                  {minTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="step4-actions mt-8">
          <button onClick={() => setInternalStep(2)} className="step4-btn-back">
            ← Volver
          </button>
          <button
            onClick={() => setInternalStep(6)}
            className="step4-btn-confirm"
          >
            Siguiente: Resultados →
          </button>
        </div>
      </StepCard>
    );
  }

  // --- RENDER: STEP 6 - RESULTADOS DE MEDICIÓN (UNE-EN 689) ---
  if (internalStep === 6) {
    return (
      <MeasurementResultsStep
        vlaReference={
          formData.vla ||
          hazardData?.vlaInfo?.vlaVal ||
          formData.stoffenmanager?.measurementStrategy?.vlaValue ||
          1.0
        }
        gesData={formData.ges}
        initialSamples={formData.en689Result?.samples}
        onUpdate={(result) => {
          setFormData((prev) => ({
            ...prev,
            en689Result: result,
          }));
        }}
        onBack={() => setInternalStep(4)}
        onNext={onNext}
      />
    );
  }

  return (
    <div className="p-8 text-center text-red-600 bg-red-50 rounded border border-red-200">
      <h3 className="text-xl font-bold">Error de Estado</h3>
      <p>Se ha alcanzado un paso no controlado: {internalStep}</p>
      <button
        onClick={() => setInternalStep(0)}
        className="mt-4 btn btn-secondary"
      >
        Volver al Inicio
      </button>
    </div>
  );
};
