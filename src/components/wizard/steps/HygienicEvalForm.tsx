/* eslint-disable */
import React, { useState, useEffect } from "react";
import { StepCard } from "../../ui/StepCard";
import type {
  HygienicEvalInput,
  HygienicAssessment,
  HazardInput,
  StoffenmanagerInput,
  StoffenmanagerResult,
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

  // 0: Info (1-2), 1: Stoffenmanager (3), 2: Strategy (4-5), 3: Results (6)
  const [internalStep, setInternalStep] = useState(0);

  // Auto-fill defaults
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

        // Defaults
        handlingType: "A",
        localControl: "none",
        roomVolume: "100_1000",
        ventilationType: "natural",
        dailyCleaning: false,
        equipmentMaintenance: false,
        workerSegregation: "none",
        ppeUsed: false,
        exposureDuration: "min_30",
        exposureFrequency: "year_1",
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

  const calculateStoffenmanager = (
    input: StoffenmanagerInput,
  ): StoffenmanagerResult => {
    // 1. Hazard Band
    let hazardBand: "A" | "B" | "C" | "D" | "E" = "A";
    const h = input.hPhrases || [];
    if (
      h.some((p) =>
        ["H340", "H350", "H350i", "H360", "H360FD", "H310", "H330"].includes(p),
      )
    )
      hazardBand = "E";
    else if (
      h.some((p) =>
        ["H351", "H341", "H361", "H331", "H311", "H301", "H372"].includes(p),
      )
    )
      hazardBand = "D";
    else if (
      h.some((p) => ["H332", "H312", "H302", "H314", "H373"].includes(p))
    )
      hazardBand = "C";
    else if (h.some((p) => ["H315", "H319", "H335", "H317"].includes(p)))
      hazardBand = "B";

    // 2. Emission
    let E = 0;
    if (input.physicalState === "liquid") {
      const vp = input.vapourPressure || 2300;
      const Pi = Math.min(Math.max(vp, 10), 30000);
      E = Pi / 30000;
    } else {
      const dustMap: Record<string, number> = {
        solid_objects: 0,
        granules_firm: 0.01,
        granules_friable: 0.03,
        dust_coarse: 0.1,
        dust_fine: 0.3,
        dust_extreme: 1.0,
      };
      E = dustMap[input.dustiness || "solid_objects"] || 0;
    }

    // 3. Handling
    let H_factor = 0.1;
    if (input.physicalState === "liquid") {
      const liquidH: Record<string, number> = {
        A: 0,
        B: 0.03,
        C: 0.1,
        D: 0.3,
        E: 1,
        F: 3,
        G: 3,
        H: 10,
      };
      H_factor = liquidH[input.handlingType] || 0.1;
    } else {
      const solidH: Record<string, number> = {
        A: 0,
        B: 0.03,
        C: 0.1,
        D: 0.3,
        E: 1,
        F: 3,
        G: 10,
        H: 30,
      };
      H_factor = solidH[input.handlingType] || 0.1;
    }

    // 4. Control
    const eta_lc_map: Record<string, number> = {
      containment_extraction: 0.03,
      containment_no_extract: 0.3,
      local_extraction: 0.3,
      suppression: 0.3,
      none: 1,
    };
    const eta_lc = eta_lc_map[input.localControl] || 1;

    let eta_gv = 1;
    const vol = input.roomVolume;
    const vent = input.ventilationType;
    if (vol === "lt_100") {
      if (vent === "none") eta_gv = 10;
      else if (vent === "booth") eta_gv = 0.1;
      else eta_gv = 3;
    } else if (vol === "100_1000") {
      if (vent === "none") eta_gv = 3;
      else if (vent === "booth") eta_gv = 0.3;
      else eta_gv = 1;
    }

    let a = 0.03;
    if (input.dailyCleaning && input.equipmentMaintenance) a = 0;
    else if (input.dailyCleaning || input.equipmentMaintenance) a = 0.01;

    // 5. Immission
    const eta_seg_map: Record<string, number> = {
      isolated: 0.03,
      cabin: 0.1,
      none: 1,
    };
    const eta_seg = eta_seg_map[input.workerSegregation] || 1;
    const eta_rpe = input.ppeUsed ? 0.1 : 1;
    const th_map: Record<string, number> = {
      min_30: 0.06,
      hour_2: 0.25,
      hour_4: 0.5,
      hour_8: 1.0,
    };
    const th = th_map[input.exposureDuration] || 1;
    const fh_map: Record<string, number> = {
      year_1: 0.01,
      month_1: 0.05,
      week_bi: 0.1,
      week_1: 0.2,
      week_2_3: 0.6,
      week_4_5: 1.0,
    };
    const fh = fh_map[input.exposureFrequency] || 1;

    // Calc
    const C_total = E * a + E * H_factor * eta_lc * eta_gv;
    const Bt = C_total * eta_seg * eta_rpe * th * fh;

    let exposureBand: 1 | 2 | 3 | 4 = 1;
    if (Bt < 0.00002) exposureBand = 1;
    else if (Bt < 0.002) exposureBand = 2;
    else if (Bt < 0.2) exposureBand = 3;
    else exposureBand = 4;

    const matrix: Record<string, "I" | "II" | "III"> = {
      A1: "III",
      A2: "III",
      A3: "III",
      A4: "II",
      B1: "III",
      B2: "III",
      B3: "II",
      B4: "I",
      C1: "III",
      C2: "II",
      C3: "II",
      C4: "I",
      D1: "II",
      D2: "II",
      D3: "I",
      D4: "I",
      E1: "I",
      E2: "I",
      E3: "I",
      E4: "I",
    };
    const riskPriority = matrix[`${hazardBand}${exposureBand}`] || "I";

    return { hazardBand, exposureScore: Bt, exposureBand, riskPriority };
  };

  const handleInternalNext = () => setInternalStep((prev) => prev + 1);
  const handleInternalBack = () => setInternalStep((prev) => prev - 1);

  const renderProgress = () => (
    <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem" }}>
      {[0, 1, 2, 3].map((step) => (
        <div
          key={step}
          style={{
            flex: 1,
            height: "4px",
            borderRadius: "2px",
            backgroundColor:
              step <= internalStep ? "var(--color-primary)" : "#e2e8f0",
            transition: "background-color 0.3s",
          }}
        />
      ))}
    </div>
  );

  return (
    <StepCard
      title="Módulo C: Evaluación Higiénica Cuantitativa"
      description={`Evaluación para: ${substanceName || "Agente"}`}
      icon="🧠"
    >
      {renderProgress()}

      {/* STEP 0: INFO (1 & 2) */}
      {internalStep === 0 && (
        <>
          <div className="form-group mb-4">
            <h4 style={{ color: "#0056b3", borderBottom: "2px solid #0056b3" }}>
              1. Caracterización Básica (Info)
            </h4>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#eef6fc",
                borderRadius: "6px",
              }}
            >
              <strong>ℹ️ Criterios:</strong> Organización, Proceso, Entorno,
              Medidas, Temporalidad, Personal.
            </div>
          </div>
          <div className="form-group mb-4">
            <h4 style={{ color: "#0056b3", borderBottom: "2px solid #0056b3" }}>
              2. Grupos de Exposición Similar (GES)
            </h4>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#eef6fc",
                borderRadius: "6px",
              }}
            >
              Grupo de trabajadores con el mismo perfil de exposición.
            </div>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                marginTop: "1rem",
                marginRight: "1rem",
                padding: "1rem",
                background: "transparent",
                color: "#666",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              &larr; Volver a Módulo B
            </button>
          )}
          <button
            onClick={handleInternalNext}
            style={{
              flex: 1,
              marginTop: "1rem",
              padding: "1rem",
              background: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Iniciar Caracterización Stoffenmanager ® &rarr;
          </button>
        </>
      )}

      {/* STEP 1: STOFFENMANAGER FORM */}
      {internalStep === 1 && formData.stoffenmanager && (
        <div className="stoffenmanager-container">
          <h3
            style={{
              borderBottom: "2px solid var(--color-primary)",
              paddingBottom: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            3. Caracterización Detallada (Metodología Stoffenmanager®)
          </h3>

          {/* P1: ID */}
          <div
            className="section mb-4"
            style={{
              padding: "1rem",
              border: "1px solid #eee",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ color: "#666" }}>
              Fase 1: Identificación del Producto
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label>
                Nombre Comercial
                <input
                  type="text"
                  value={formData.stoffenmanager.productName}
                  onChange={(e) =>
                    updateStoffenmanager("productName", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </label>
              <label>
                Fabricante
                <input
                  type="text"
                  value={formData.stoffenmanager.manufacturer}
                  onChange={(e) =>
                    updateStoffenmanager("manufacturer", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                />
              </label>
              <label>
                Estado Físico
                <select
                  value={formData.stoffenmanager.physicalState}
                  onChange={(e) =>
                    updateStoffenmanager("physicalState", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <option value="liquid">Líquido</option>
                  <option value="solid">Sólido</option>
                </select>
              </label>
            </div>
          </div>

          {/* P3: EMISSION */}
          <div
            className="section mb-4"
            style={{
              padding: "1rem",
              border: "1px solid #eee",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ color: "#666" }}>Fase 3: Emisión Intrínseca</h4>
            {formData.stoffenmanager.physicalState === "liquid" ? (
              <label>
                Presión de Vapor (Pa) a 20°C
                <input
                  type="number"
                  value={formData.stoffenmanager.vapourPressure || 2300}
                  onChange={(e) =>
                    updateStoffenmanager(
                      "vapourPressure",
                      parseFloat(e.target.value),
                    )
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                />
                <small style={{ color: "#888" }}>
                  Por defecto: 2300 Pa (Agua)
                </small>
              </label>
            ) : (
              <label>
                Pulverulencia
                <select
                  value={formData.stoffenmanager.dustiness}
                  onChange={(e) =>
                    updateStoffenmanager("dustiness", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <option value="solid_objects">
                    Objetos sólidos (bloques)
                  </option>
                  <option value="granules_firm">
                    Gránulos firmes (no dispersables)
                  </option>
                  <option value="granules_friable">
                    Gránulos friables (azúcar, jabón polvo)
                  </option>
                  <option value="dust_coarse">Polvo grueso (arena)</option>
                  <option value="dust_fine">Polvo fino (harina, talco)</option>
                  <option value="dust_extreme">
                    Extremadamente polvoriento
                  </option>
                </select>
              </label>
            )}
          </div>

          {/* P4: HANDLING */}
          <div
            className="section mb-4"
            style={{
              padding: "1rem",
              border: "1px solid #eee",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ color: "#666" }}>Fase 4: Tipo de Tarea</h4>
            <label>
              Seleccione la categoría de manipulación:
              <select
                value={formData.stoffenmanager.handlingType}
                onChange={(e) =>
                  updateStoffenmanager("handlingType", e.target.value)
                }
                style={{ width: "100%", padding: "0.5rem" }}
              >
                {formData.stoffenmanager?.physicalState === "liquid" ? (
                  <>
                    <option value="A">
                      [A] Recipientes cerrados herméticamente (Pt=0)
                    </option>
                    <option value="B">
                      [B] Cantidades insignificantes &lt;1ml (Pt=0.03)
                    </option>
                    <option value="C">
                      [C] Pequeñas cantidades &lt;10ml (Pt=0.1)
                    </option>
                    <option value="D">
                      [D] Superficies peq., manipulación incidental (Pt=0.3)
                    </option>
                    <option value="E">
                      [E] Baja presión, superficies medias (Pt=1)
                    </option>
                    <option value="F">
                      [F] Grandes superficies (pintado, limpieza) (Pt=3)
                    </option>
                    <option value="G">
                      [G] Pulverización baja presión, alta velocidad (Pt=3)
                    </option>
                    <option value="H">
                      [H] Alta presión, niebla visible (Pt=10)
                    </option>
                  </>
                ) : (
                  <>
                    <option value="A">[A] Envases cerrados (Pt=0)</option>
                    <option value="B">
                      [B] Cantidades insignificantes (mg) (Pt=0.03)
                    </option>
                    <option value="C">
                      [C] Cantidades muy pequeñas (g) (Pt=0.1)
                    </option>
                    <option value="D">[D] Pequeñas cantidades (Pt=0.3)</option>
                    <option value="E">
                      [E] Cantidades medias, baja energía (Pt=1)
                    </option>
                    <option value="F">
                      [F] Alta energía, dispersión polvo (Pt=3)
                    </option>
                    <option value="G">
                      [G] Alta presión, grandes cantidades (Pt=10)
                    </option>
                    <option value="H">
                      [H] Muy grandes cantidades (toneladas) (Pt=30)
                    </option>
                  </>
                )}
              </select>
            </label>
          </div>

          {/* P5: CONTROL */}
          <div
            className="section mb-4"
            style={{
              padding: "1rem",
              border: "1px solid #eee",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ color: "#666" }}>Fase 5: Medidas de Control</h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label>
                Control Localizado
                <select
                  value={formData.stoffenmanager.localControl}
                  onChange={(e) =>
                    updateStoffenmanager("localControl", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <option value="containment_extraction">
                    Contención + Extracción (0.03)
                  </option>
                  <option value="containment_no_extract">
                    Contención total sin extracción (0.3)
                  </option>
                  <option value="local_extraction">
                    Extracción Localizada (0.3)
                  </option>
                  <option value="suppression">Supresión (agua) (0.3)</option>
                  <option value="none">Sin medidas (1)</option>
                </select>
              </label>
              <label>
                Volumen Sala
                <select
                  value={formData.stoffenmanager.roomVolume}
                  onChange={(e) =>
                    updateStoffenmanager("roomVolume", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <option value="lt_100">&lt; 100 m³</option>
                  <option value="100_1000">100 - 1000 m³</option>
                  <option value="gt_1000">&gt; 1000 m³</option>
                  <option value="outdoor">Exterior</option>
                </select>
              </label>
              <label>
                Ventilación General
                <select
                  value={formData.stoffenmanager.ventilationType}
                  onChange={(e) =>
                    updateStoffenmanager("ventilationType", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <option value="none">Sin ventilación</option>
                  <option value="natural">Natural</option>
                  <option value="mechanical">Mecánica</option>
                  <option value="booth">Cabina</option>
                </select>
              </label>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={formData.stoffenmanager.dailyCleaning}
                    onChange={(e) =>
                      updateStoffenmanager("dailyCleaning", e.target.checked)
                    }
                  />
                  Limpieza Diaria
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.stoffenmanager.equipmentMaintenance}
                    onChange={(e) =>
                      updateStoffenmanager(
                        "equipmentMaintenance",
                        e.target.checked,
                      )
                    }
                  />
                  Mantenimiento Equipos
                </label>
              </div>
            </div>
          </div>

          {/* P6: IMMISSION */}
          <div
            className="section mb-4"
            style={{
              padding: "1rem",
              border: "1px solid #eee",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ color: "#666" }}>Fase 6: Inmisión y Tiempo</h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <label>
                Segregación
                <select
                  value={formData.stoffenmanager.workerSegregation}
                  onChange={(e) =>
                    updateStoffenmanager("workerSegregation", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <option value="none">Sin segregación</option>
                  <option value="cabin">Cabina control</option>
                  <option value="isolated">Sala separada</option>
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.stoffenmanager.ppeUsed}
                  onChange={(e) =>
                    updateStoffenmanager("ppeUsed", e.target.checked)
                  }
                />
                Uso de EPI Respiratorio?
              </label>
              <label>
                Duración
                <select
                  value={formData.stoffenmanager.exposureDuration}
                  onChange={(e) =>
                    updateStoffenmanager("exposureDuration", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <option value="min_30">1-30 min</option>
                  <option value="hour_2">0.5 - 2 horas</option>
                  <option value="hour_4">2 - 4 horas</option>
                  <option value="hour_8">4 - 8 horas</option>
                </select>
              </label>
              <label>
                Frecuencia
                <select
                  value={formData.stoffenmanager.exposureFrequency}
                  onChange={(e) =>
                    updateStoffenmanager("exposureFrequency", e.target.value)
                  }
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <option value="year_1">1 día/año</option>
                  <option value="month_1">1 día/mes</option>
                  <option value="week_bi">1 día/2 semanas</option>
                  <option value="week_1">1 día/semana</option>
                  <option value="week_2_3">2-3 días/semana</option>
                  <option value="week_4_5">4-5 días/semana</option>
                </select>
              </label>
            </div>
          </div>

          <div
            className="actions"
            style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
          >
            <button
              onClick={handleInternalBack}
              style={{
                flex: 1,
                padding: "1rem",
                background: "#eee",
                border: "none",
                borderRadius: "4px",
              }}
            >
              &larr; Volver
            </button>
            <button
              onClick={() => {
                if (formData.stoffenmanager) {
                  const result = calculateStoffenmanager(
                    formData.stoffenmanager,
                  );
                  // Update full state logic
                  const updatedInput = {
                    ...formData,
                    stoffenmanagerResult: result,
                  };
                  // Call onAnalyze (if parent expects to just update state)
                  onAnalyze(updatedInput);
                  // Alert user for immediate feedback (optional but helpful)
                  // alert(`Resultado Stoffenmanager: Prioridad ${result.riskPriority}`);
                  // Next step
                  handleInternalNext();
                }
              }}
              style={{
                flex: 2,
                padding: "1rem",
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Calcular Riesgo y Continuar
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: STRATEGY (OLD 3 & 4) */}
      {internalStep === 2 && (
        <>
          <h4 style={{ color: "#0056b3" }}>
            4. Estrategia de Medición (UNE-EN 689)
          </h4>
          {/* ... Only minimal needed logic reused from old form ... */}
          <label>Perfil de Exposición:</label>
          <select
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
            value={formData.strategyType || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                strategyType: e.target
                  .value as HygienicEvalInput["strategyType"],
              })
            }
          >
            <option value="">Seleccione...</option>
            <option value="continuous">Continuo</option>
            <option value="peaks">Picos</option>
          </select>

          <h4 style={{ color: "#0056b3" }}>5. Valor Límite Ambiental</h4>
          <div style={{ background: "#eee", padding: "1rem" }}>
            VLA-ED: {formData.vla || "---"} mg/m³
          </div>

          <div
            className="actions"
            style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
          >
            <button onClick={handleInternalBack} style={{ padding: "0.5rem" }}>
              &larr; Atrás
            </button>
            <button
              onClick={handleInternalNext}
              style={{
                flex: 1,
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                padding: "0.5rem",
              }}
            >
              Ir a Resultados
            </button>
          </div>
        </>
      )}

      {/* STEP 3: RESULTS (OLD 5) */}
      {internalStep === 3 && (
        <>
          <h4 style={{ color: "#0056b3" }}>6. Resultados de la Medición</h4>
          <label>Concentración (I) mg/m³</label>
          <input
            type="number"
            step="0.001"
            value={formData.labResult || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                labResult: parseFloat(e.target.value),
              })
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "2px solid var(--color-primary)",
            }}
          />

          <div
            className="actions"
            style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
          >
            <button onClick={handleInternalBack} style={{ padding: "0.5rem" }}>
              &larr; Atrás
            </button>
            <button
              onClick={onNext}
              style={{
                flex: 1,
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                padding: "0.5rem",
              }}
            >
              Finalizar Módulo C
            </button>
          </div>
        </>
      )}
    </StepCard>
  );
};
