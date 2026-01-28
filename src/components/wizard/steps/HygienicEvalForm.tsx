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
            onClick={() => setInternalStep(2)}
            className="step4-btn-confirm"
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
            className="step4-btn-back"
          >
            ← Atrás
          </button>
          <button
            onClick={() => {
              // Proceed to Strategy (Step 4) regardless of method
              setInternalStep(4);
            }}
            className="step4-btn-confirm"
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

            {/* Assuming Dilution is needed but not shown in screenshot? Screenshot shows only Physical State and Vapour P.
                     I will keep Dilution as it is critical for calculations, maybe as a 3rd field or row?
                     Screenshot shows 2 columns. I will put it below or hide if implicit?
                     Better to keep it for correctness, maybe alongside or below.
                     Actually, I'll add it to the grid to be safe.
                  */}
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
            <div className="step4-card animate-fadeIn">
              <div className="step4-card-header">
                <div className="flex items-center gap-3">
                  <div className="step4-icon-circle">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="step4-title">
                      {richData?.name || substanceName}
                    </h4>
                    {richData && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="step4-pill">CAS: {richData.cas}</span>
                        <span className="step4-pill">
                          VLA: {richData.vla} mg/m³
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="step4-card-body">
                <div className="step4-input-group">
                  <label className="step4-label">Soporte de Captación</label>
                  <input
                    type="text"
                    className="step4-input"
                    readOnly
                    value={
                      formData.stoffenmanager?.measurementStrategy
                        ?.samplingSupport ||
                      richData?.sampling.support ||
                      "Filtro de Membrana"
                    }
                  />
                </div>
                {richData?.sampling.method && (
                  <div className="step4-input-group">
                    <label className="step4-label">Método Recomendado</label>
                    <div className="p-3 bg-gray-50 border rounded text-sm text-gray-700 font-medium">
                      {richData.sampling.method}
                    </div>
                  </div>
                )}
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
                <span className="step4-pill bg-blue-50 text-blue-600 border-blue-100">
                  INSST / APA
                </span>
              </div>

              <div className="flex-1 bg-gray-50 flex flex-col justify-center min-h-[200px]">
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
                    <div className="step4-icon-circle bg-gray-100 text-gray-400">
                      <Play className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium">Video no disponible</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                <div className="step4-footer-stats">
                  <div className="step4-stat-box blue">
                    <span className="step4-subtitle flex justify-center mb-1">
                      <Wind className="w-3 h-3 mr-1" /> Caudal
                    </span>
                    <span className="step4-title text-blue-700 justify-center">
                      {richData?.sampling.flowRate || "-"}
                    </span>
                  </div>
                  <div className="step4-stat-box purple">
                    <span className="step4-subtitle flex justify-center mb-1">
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

        <div className="step4-actions">
          <button onClick={() => setInternalStep(2)} className="step4-btn-back">
            ← Volver
          </button>
          <button
            onClick={() => setInternalStep(5)}
            className="step4-btn-confirm"
          >
            Siguiente: Tipo de Exposición →
          </button>
        </div>
      </StepCard>
    );
  }

  // --- RENDER: STEP 5 - TIPO DE EXPOSICIÓN (Recuperado) ---
  if (internalStep === 5) {
    return (
      <div className="p-4 bg-white border rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          4. Tipo de Exposición (Debug Raw)
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Seleccione el patrón de exposición:
          </h4>

          <div className="space-y-4">
            <div
              onClick={() =>
                setFormData((prev) => ({ ...prev, strategyType: "continuous" }))
              }
              className={`p-4 border-2 rounded-lg cursor-pointer ${
                formData.strategyType === "continuous"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              Continuous
            </div>
          </div>
        </div>

        <div className="step4-actions mt-4">
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
      </div>
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
