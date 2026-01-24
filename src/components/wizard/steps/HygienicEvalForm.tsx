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

  const [result, setResult] = useState<HygienicAssessment | null>(null);

  // 0: Caracterización básica (Simplificada) - Old Point 1
  // 1: Caracterización básica (Avanzada: Stoffenmanager) - New Stoffenmanager
  // 2: Grupos de exposición similares (GES) - Old Point 2
  // 3: Estrategia de Medición - Prior Point 4, now 4
  // 4: Resultados - Prior Point 5, now 5
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

  const calculateStoffenmanager = (
    input: StoffenmanagerInput,
  ): StoffenmanagerResult => {
    // === 1. HAZARD CLASS (Banda de Peligro) ===
    let hazardBand: "A" | "B" | "C" | "D" | "E" = "A";
    const h = input.hPhrases || [];
    if (
      h.some((p) =>
        [
          "H340",
          "H350",
          "H350i",
          "H360",
          "H360FD",
          "H310",
          "H330",
          "H372",
        ].includes(p),
      )
    )
      hazardBand = "E";
    else if (
      h.some((p) =>
        ["H351", "H341", "H361", "H331", "H311", "H301", "H314"].includes(p),
      )
    )
      hazardBand = "D";
    else if (
      h.some((p) =>
        ["H332", "H312", "H302", "H318", "H373", "H335"].includes(p),
      )
    )
      hazardBand = "C";
    else if (h.some((p) => ["H315", "H319", "H336", "H317"].includes(p)))
      hazardBand = "B";
    else hazardBand = "A";

    // === 2. POTENTIAL EXPOSURE SCORE (Puntuación de Exposición Potencial) ===

    // A. Emission Score (E)
    let E = 0;
    if (input.physicalState === "liquid") {
      // Liquids: Based on Vapour Pressure (Pa) and Process
      // Simplified Logic:
      // VP < 10 Pa -> 0
      // 10-500 Pa -> 0.03
      // 500-10000 Pa -> 0.1
      // >10000 Pa -> 0.3 (High Volatility)
      // If High Energy Handling (Spray) -> E=1
      const vp = input.vapourPressure || 100;
      if (input.handlingType === "E") {
        // Spray / High Energy Dispersal
        E = 1;
      } else {
        if (vp > 10000) E = 0.3;
        else if (vp > 500) E = 0.1;
        else if (vp > 10) E = 0.03;
        else E = 0;
      }
    } else {
      // Solids: Based on Dustiness
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

    // B. Handling Activity Class (H)
    // Multipliers standard from Stoffenmanager / COSHH Essentials logic adapted
    const handlingMap: Record<string, number> = {
      A: 0.1, // Low energy / passive
      B: 0.3, // Handling objects / manual low energy
      C: 1.0, // Handling with some energy / mixing / transfer
      D: 3.0, // High energy handling
      E: 10.0, // Dispersive / Spraying (Also affects E above usually, here treated as activity factor)
      F: 10.0,
      G: 10.0,
      H: 10.0,
    };
    // Solid/Liquid nuances are subtly handled by E, but H is task energy
    const H = handlingMap[input.handlingType] || 0.1;

    // C. Control Measures (Local) - LC
    const lcMap: Record<string, number> = {
      none: 1,
      suppression: 0.3, // Wet suppression
      local_extraction: 0.1, // LEV
      containment_no_extract: 0.1,
      containment_extraction: 0.01,
    };
    const LC = lcMap[input.localControl] || 1;

    // D. General Ventilation & Room (GV)
    // Multipliers for Background/Immission
    // Logic: Smaller room + poor ventilation = Higher concentration
    let GV = 1;
    // Base table simplified:
    // Natural / Mechanical / None vs Room Size
    //  <100m3: Poor(10), Nat(3), Mech(1)
    // 100-1000m3: Poor(3), Nat(1), Mech(0.3)
    // >1000m3: Poor(1), Nat(0.3), Mech(0.1)

    const vType = input.ventilationType;
    const rVol = input.roomVolume;

    if (rVol === "lt_100") {
      if (vType === "none") GV = 10;
      else if (vType === "natural") GV = 3;
      else GV = 1; // Mechanical
    } else if (rVol === "100_1000") {
      if (vType === "none") GV = 3;
      else if (vType === "natural") GV = 1;
      else GV = 0.3;
    } else if (rVol === "gt_1000" || rVol === "outdoor") {
      if (vType === "none") GV = 1;
      else if (vType === "natural") GV = 0.3;
      else GV = 0.1;
    }

    // E. Segregation / Worker Position
    let Seg = 1;
    if (input.workerSegregation === "cabin") Seg = 0.1;

    // F. Duration & Frequency
    const durationMap: Record<string, number> = {
      min_15: 0.1,
      min_30: 0.25, // approx 0.5hr / 8
      hour_2: 1.0, // standard task unit
      hour_4: 2.0,
      hour_8: 4.0,
    };
    const frequencyMap: Record<string, number> = {
      year_1: 0.1,
      month_1: 0.2,
      week_bi: 0.4,
      week_1: 0.6,
      week_2_3: 0.8,
      week_4_5: 1.0, // Daily = 1
      day_1: 1.0,
    };
    const T =
      (durationMap[input.exposureDuration] || 1) *
      (frequencyMap[input.exposureFrequency] || 1);

    // Correction for Cleaning/Maintenance
    let MaintFactor = 1;
    if (!input.dailyCleaning) MaintFactor *= 1.2; // A bit dirtier
    if (!input.equipmentMaintenance) MaintFactor *= 1.5; // Leaks probable

    // FINAL ALGORTHM (Conceptual Score)
    // Source * Transmission * Immission * Time
    // This is a simplified multiplicative model for Score Bt
    let rawScore = E * H * LC * Seg * MaintFactor + 0.1 * GV; // Immission component
    // Normalizing to typical Stoffenmanager Range (0 - ~1000)
    let Bt = Math.round(rawScore * T * 100);

    // Apply PPE Reduction primarily for final Risk decision, but usually Score is "Potential Exposure" (Pre-PPE)
    // If we want "Actual Exposure Score", apply PPE:
    if (input.ppeUsed) Bt = Math.round(Bt * 0.1);

    // === 3. EXPOSURE BAND (Banda de Exposición) ===
    let exposureBand: 1 | 2 | 3 | 4 = 1;
    // Logarithmic banding usually
    if (Bt > 1000) exposureBand = 4;
    else if (Bt > 100) exposureBand = 3;
    else if (Bt > 10) exposureBand = 2;
    else exposureBand = 1;

    // === 4. RISK PRIORITY ===
    let riskPriority: "I" | "II" | "III" = "III";

    // Matrix Hazard x Exposure
    // Hz A: Exp 1,2 -> III; Exp 3 -> II; Exp 4 -> I
    // Hz B: Exp 1 -> III; Exp 2 -> II; Exp 3,4 -> I
    // Hz C: Exp 1 -> II, Exp 2,3,4 -> I
    // Hz D/E: Exp 1 -> II, Exp 2,3,4 -> I
    // (Simplified rigorous logic)

    const matrix: Record<string, Record<number, "I" | "II" | "III">> = {
      A: { 1: "III", 2: "III", 3: "II", 4: "I" },
      B: { 1: "III", 2: "II", 3: "I", 4: "I" },
      C: { 1: "II", 2: "I", 3: "I", 4: "I" },
      D: { 1: "II", 2: "I", 3: "I", 4: "I" },
      E: { 1: "II", 2: "I", 3: "I", 4: "I" },
    };
    riskPriority = matrix[hazardBand][exposureBand];

    return { hazardBand, exposureScore: Bt, exposureBand, riskPriority };
  };

  const handleAnalyze = () => {
    const assessment = onAnalyze(formData);
    setResult(assessment);
  };

  const handleInternalNext = () => setInternalStep((prev) => prev + 1);
  const handleInternalBack = () => setInternalStep((prev) => prev - 1);

  const isStep0 = internalStep === 0;
  const isStep1 = internalStep === 1;
  const isStep2 = internalStep === 2;
  const isStep3 = internalStep === 3;
  const isStep4 = internalStep === 4;

  return (
    <StepCard
      title="Módulo C: Evaluación Higiénica Cuantitativa"
      description={`Definición de estrategia y conformidad para: ${substanceName || "Agente"}`}
      icon="🧠"
    >
      <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem" }}>
        {[0, 1, 2, 3, 4].map((step) => (
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

      {isStep0 && (
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
              ℹ️ Criterios técnicos básicos:
            </strong>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: "#444" }}>
                Esta sección resume los factores cualitativos básicos antes de
                profundizar en el modelo avanzado.
              </span>
            </div>
          </div>
        </div>
      )}

      {isStep1 && formData.stoffenmanager && (
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

      {isStep2 && (
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

      {isStep3 && (
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

      {isStep4 && (
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
            5. Resultados de la Medición
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
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Concentración (I)
              </label>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
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
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Límite de Cuantificación (LOQ)
              </label>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
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
      )}

      {/* ACTIONS */}
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
        <button
          onClick={isStep0 ? onBack : handleInternalBack}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            color: "#666",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          &larr; Anterior
        </button>

        {!isStep4 ? (
          <button
            onClick={() => {
              if (isStep1) {
                const res = calculateStoffenmanager(formData.stoffenmanager!);
                setFormData((prev) => ({ ...prev, stoffenmanagerResult: res }));
              }
              handleInternalNext();
            }}
            style={{
              flex: 1,
              backgroundColor: "var(--color-primary)",
              color: "white",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {isStep1 ? "Calcular Riesgo y Continuar" : "Siguiente &rarr;"}
          </button>
        ) : (
          <>
            {!result ? (
              <button
                onClick={handleAnalyze}
                style={{
                  flex: 1,
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                6. Verificar Conformidad
              </button>
            ) : (
              <div
                className={`result-box`}
                style={{
                  flex: 1,
                  padding: "1rem",
                  backgroundColor: result.isSafe ? "#d4edda" : "#f8d7da",
                  border: `1px solid ${result.isSafe ? "#c3e6cb" : "#f5c6cb"}`,
                  borderRadius: "6px",
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
                <button
                  onClick={onNext}
                  style={{
                    marginTop: "1rem",
                    backgroundColor: result.isSafe
                      ? "var(--color-safe)"
                      : "var(--color-danger)",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    float: "right",
                  }}
                >
                  {result.isSafe ? "Finalizar" : "Plan de Medidas"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </StepCard>
  );
};
