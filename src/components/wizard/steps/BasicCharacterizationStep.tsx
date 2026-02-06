import React, { useState, useCallback } from "react";
import {
  Shield,
  Factory,
  Users,
  Search,
  BookOpen,
  AlertOctagon,
  CheckCircle2,
  FlaskConical,
} from "lucide-react";
import type { BasicCharacterizationInput, HazardInput } from "../../../types";
import { StandardScenarios_DB } from "../../../data/standardScenarios";
import type { StandardScenario } from "../../../data/standardScenarios";
import type { CnaeEntry } from "../../../data/cnaeData";

interface BasicCharacterizationStepProps {
  data: BasicCharacterizationInput | undefined;
  onUpdate: (data: BasicCharacterizationInput) => void;
  hazardData?: HazardInput;
  selectedCnae?: CnaeEntry | null;
  onSwitchToAdvanced?: () => void;
}

export const BasicCharacterizationStep: React.FC<
  BasicCharacterizationStepProps
> = ({ data, onUpdate, hazardData, selectedCnae, onSwitchToAdvanced }) => {
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
    containment_extraction: 3.5,
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
          containment_extraction: "cerramiento con extracción (vitrina/cabina)",
          local_extraction: "extraccion localizada",
          suppression: "supresión húmeda",
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
      (s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.keywords.some((k) =>
          k.toLowerCase().includes(searchTerm.toLowerCase()),
        )) &&
      // Strict Filter: Only show CMR relevant scenarios
      s.risks.some((r) => ["carcinogen", "mutagen", "reprotoxic"].includes(r)),
  ).sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    const subName = hazardData?.substanceName?.toLowerCase() || "";
    const cnaeCode = selectedCnae?.code || "";

    // 1. Matches Substance Name
    if (a.relatedSubstances?.some((s) => subName.includes(s))) scoreA += 100;
    if (b.relatedSubstances?.some((s) => subName.includes(s))) scoreB += 100;

    // 2. Matches CNAE
    if (a.relatedCNAEs?.some((c) => cnaeCode.startsWith(c))) scoreA += 50;
    if (b.relatedCNAEs?.some((c) => cnaeCode.startsWith(c))) scoreB += 50;

    return scoreB - scoreA;
  });

  // Auto-Select Logic (Optional - if only 1 high match)
  // ...

  if (mode === "selection") {
    return (
      <div className="animate-fadeIn h-full flex flex-col">
        {/* Trust Header */}
        <div className="mb-10 text-center">
          <h3 className="text-center font-bold text-2xl mb-3 text-gray-800 flex items-center justify-center gap-3">
            🤔 Módulo C: Caracterización Básica
          </h3>
          <p className="text-center text-gray-500 max-w-2xl mx-auto text-base">
            Seleccione el nivel de profundidad técnica más adecuado para su
            situación
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 max-w-5xl mx-auto w-full">
          {/* Card 1: Assistant (Recommended) */}
          <div
            className="group relative bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-2xl p-8 cursor-pointer hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center justify-start h-full"
            onClick={() => setMode("assistant")}
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider shadow-sm">
              Recomendado
            </div>

            {/* COMPOSITE LOGO: STANDARD SCENARIOS */}
            <div className="mb-6 relative w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50 blur-xl group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-md border border-blue-50">
                <BookOpen
                  size={40}
                  className="text-blue-600"
                  strokeWidth={1.5}
                />
                <div className="absolute -bottom-2 -right-2 bg-green-100 p-1.5 rounded-lg border border-white shadow-sm">
                  <CheckCircle2
                    size={16}
                    className="text-green-600 fill-green-100"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
              Asistente de Escenarios Estándar
            </h3>
            <div className="w-12 h-1 bg-blue-200 rounded-full mb-4"></div>

            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
              Utilice situaciones de trabajo{" "}
              <strong className="text-blue-800">
                pre-validadas por el INSST
              </strong>
              . El sistema carga automáticamente:
              <ul className="mt-2 space-y-1 text-left bg-blue-50/50 p-3 rounded-lg text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span> Medidas de control
                  obligatorias
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span> Equipos de protección
                  (EPIs)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span> Perfiles de
                  exposición legal
                </li>
              </ul>
            </p>

            <button className="py-3 px-8 rounded-xl font-bold text-sm bg-white border border-blue-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm w-full">
              Abrir Asistente Inteligente
            </button>
          </div>

          {/* Card 2: Advanced (Stoffenmanager) */}
          <div
            className="group relative bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-emerald-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center justify-start h-full"
            onClick={() => onSwitchToAdvanced && onSwitchToAdvanced()}
          >
            {/* COMPOSITE LOGO: ADVANCED */}
            <div className="mb-6 relative w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-emerald-100 rounded-full opacity-30 blur-xl group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                <FlaskConical
                  size={40}
                  className="text-gray-600 group-hover:text-emerald-600 transition-colors"
                  strokeWidth={1.5}
                />
                <div className="absolute -top-2 -right-2 bg-gray-100 p-1.5 rounded-lg border border-white shadow-sm">
                  <AlertOctagon size={16} className="text-gray-500" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">
              Caracterización Avanzada
            </h3>
            <div className="w-12 h-1 bg-gray-200 rounded-full mb-4 group-hover:bg-emerald-200 transition-colors"></div>

            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
              Algoritmo matemático completo (basado en{" "}
              <strong>Stoffenmanager®</strong>). Permite control total sobre
              parámetros cuantitativos:
              <ul className="mt-2 space-y-1 text-left bg-gray-50 p-3 rounded-lg text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">⚙️</span> Simulación de
                  escenarios complejos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">📏</span> Distancias y
                  volúmenes exactos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">🌡️</span> Presión de vapor y
                  temperatura
                </li>
              </ul>
            </p>

            <button className="py-3 px-8 rounded-xl font-bold text-sm bg-white border border-gray-200 text-gray-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-sm w-full">
              Configuración Manual
            </button>
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
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                padding: "0.75rem",
                background: "white",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                🏛️
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: "var(--color-text-main)",
                }}
              >
                Fichas BASEQUIM
              </div>
              <div style={{ fontSize: "0.65rem", color: "#666" }}>INSST</div>
            </div>
            <div
              style={{
                padding: "0.75rem",
                background: "white",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                ⚖️
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: "var(--color-text-main)",
                }}
              >
                Guía Téc. RD 665
              </div>
              <div style={{ fontSize: "0.65rem", color: "#666" }}>
                Priorización Legal
              </div>
            </div>
            <div
              style={{
                padding: "0.75rem",
                background: "white",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                🌍
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: "var(--color-text-main)",
                }}
              >
                COSHH Essentials
              </div>
              <div style={{ fontSize: "0.65rem", color: "#666" }}>
                HSE Methodology
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar (Inline Styles for robustness) */}
        <div
          style={{
            position: "relative",
            maxWidth: "600px",
            margin: "0 auto 2rem auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
              pointerEvents: "none",
            }}
          >
            <Search size={22} />
          </div>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "1rem 1rem 1rem 3.5rem",
              fontSize: "1rem",
              border: searchFocused
                ? "2px solid var(--color-primary)"
                : "2px solid #e5e7eb",
              borderRadius: "50px",
              outline: "none",
              transition: "all 0.3s ease",
              boxShadow: searchFocused
                ? "0 4px 12px rgba(0, 155, 219, 0.1)"
                : "0 1px 2px rgba(0,0,0,0.05)",
              backgroundColor: "#fff",
            }}
            placeholder="Buscar proceso... (Ej: Soldadura, Madera, Sílice...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            autoFocus
          />
        </div>

        {/* Results Grid */}
        {/* Results Grid - Split into Recommended and Others */}
        {(searchFocused || searchTerm.length > 0) && (
          <div className="scenario-grid-container">
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
                  marginBottom: "1rem",
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

            {(() => {
              // Split Logic
              const subName = hazardData?.substanceName?.toLowerCase() || "";

              const recommended = filteredScenarios.filter(
                (s) =>
                  hazardData?.substanceName &&
                  s.relatedSubstances?.some((rs) => subName.includes(rs)),
              );

              const renderScenario = (scenario: StandardScenario) => (
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
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {scenario.title}
                      {/* Recommendation Badges */}
                      {recommended.includes(scenario) && (
                        <span
                          style={{
                            fontSize: "0.6rem",
                            background: "#dcfce7", // green-100
                            color: "#166534", // green-800
                            padding: "2px 6px",
                            borderRadius: "99px",
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          Recomendado ({hazardData?.substanceName})
                        </span>
                      )}
                    </h4>

                    {/* Tags for Substance and Category */}
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        flexWrap: "wrap",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {scenario.relatedSubstances?.map((rs) => (
                        <span
                          key={rs}
                          style={{
                            fontSize: "0.65rem",
                            background: "#f1f5f9",
                            color: "#475569",
                            padding: "1px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          🧬 {rs}
                        </span>
                      ))}
                      {scenario.risks.map((r) => {
                        const riskLabel =
                          {
                            carcinogen: "Cancerígeno",
                            mutagen: "Mutágeno",
                            reprotoxic: "Reprotóxico",
                            sensitizer: "Sensibilizante",
                            other: "Otro Riesgo",
                          }[r] || r;
                        return (
                          <span
                            key={r}
                            style={{
                              fontSize: "0.65rem",
                              background: "#fee2e2",
                              color: "#991b1b",
                              padding: "1px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            ☢️ {riskLabel}
                          </span>
                        );
                      })}
                    </div>

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
              );

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                  }}
                >
                  {recommended.length > 0 && (
                    <div>
                      <h4
                        style={{
                          fontSize: "1rem",
                          color: "#166534",
                          marginBottom: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <CheckCircle2 size={18} /> Escenarios Vinculados a{" "}
                        {hazardData?.substanceName}
                      </h4>
                      <div className="scenario-grid">
                        {recommended.map(renderScenario)}
                      </div>
                    </div>
                  )}

                  {/* Expert Mode Fallback */}
                  <div className="mt-8 pt-8 border-t border-gray-100 animate-fadeIn">
                    <h4 className="text-sm font-medium text-gray-500 mb-4 text-center">
                      Si no encuentras un escenario estándar pulsa en el
                      siguiente botón para configurar manualmente tu escenario
                    </h4>

                    <div
                      onClick={() => setMode("expert")}
                      className="mx-auto max-w-sm bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group text-center"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors">
                        <Shield
                          size={24}
                          className="text-gray-400 group-hover:text-blue-500 transition-colors"
                        />
                      </div>

                      <h3 className="font-bold text-gray-700 mb-2 group-hover:text-blue-700">
                        Modo Experto / Libre
                      </h3>

                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        Configure manualmente cada parámetro de la evaluación
                        cualitativa. Ideal para procesos atípicos.
                      </p>

                      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                        Manual de configuración
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
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

  // EXPERT MODE FORM (Premium Visual Overhaul)
  return (
    <div className="animate-fadeIn">
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--color-text-main)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Shield size={24} color="var(--color-primary)" />
          Caracterización Básica
          {activeScenario && (
            <a
              href={activeScenario.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#eff6ff",
                color: "var(--color-primary)",
                fontSize: "0.75rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "99px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                transition: "background-color 0.2s",
                border: "1px solid #dbeafe",
              }}
              className="hover:bg-blue-100"
            >
              <BookOpen size={12} /> {activeScenario.source}
            </a>
          )}
        </h3>
        <button
          onClick={() => {
            setMode("selection");
            setSelectedScenarioId(undefined);
          }}
          style={{
            fontSize: "0.9rem",
            color: "#9ca3af",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          ✕ Cambiar modo
        </button>
      </div>

      {/* Gap Warning Banner */}
      {showGapWarning && activeScenario && (
        <div
          style={{
            background: "#fef2f2",
            borderLeft: "4px solid #ef4444",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <AlertOctagon
            className="text-red-600 flex-shrink-0"
            size={24}
            color="#ef4444"
          />
          <div>
            <h5
              style={{ fontWeight: 700, color: "#7f1d1d", marginBottom: "4px" }}
            >
              Aviso de Conformidad (Gap Analysis)
            </h5>
            <p
              style={{ fontSize: "0.9rem", color: "#991b1b", lineHeight: 1.4 }}
            >
              {activeScenario.gapWarning}
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#ef4444",
                marginTop: "0.5rem",
                fontWeight: 600,
              }}
            >
              ⚠️ Se inyectará una advertencia en el informe final.
            </p>
          </div>
        </div>
      )}

      {/* A. PROCESO */}
      <div className="expert-form-card">
        <div className="expert-section-header">
          <Factory size={20} /> A. Proceso (Fuente de Emisión)
        </div>

        <div className="expert-input-group">
          <label className="expert-label">
            Descripción del Proceso / Tarea
          </label>
          <input
            type="text"
            className="expert-input"
            placeholder="Ej. Limpieza manual de rodillos con disolvente"
            value={form.processDescription}
            onChange={(e) => handleChange("processDescription", e.target.value)}
          />
        </div>

        <div className="expert-input-group">
          <label className="expert-label">Tipo de Proceso</label>
          <div className="radio-card-group">
            <label className="radio-card-option">
              <input
                type="radio"
                checked={form.isOpenProcess}
                onChange={() => handleChange("isOpenProcess", true)}
              />
              <div className="radio-card-content">
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  👐
                </div>
                <span style={{ fontWeight: 600 }}>Proceso Abierto</span>
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  Exposición directa
                </span>
              </div>
            </label>
            <label className="radio-card-option">
              <input
                type="radio"
                checked={!form.isOpenProcess}
                onChange={() => handleChange("isOpenProcess", false)}
              />
              <div className="radio-card-content">
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  🔒
                </div>
                <span style={{ fontWeight: 600 }}>Sistema Cerrado</span>
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  Sin exposición directa
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* B. MEDIDAS TÉCNICAS */}
      <div className="expert-form-card">
        <div className="expert-section-header">
          <Shield size={20} /> B. Medidas Técnicas (Jerarquía RD 665)
        </div>

        <div className="expert-input-group">
          <label className="expert-label">Medida de Control Implementada</label>
          <select
            className="expert-select"
            value={form.technicalMeasure}
            onChange={(e) =>
              handleChange(
                "technicalMeasure",
                e.target.value as
                  | "closed_system"
                  | "containment_extraction"
                  | "local_extraction"
                  | "suppression"
                  | "general_ventilation"
                  | "none",
              )
            }
            style={{
              borderColor: showGapWarning || showLegalAlert ? "#fca5a5" : "",
            }}
          >
            <option value="closed_system">
              1. Sistema Cerrado Estanco (Prioritario)
            </option>
            <option value="containment_extraction">
              2. Cerramiento con Extracción (Vitrinas/Cabinas)
            </option>
            <option value="local_extraction">
              3. Extracción Localizada (LEV)
            </option>
            <option value="suppression">
              4. Supresión Húmeda / Abatimiento
            </option>
            <option value="general_ventilation">5. Ventilación General</option>
            <option value="none">6. Ninguna / Ventilación Natural</option>
          </select>
        </div>
      </div>

      {/* C & D. ENTORNO Y ORGANIZACIÓN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div className="expert-form-card" style={{ marginBottom: 0 }}>
          <div className="expert-section-header">
            <Factory size={20} /> Entorno
          </div>

          <div className="expert-input-group">
            <label className="expert-label">Limpieza</label>
            <select
              className="expert-select"
              value={form.cleaningMethod}
              onChange={(e) =>
                handleChange(
                  "cleaningMethod",
                  e.target.value as "hepa_wet" | "sweeping" | "none",
                )
              }
            >
              <option value="hepa_wet">Aspiración HEPA / Húmeda</option>
              <option value="sweeping">Barrido (🚫 Prohibido)</option>
              <option value="none">No aplica</option>
            </select>
            {form.cleaningMethod === "sweeping" && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#dc2626",
                  marginTop: "0.25rem",
                  fontWeight: 600,
                }}
              >
                ⚠️ El barrido en seco dispersa el contaminante.
              </div>
            )}
          </div>

          <div className="expert-input-group">
            <label className="expert-label">Organización</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                className={`toggle-checkbox-wrapper ${form.accessRestricted ? "checked" : ""}`}
                onClick={() =>
                  handleChange("accessRestricted", !form.accessRestricted)
                }
              >
                <span style={{ fontSize: "0.9rem" }}>Acceso Restringido</span>
                <input
                  type="checkbox"
                  checked={form.accessRestricted}
                  readOnly
                  className="toggle-checkbox"
                />
              </div>
              <div
                className={`toggle-checkbox-wrapper ${form.signageGHS08 ? "checked" : ""}`}
                onClick={() => handleChange("signageGHS08", !form.signageGHS08)}
              >
                <span style={{ fontSize: "0.9rem" }}>Señalización GHS08</span>
                <input
                  type="checkbox"
                  checked={form.signageGHS08}
                  readOnly
                  className="toggle-checkbox"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="expert-form-card" style={{ marginBottom: 0 }}>
          <div className="expert-section-header">
            <Users size={20} /> Personal
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="expert-input-group">
              <label className="expert-label">Frecuencia</label>
              <select
                className="expert-select"
                value={form.frequency}
                onChange={(e) =>
                  handleChange(
                    "frequency",
                    e.target.value as "daily" | "weekly" | "sporadic",
                  )
                }
              >
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
                <option value="sporadic">Esporádica</option>
              </select>
            </div>
            <div className="expert-input-group">
              <label className="expert-label">Duración</label>
              <select
                className="expert-select"
                value={form.duration}
                onChange={(e) =>
                  handleChange(
                    "duration",
                    e.target.value as "lt_15m" | "15m_2h" | "2h_4h" | "gt_4h",
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

          <div className="expert-input-group">
            <label className="expert-label">EPI Respiratorio</label>
            <input
              type="text"
              className="expert-input"
              placeholder="Ej. Máscara P3"
              value={form.respiratoryPPE}
              onChange={(e) => handleChange("respiratoryPPE", e.target.value)}
            />
          </div>

          <div
            className={`toggle-checkbox-wrapper ${form.hygieneRights ? "checked" : ""}`}
            onClick={() => handleChange("hygieneRights", !form.hygieneRights)}
            style={{ borderColor: form.hygieneRights ? "#86efac" : "" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <CheckCircle2
                size={16}
                color={form.hygieneRights ? "#16a34a" : "#9ca3af"}
              />
              <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                10 min Aseo (Tiempo Ef.)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Observations Field (Issue #1 & #2) */}
      <div style={{ marginTop: "1.5rem" }}>
        <label
          className="expert-label"
          style={{ marginBottom: "0.5rem", display: "block" }}
        >
          Observaciones Adicionales
        </label>
        <textarea
          className="expert-input"
          placeholder="Añadir observaciones o detalles adicionales sobre la tarea..."
          value={form.observations || ""}
          onChange={(e) => handleChange("observations", e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      </div>
    </div>
  );
};
