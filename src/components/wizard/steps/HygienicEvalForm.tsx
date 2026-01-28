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
            onClick={() => {
              if (evaluationMethod === "advanced") {
                setInternalStep(3); // Back to Stoffenmanager
              } else {
                setInternalStep(1); // Back to Simplified
              }
            }}
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
              // Proceed to Strategy (Step 4) regardless of method
              setInternalStep(4);
            }}
            style={{
              backgroundColor: "#0056b3",
              color: "white",
              padding: "0.5rem 1.5rem",
              borderRadius: "6px",
            }}
          >
            Siguiente: Estrategia de Medición →
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
        icon={<FlaskConical className="w-6 h-6" />}
      >
        <div className="space-y-6">
          {/* 1. EMISSION POTENTIAL */}
          <div className="step4-card animate-fadeIn">
            <div className="step4-card-header">
              <h4 className="step4-title">
                <div
                  className="step4-icon-circle"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#eff6ff",
                  }}
                >
                  <FlaskConical className="w-4 h-4" />
                </div>
                1. Fuente e Intrínseca
              </h4>
            </div>
            <div className="step4-card-body">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="step4-input-group">
                  <label className="step4-label">Estado Físico</label>
                  <select
                    className="step4-select"
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
                  <div className="step4-input-group">
                    <label className="step4-label">Presión de Vapor (Pa)</label>
                    <input
                      type="number"
                      className="step4-input"
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
                  <div className="step4-input-group">
                    <label className="step4-label">
                      Pulverulencia (Dustiness)
                    </label>
                    <select
                      className="step4-select"
                      value={formData.stoffenmanager?.dustiness}
                      onChange={(e) =>
                        updateStoffenmanager("dustiness", e.target.value)
                      }
                    >
                      <option value="solid_objects">
                        Objetos Sólidos (No polvo)
                      </option>
                      <option value="granules_firm">Gránulos Firmes</option>
                      <option value="granules_friable">
                        Gránulos Friables
                      </option>
                      <option value="dust_coarse">Polvo Grueso</option>
                      <option value="dust_fine">Polvo Fino</option>
                      <option value="dust_extreme">
                        Polvo Extremadamente Fino
                      </option>
                    </select>
                  </div>
                )}

                <div className="step4-input-group">
                  <label className="step4-label">Dilución (%)</label>
                  <div className="step4-input-wrapper">
                    <input
                      type="number"
                      className="step4-input"
                      placeholder="100% si puro"
                      value={formData.stoffenmanager?.dilutionPercent || 100}
                      onChange={(e) =>
                        updateStoffenmanager(
                          "dilutionPercent",
                          Number(e.target.value),
                        )
                      }
                    />
                    <span className="absolute right-3 text-gray-400 text-sm font-medium">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. HANDLING */}
          <div
            className="step4-card animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="step4-card-header">
              <h4 className="step4-title">
                <div
                  className="step4-icon-circle"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#f3e8ff",
                    color: "#7e22ce",
                  }}
                >
                  <Info className="w-4 h-4" />
                </div>
                2. Manipulación (Clase de Actividad)
              </h4>
            </div>
            <div className="step4-card-body">
              <div className="step4-input-group" style={{ marginBottom: 0 }}>
                <label className="step4-label">Tipo de Tarea</label>
                <select
                  className="step4-select"
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
            </div>
          </div>

          {/* 3. CONTROLS */}
          <div
            className="step4-card animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="step4-card-header">
              <h4 className="step4-title">
                <div
                  className="step4-icon-circle"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#dcfce7",
                    color: "#15803d",
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                3. Medidas de Control
              </h4>
            </div>
            <div className="step4-card-body">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="step4-input-group">
                  <label className="step4-label">Control Local</label>
                  <select
                    className="step4-select"
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
                <div className="step4-input-group">
                  <label className="step4-label">Ventilación General</label>
                  <select
                    className="step4-select"
                    value={formData.stoffenmanager?.ventilationType}
                    onChange={(e) =>
                      updateStoffenmanager("ventilationType", e.target.value)
                    }
                  >
                    <option value="none">Sin ventilación específica</option>
                    <option value="natural">
                      Ventilación Natural (Puertas/Ventanas)
                    </option>
                    <option value="mechanical">
                      Ventilación Mecánica General
                    </option>
                    <option value="booth">Cabina de Pulverización</option>
                  </select>
                </div>
                <div className="step4-input-group">
                  <label className="step4-label">Volumen Sala (m³)</label>
                  <select
                    className="step4-select"
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
          </div>

          {/* 4. DURATION & FREQUENCY */}
          <div
            className="step4-card animate-fadeIn"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="step4-card-header">
              <h4 className="step4-title">
                <div
                  className="step4-icon-circle"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#ffedd5",
                    color: "#c2410c",
                  }}
                >
                  <Clock className="w-4 h-4" />
                </div>
                4. Tiempo de Exposición
              </h4>
            </div>
            <div className="step4-card-body">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="step4-input-group">
                  <label className="step4-label">Frecuencia</label>
                  <select
                    className="step4-select"
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
                <div className="step4-input-group">
                  <label className="step4-label">Duración (por turno)</label>
                  <select
                    className="step4-select"
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
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="step4-actions">
          <button onClick={() => setInternalStep(0)} className="step4-btn-back">
            ← Volver
          </button>
          <button
            onClick={() => {
              calculateResults();
              setInternalStep(2); // Next is GES (Step 2)
            }}
            className="step4-btn-confirm"
          >
            Siguiente: GES →
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
        title="3. Estrategia de Medición (UNE-EN 689)"
        description="Requisitos Técnicos de Muestreo y Análisis"
        icon={<FlaskConical className="w-6 h-6" />}
      >
        <div className="step4-layout">
          {/* LEFT COL: TECHNICAL DATA & CONFIG */}
          <div className="space-y-6">
            {/* TECHNICAL DATA CARD */}
            {richData ? (
              <div className="step4-card animate-fadeIn">
                <div className="step4-card-header">
                  <div className="flex items-center gap-3">
                    <div className="step4-icon-circle">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="step4-title">{richData.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="step4-pill">CAS: {richData.cas}</span>
                        <span
                          className="step4-subtitle"
                          style={{ margin: 0, fontWeight: 400 }}
                        >
                          {richData.notes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="step4-card-body">
                  <div className="step4-metric-grid">
                    {/* VLA-ED CARD */}
                    <div className="step4-metric-card blue">
                      <span className="step4-metric-dot blue"></span>
                      <span className="step4-metric-label">
                        VLA-ED (Diario)
                      </span>
                      <div>
                        <span className="step4-metric-value">
                          {richData.vla.ed_mg}
                        </span>
                        <span className="step4-metric-unit">mg/m³</span>
                      </div>
                      {richData.vla.ed_ppm && (
                        <span className="text-xs text-gray-400 block mt-1">
                          ({richData.vla.ed_ppm} ppm)
                        </span>
                      )}
                    </div>

                    {/* VLA-EC CARD */}
                    {richData.vla.ec_mg && (
                      <div className="step4-metric-card orange">
                        <span className="step4-metric-dot orange"></span>
                        <span className="step4-metric-label">
                          VLA-EC (Corto)
                        </span>
                        <div>
                          <span className="step4-metric-value">
                            {richData.vla.ec_mg}
                          </span>
                          <span className="step4-metric-unit">mg/m³</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="step4-card"
                style={{ backgroundColor: "#fffbeb", borderColor: "#fcd34d" }}
              >
                <div className="step4-card-body text-center">
                  <div
                    className="step4-icon-circle"
                    style={{
                      backgroundColor: "#fef3c7",
                      color: "#d97706",
                      margin: "0 auto 1rem",
                    }}
                  >
                    <Info className="w-6 h-6" />
                  </div>
                  <h4
                    className="step4-title"
                    style={{ justifyContent: "center", color: "#92400e" }}
                  >
                    Sin Datos Específicos
                  </h4>
                  <p className="text-sm text-amber-800 mt-2">
                    No se ha encontrado ficha técnica para "{substanceName}".
                  </p>
                </div>
              </div>
            )}

            {/* SAMPLING CONFIG FORM */}
            <div className="step4-card">
              <div className="step4-card-body">
                <h4 className="step4-title mb-4 border-b border-gray-100 pb-2">
                  <FlaskConical className="w-5 h-5 text-gray-400" />
                  Configuración de Muestreo
                </h4>

                <div className="step4-input-group">
                  <label className="step4-label">
                    Método de Referencia (MTA)
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 step4-input-wrapper">
                      <FileText className="step4-input-icon" />
                      <input
                        type="text"
                        className="step4-input"
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
                        className="step4-btn-pdf"
                      >
                        <ExternalLink className="w-4 h-4" /> PDF
                      </a>
                    )}
                  </div>
                </div>

                <div className="step4-input-group">
                  <label className="step4-label">Soporte de Captación</label>
                  <input
                    type="text"
                    className="step4-input"
                    style={{ paddingLeft: "0.75rem" }}
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
            <div className="step4-card h-full flex flex-col">
              <div className="step4-card-header">
                <h4 className="step4-title">
                  <Play className="w-5 h-5 text-red-500" />
                  Recurso Formativo
                </h4>
                <span
                  className="step4-pill"
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    borderColor: "#dbeafe",
                  }}
                >
                  INSST / APA
                </span>
              </div>

              <div
                className="flex-1 bg-gray-50 flex flex-col justify-center"
                style={{ minHeight: "200px" }}
              >
                {richData?.sampling.videoUrl ? (
                  <div className="step4-video-container group">
                    <iframe
                      className="step4-video-frame"
                      src={richData.sampling.videoUrl.replace(
                        "youtu.be/",
                        "www.youtube.com/embed/",
                      )}
                      title="Video Técnica de Muestreo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="step4-video-placeholder">
                    <div
                      className="step4-icon-circle"
                      style={{ backgroundColor: "#f3f4f6", color: "#9ca3af" }}
                    >
                      <Play className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium">Video no disponible</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                <div className="step4-footer-stats">
                  <div className="step4-stat-box blue">
                    <span className="step4-subtitle flex-center mb-1">
                      <Wind className="w-3 h-3 mr-1" /> Caudal
                    </span>
                    <span className="step4-title text-blue-700 justify-center">
                      {richData?.sampling.flowRate || "-"}
                    </span>
                  </div>
                  <div className="step4-stat-box purple">
                    <span className="step4-subtitle flex-center mb-1">
                      <Clock className="w-3 h-3 mr-1" /> Tiempo
                    </span>
                    <span className="step4-title text-purple-700 justify-center">
                      {richData?.sampling.minTime || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="step4-actions">
          <button onClick={() => setInternalStep(2)} className="step4-btn-back">
            ← Volver
          </button>
          <button
            onClick={() => setInternalStep(5)}
            className="step4-btn-confirm"
          >
            <ShieldCheck className="w-4 h-4" />
            Siguiente: Tipo de Exposición →
          </button>
        </div>
      </StepCard>
    );
  }

  // --- RENDER: STEP 5 - TIPO DE EXPOSICIÓN (Recuperado) ---
  if (internalStep === 5) {
    return (
      <StepCard
        title="4. Tipo de Exposición"
        description="Caracterización temporal de la exposición"
        icon={<Wind className="w-6 h-6" />}
      >
        <div className="step4-layout">
          <div className="step4-card animate-fadeIn">
            <div className="step4-card-header">
              <h4 className="step4-title">
                Seleccione el patrón de exposición
              </h4>
            </div>
            <div className="step4-card-body">
              <div className="grid gap-4">
                <label
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.strategyType === "continuous" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      className="w-5 h-5 text-blue-600"
                      name="strategyType"
                      checked={
                        formData.strategyType === "continuous" ||
                        !formData.strategyType
                      }
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          strategyType: "continuous",
                        }))
                      }
                    />
                    <div>
                      <h5 className="font-bold text-gray-900">
                        Exposición Continua (ED)
                      </h5>
                      <p className="text-sm text-gray-500">
                        La exposición se mantiene relativamente constante
                        durante toda la jornada laboral.
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.strategyType === "variable" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      className="w-5 h-5 text-purple-600"
                      name="strategyType"
                      checked={formData.strategyType === "variable"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          strategyType: "variable",
                        }))
                      }
                    />
                    <div>
                      <h5 className="font-bold text-gray-900">
                        Exposición Variable (ED + EC)
                      </h5>
                      <p className="text-sm text-gray-500">
                        Existen picos, tareas intermitentes o variaciones
                        significativas en la concentración.
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.strategyType === "peaks" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      className="w-5 h-5 text-orange-600"
                      name="strategyType"
                      checked={formData.strategyType === "peaks"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          strategyType: "peaks",
                        }))
                      }
                    />
                    <div>
                      <h5 className="font-bold text-gray-900">
                        Tarea Puntual / Picos
                      </h5>
                      <p className="text-sm text-gray-500">
                        Exposición de muy corta duración donde lo crítico es el
                        valor techo (VLA-EC).
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="step4-actions">
          <button onClick={() => setInternalStep(4)} className="step4-btn-back">
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

  // --- RENDER: STEP 6 - RESULTADOS DE MEDICIÓN ---
  if (internalStep === 6) {
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
            onClick={() => setInternalStep(5)}
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
