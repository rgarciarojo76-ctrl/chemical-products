import React, { useState, useCallback } from "react";
import {
  AlertTriangle,
  Shield,
  Clipboard,
  Factory,
  Users,
  Search,
  BookOpen,
  AlertOctagon,
} from "lucide-react";
import type { BasicCharacterizationInput, HazardInput } from "../../../types";
import {
  StandardScenarios_DB,
  StandardScenario,
} from "../../../data/standardScenarios";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div
          className="card p-6 border-2 border-dashed border-blue-200 hover:border-blue-500 cursor-pointer transition-all hover:bg-blue-50 flex flex-col items-center text-center justify-center"
          onClick={() => setMode("assistant")}
        >
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Clipboard size={32} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Asistente de Escenarios Estándar
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Seleccione una ficha técnica del INSST (e.g., Soldadura, Madera).
          </p>
          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
            Recomendado
          </span>
        </div>

        <div
          className="card p-6 border-2 border-dashed border-purple-200 hover:border-purple-500 cursor-pointer transition-all hover:bg-purple-50 flex flex-col items-center text-center justify-center"
          onClick={() => setMode("expert")}
        >
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <Shield size={32} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Modo Experto / Libre
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Caracterización manual paso a paso.
          </p>
        </div>
      </div>
    );
  }

  if (mode === "assistant") {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
            <BookOpen size={20} className="text-blue-600" /> Buscador de
            Escenarios Estándar
          </h3>
          <p className="text-sm text-gray-500">
            Basado en Fichas Técnicas del INSST y Guías de Buenas Prácticas
          </p>
        </div>

        <div className="relative max-w-lg mx-auto mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            className="w-full pl-10 p-3 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Buscar tarea... Ej: 'Soldadura', 'Madera', 'Humo'..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer hover:border-blue-300 transition-all bg-white"
              onClick={() => selectScenario(scenario)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{scenario.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">
                    {scenario.title}
                  </h4>
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded inline-block mb-1">
                    {scenario.source}
                  </span>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {scenario.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredScenarios.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 py-8">
              No se encontraron escenarios. Pruebe otra búsqueda o use el Modo
              Experto.
            </p>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setMode("selection")}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Volver atrás
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
