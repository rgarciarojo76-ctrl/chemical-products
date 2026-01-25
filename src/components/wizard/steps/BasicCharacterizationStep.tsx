import React, { useState, useCallback } from "react";
import {
  AlertTriangle,
  Shield,
  Factory,
  Users,
  Search,
  BookOpen,
  AlertOctagon,
} from "lucide-react";
import type { BasicCharacterizationInput, HazardInput } from "../../../types";
import { StandardScenarios_DB } from "../../../data/standardScenarios";
import type { StandardScenario } from "../../../data/standardScenarios";

interface BasicCharacterizationStepProps {
  data: BasicCharacterizationInput | undefined;
  onUpdate: (data: BasicCharacterizationInput) => void;
  hazardData?: HazardInput;
}

export const BasicCharacterizationStep: React.FC<
  BasicCharacterizationStepProps
> = ({ data, onUpdate, hazardData }) => {
  // Mode Selection: 'selection' | 'assistant' | 'expert'
  const [mode, setMode] = useState<"selection" | "assistant" | "expert">(
    data ? "expert" : "selection",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<
    string | undefined
  >(undefined);

  // Local state for form if not provided
  const [form, setForm] = useState<BasicCharacterizationInput>(
    data || {
      processDescription: "",
      isOpenProcess: true,
      technicalMeasure: "none",
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "",
      dermalPPE: "",
      hygieneRights: false,
      frequency: "daily",
      duration: "gt_4h",
    },
  );

  // Derived State: Validate Measures (Prompt Point 2B) & Gap Analysis
  // 1. Legal Art 5 Check (Carcinogens)
  const isCarcinogen = hazardData?.hPhrases.some((h) =>
    ["H350", "H360", "H350i", "H360D", "H360F", "H360FD"].includes(h),
  );
  const showLegalAlert = !!(
    isCarcinogen && form.technicalMeasure !== "closed_system"
  );

  // 2. Gap Analysis (Scenario Downgrade)
  const activeScenario = StandardScenarios_DB.find(
    (s) => s.id === selectedScenarioId,
  );

  // Determine if current measure is "less safe" than recommended
  const measureSafetyScore = {
    closed_system: 4,
    local_extraction: 3,
    suppression: 2, // Treated same as local sometimes or slightly lower
    general_ventilation: 1,
    none: 0,
  };

  const currentScore =
    measureSafetyScore[
      form.technicalMeasure as keyof typeof measureSafetyScore
    ] || 0;
  const recommendedScore = activeScenario
    ? measureSafetyScore[
        activeScenario.minTechnicalMeasure as keyof typeof measureSafetyScore
      ]
    : 0;

  const showGapWarning = !!(activeScenario && currentScore < recommendedScore);

  // Backend: Narrative Generator
  const generateNarrative = useCallback(
    (
      currentForm: BasicCharacterizationInput,
      legalWarn: boolean,
      gapWarn: boolean,
      scenario?: StandardScenario,
    ): BasicCharacterizationInput => {
      const measureText =
        {
          closed_system: "un sistema cerrado estanco",
          local_extraction: "extraccion localizada",
          general_ventilation: "ventilación general",
          none: "ninguna medida técnica específica",
        }[currentForm.technicalMeasure] || "medidas técnicas";

      let narrative = `Se ha realizado la caracterización básica del puesto. El proceso implica ${currentForm.processDescription || "una actividad no descrita"} con ${currentForm.isOpenProcess ? "procesos abiertos" : "sistemas cerrados"}. Las medidas de control implementadas consisten en ${measureText}.`;

      if (scenario) {
        narrative += ` Este escenario se basa en el estándar "${scenario.source}: ${scenario.title}".`;
      }

      if (gapWarn && scenario) {
        narrative += ` ATENCIÓN: La medida seleccionada es inferior a la recomendada por el estándar (${scenario.minTechnicalMeasure}), lo que contraviene el principio de control en origen.`;
      }

      if (legalWarn) {
        narrative += ` Se detecta agente cancerígeno sin sistema cerrado, requiriendo justificación explícita según Art. 5 RD 665/1997.`;
      } else if (!gapWarn) {
        narrative += ` Las medidas se consideran a priori adecuadas/conformes con las buenas prácticas estándar.`;
      }

      // Inject Legal Text (Point 2.3)
      if (scenario && !gapWarn) {
        narrative += `\n\nOBSERVACIONES: Las medidas propuestas se basan en la Ficha de Control [${scenario.source}] del INSST y el modelo COSHH Essentials, cumpliendo el principio de la mejor técnica disponible.`;
      }

      // Compliance Logic
      let compliance: "green" | "red" | "unknown" = "unknown";
      if (gapWarn || (legalWarn && !currentForm.measureJustification))
        compliance = "red";
      else if (!legalWarn && !gapWarn) compliance = "green";

      return {
        ...currentForm,
        autoNarrative: narrative,
        complianceResult: compliance,
      };
    },
    [],
  );

  const handleUpdate = useCallback(
    (updatedForm: BasicCharacterizationInput, scenarioId?: string) => {
      // Re-calculate derived checks for narrative generation snapshot
      const _activeScenario = StandardScenarios_DB.find(
        (s) => s.id === (scenarioId || selectedScenarioId),
      );
      const _isCarcinogen = hazardData?.hPhrases.some((h) =>
        ["H350", "H360", "H350i", "H360D", "H360F", "H360FD"].includes(h),
      );
      const _showLegalAlert = !!(
        _isCarcinogen && updatedForm.technicalMeasure !== "closed_system"
      );

      const _currentScore =
        measureSafetyScore[
          updatedForm.technicalMeasure as keyof typeof measureSafetyScore
        ] || 0;
      const _recommendedScore = _activeScenario
        ? measureSafetyScore[
            _activeScenario.minTechnicalMeasure as keyof typeof measureSafetyScore
          ]
        : 0;
      const _showGapWarning = !!(
        _activeScenario && _currentScore < _recommendedScore
      );

      onUpdate(
        generateNarrative(
          updatedForm,
          _showLegalAlert,
          _showGapWarning,
          _activeScenario,
        ),
      );
    },
    [selectedScenarioId, hazardData, onUpdate, generateNarrative],
  );

  const handleChange = useCallback(
    (field: keyof BasicCharacterizationInput, value: string | boolean) => {
      setForm((prev) => {
        let updated = { ...prev, [field]: value };

        const isExposureConfirmed =
          updated.isOpenProcess || updated.technicalMeasure === "none";
        if (isExposureConfirmed && !updated.hygieneRights) {
          updated = { ...updated, hygieneRights: true };
        }

        handleUpdate(updated);
        return updated;
      });
    },
    [handleUpdate],
  );

  // Select Scenario Handler
  const selectScenario = (scenario: StandardScenario) => {
    const mergedForm = { ...form, ...scenario.defaults };
    setForm(mergedForm);
    setSelectedScenarioId(scenario.id);
    setMode("expert");
    handleUpdate(mergedForm, scenario.id);
  };

  // Filter Scenarios
  const filteredScenarios = StandardScenarios_DB.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.keywords.some((k) =>
        k.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  if (mode === "selection") {
    return (
      <div className="animate-fadeIn h-full flex flex-col">
        {/* Trust Header */}
        <div className="mb-4 text-center">
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "var(--color-primary-dark)",
            }}
          >
            Seleccione el Método de Evaluación
          </h3>
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--color-text-light)",
              maxWidth: "600px",
              margin: "0 auto 1.5rem auto",
            }}
          >
            Esta herramienta integra las metodologías oficiales para garantizar
            la seguridad jurídica y técnica.
          </p>

          <div className="trust-badge-container">
            <span className="trust-badge">🏛️ Fichas BASEQUIM (INSST)</span>
            <span className="trust-badge">⚖️ Priorización RD 665/1997</span>
            <span className="trust-badge">🌍 Modelo COSHH Essentials</span>
          </div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 routes-grid"
          style={{ gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
        >
          {/* Card 1: Assistant (Recommended) */}
          <div
            className="selection-card recommended"
            onClick={() => setMode("assistant")}
          >
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "var(--color-primary)",
                color: "white",
                fontSize: "0.7rem",
                padding: "0.25rem 0.75rem",
                fontWeight: 700,
                borderRadius: "99px",
                textTransform: "uppercase",
              }}
            >
              Recomendado
            </div>

            <div className="card-icon-wrapper">
              <BookOpen size={32} strokeWidth={2} />
            </div>

            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                color: "var(--color-text-main)",
              }}
            >
              Asistente de Escenarios Estándar
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-light)",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              Utilice situaciones de trabajo pre-validadas por el{" "}
              <strong>INSST</strong>. Carga automáticamente medidas de control,
              EPIs y perfiles de exposición conformes a normativa.
            </p>

            <button className="card-btn">Abrir Asistente</button>
          </div>

          {/* Card 2: Expert Mode */}
          <div className="selection-card" onClick={() => setMode("expert")}>
            <div className="card-icon-wrapper">
              <Shield size={32} strokeWidth={2} />
            </div>

            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                color: "var(--color-text-main)",
              }}
            >
              Modo Experto / Libre
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-light)",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              Configure manualmente cada parámetro de la evaluación cualitativa.
              Ideal para procesos atípicos o no estandarizados.
            </p>

            <button className="card-btn">Configuración Manual</button>
          </div>
        </div>
      </div>
    );
  }

  // PREMIUM ASSISTANT UI
  if (mode === "assistant") {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div
          className="premium-gradient-bg mb-4"
          style={{ padding: "2rem", borderRadius: "12px" }}
        >
          <div className="text-center mb-6">
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                color: "var(--color-primary-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <BookOpen size={24} color="var(--color-primary)" />
              Asistente de Escenarios Estándar
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-light)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Seleccione una situación de trabajo. El sistema cargará
              automáticamente las medidas de control validadas por las
              siguientes autoridades técnicas:
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                padding: "1rem",
                background: "white",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                🏛️
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>
                Fichas BASEQUIM
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>INSST</div>
            </div>
            <div
              style={{
                padding: "1rem",
                background: "white",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                ⚖️
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>
                Guía Téc. RD 665
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>
                Priorización Legal
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                background: "white",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                🌍
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>
                COSHH Essentials
              </div>
              <div style={{ fontSize: "0.7rem", color: "#666" }}>
                HSE Methodology
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="premium-search-container">
          <div className="search-icon-absolute">
            <Search size={22} />
          </div>
          <input
            type="text"
            className="premium-search-input"
            placeholder="Buscar proceso... (Ej: Soldadura, Madera, Sílice...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            autoFocus
          />
        </div>

        {/* Results Grid */}
        {(searchFocused || searchTerm.length > 0) && (
          <div className="scenario-grid">
            {/* Custom Create Option */}
            {searchTerm.length > 0 && (
              <div
                onClick={() => {
                  setForm({ ...form, processDescription: searchTerm });
                  setMode("expert");
                }}
                className="scenario-card"
                style={{
                  backgroundColor: "#eff6ff",
                  borderStyle: "dashed",
                  borderColor: "var(--color-primary)",
                }}
              >
                <div style={{ fontSize: "2rem" }}>✨</div>
                <div>
                  <h4
                    style={{
                      fontWeight: 700,
                      color: "var(--color-primary-dark)",
                    }}
                  >
                    ¿No encuentra su escenario?
                  </h4>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-light)",
                    }}
                  >
                    Usar <strong>"{searchTerm}"</strong> como descripción
                    personalizada.
                  </p>
                </div>
              </div>
            )}

            {filteredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => selectScenario(scenario)}
                className="scenario-card"
              >
                <div style={{ fontSize: "2rem" }}>{scenario.icon}</div>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontWeight: 700,
                      color: "var(--color-text-main)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {scenario.title}
                  </h4>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      background: "#eff6ff",
                      color: "var(--color-primary)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: 600,
                    }}
                  >
                    {scenario.source}
                  </span>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-light)",
                      marginTop: "0.5rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {scenario.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searchFocused && searchTerm.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#ccc" }}>
            👆 Pulse en la barra de búsqueda para ver los escenarios disponibles
          </div>
        )}

        <div className="text-center" style={{ marginTop: "2rem" }}>
          <button
            onClick={() => setMode("selection")}
            style={{
              background: "none",
              border: "none",
              color: "#999",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              margin: "0 auto",
            }}
          >
            ← Volver a selección
          </button>
        </div>
      </div>
    );
  }

  // EXPERT MODE FORM (With Gap Alerts)
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Shield size={20} /> Caracterización Avanzada{" "}
          {activeScenario && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <BookOpen size={10} /> {activeScenario.source}
            </span>
          )}
        </h3>
        <button
          onClick={() => {
            setMode("selection");
            setSelectedScenarioId(undefined);
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cambiar modo
        </button>
      </div>

      {/* Gap Warning Banner */}
      {showGapWarning && activeScenario && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4 animate-shake">
          <div className="flex items-start gap-3">
            <AlertOctagon className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <h5 className="font-bold text-red-900 text-sm">
                Aviso de Conformidad (Gap Analysis)
              </h5>
              <p className="text-sm text-red-800 mt-1">
                {activeScenario.gapWarning}
              </p>
              <p className="text-xs text-red-600 mt-2 font-semibold">
                ⚠️ Se inyectará una advertencia en el informe final.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* A. PROCESO */}
      <section className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h4 className="font-semibold text-blue-900 border-b pb-2 mb-3 flex items-center gap-2">
          <Factory size={16} /> A. Proceso (Fuente de Emisión)
        </h4>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del Proceso / Tarea
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Ej. Limpieza manual de rodillos con disolvente"
              value={form.processDescription}
              onChange={(e) =>
                handleChange("processDescription", e.target.value)
              }
            />
          </div>
          <div className="flex items-center gap-4 bg-gray-50 p-3 rounded">
            <span className="text-sm font-medium">¿Es un proceso abierto?</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={form.isOpenProcess}
                  onChange={() => handleChange("isOpenProcess", true)}
                />
                <span>Sí (Abierto)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!form.isOpenProcess}
                  onChange={() => handleChange("isOpenProcess", false)}
                />
                <span>No (Cerrado)</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* B. MEDIDAS TÉCNICAS */}
      <section className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h4 className="font-semibold text-blue-900 border-b pb-2 mb-3 flex items-center gap-2">
          <Shield size={16} /> B. Medidas Técnicas (Jerarquía RD 665)
        </h4>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Medida de Control Principal
          </label>
          <select
            className={`w-full p-2 border rounded ${showGapWarning || showLegalAlert ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}`}
            value={form.technicalMeasure}
            onChange={(e) =>
              handleChange(
                "technicalMeasure",
                e.target
                  .value as BasicCharacterizationInput["technicalMeasure"],
              )
            }
          >
            <option value="closed_system">
              1. Sistema Cerrado Estanco (Prioritario)
            </option>
            <option value="local_extraction">2. Extracción Localizada</option>
            <option value="general_ventilation">3. Ventilación General</option>
            <option value="none">4. Ninguna / Ventilación Natural</option>
          </select>

          {showLegalAlert && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
              <div className="flex items-start">
                <AlertTriangle
                  className="text-orange-600 mr-2 flex-shrink-0"
                  size={20}
                />
                <div>
                  <p className="font-bold text-orange-800 text-sm">
                    ⚠️ Justificación Requerida (Art. 5 RD 665/1997)
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    Para agentes cancerígenos, la norma exige{" "}
                    <strong>Sistema Cerrado</strong>. Debe justificar
                    técnicamente por qué no es viable.
                  </p>
                  <textarea
                    className="w-full mt-2 p-2 text-sm border border-orange-300 rounded focus:ring-orange-500"
                    placeholder="Escriba la justificación técnica aquí..."
                    value={form.measureJustification || ""}
                    onChange={(e) =>
                      handleChange("measureJustification", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* C & D. ENTORNO Y ORGANIZACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-blue-900 border-b pb-2 mb-3">
            C/D. Entorno y Organización
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de Limpieza
              </label>
              <select
                className="w-full p-2 border rounded"
                value={form.cleaningMethod}
                onChange={(e) =>
                  handleChange(
                    "cleaningMethod",
                    e.target
                      .value as BasicCharacterizationInput["cleaningMethod"],
                  )
                }
              >
                <option value="hepa_wet">Aspiración HEPA / Vía Húmeda</option>
                <option value="sweeping">
                  Barrido (Prohibido si hay polvo)
                </option>
                <option value="none">No aplica</option>
              </select>
              {form.cleaningMethod === "sweeping" && (
                <p className="text-xs text-red-600 mt-1 font-bold">
                  ⚠️ El barrido en seco está generalmente prohibido para Agentes
                  Químicos Peligrosos.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">Acceso Restringido</span>
              <input
                type="checkbox"
                checked={form.accessRestricted}
                onChange={(e) =>
                  handleChange("accessRestricted", e.target.checked)
                }
              />
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">Señalización GHS08</span>
              <input
                type="checkbox"
                checked={form.signageGHS08}
                onChange={(e) => handleChange("signageGHS08", e.target.checked)}
              />
            </div>
          </div>
        </section>

        {/* E & F. PERSONAL Y TIEMPO */}
        <section className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-blue-900 border-b pb-2 mb-3 flex items-center gap-2">
            <Users size={16} /> Personal y Tiempo
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">
                  Frecuencia
                </label>
                <select
                  className="w-full p-2 text-sm border rounded"
                  value={form.frequency}
                  onChange={(e) =>
                    handleChange(
                      "frequency",
                      e.target.value as BasicCharacterizationInput["frequency"],
                    )
                  }
                >
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                  <option value="sporadic">Esporádica</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">
                  Duración
                </label>
                <select
                  className="w-full p-2 text-sm border rounded"
                  value={form.duration}
                  onChange={(e) =>
                    handleChange(
                      "duration",
                      e.target.value as BasicCharacterizationInput["duration"],
                    )
                  }
                >
                  <option value="lt_15m">&lt; 15 min</option>
                  <option value="15m_2h">15 min - 2h</option>
                  <option value="2h_4h">2h - 4h</option>
                  <option value="gt_4h">&gt; 4h</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                EPI Respiratorio
              </label>
              <input
                type="text"
                className="w-full p-2 text-sm border rounded"
                placeholder="Ej. Máscara completa P3"
                value={form.respiratoryPPE}
                onChange={(e) => handleChange("respiratoryPPE", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 bg-green-50 p-2 rounded border border-green-200">
              <input
                type="checkbox"
                checked={form.hygieneRights}
                onChange={(e) =>
                  handleChange("hygieneRights", e.target.checked)
                }
              />
              <span className="text-xs text-green-800 font-medium">
                Derecho a 10 min aseo (Tiempo efectivo)
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Auto Narrative Preview */}
      <div className="bg-gray-100 p-3 rounded text-sm text-gray-600 italic">
        <strong>Narrativa generada:</strong> "{form.autoNarrative}"
      </div>
    </div>
  );
};
