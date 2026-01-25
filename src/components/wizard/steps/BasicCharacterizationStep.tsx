import React, { useState, useCallback } from "react";
import { AlertTriangle, Shield, Clipboard, Factory, Users } from "lucide-react";
import type { BasicCharacterizationInput, HazardInput } from "../../../types";

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

  // Local state for form if not provided
  const [form, setForm] = useState<BasicCharacterizationInput>(
    data || {
      processDescription: "",
      isOpenProcess: true,
      technicalMeasure: "none",
      cleaningMethod: "hepa_wet", // Default per prompt
      accessRestricted: true, // Default per prompt
      signageGHS08: true, // Default per prompt
      respiratoryPPE: "",
      dermalPPE: "",
      hygieneRights: false,
      frequency: "daily",
      duration: "gt_4h",
    },
  );

  // Derived State: Validate Measures (Prompt Point 2B)
  // Assumption: Hazard Data needed to know if it's Cancer 1A/1B.
  // Simplified check: If H350/H360 present.
  const isCarcinogen = hazardData?.hPhrases.some((h) =>
    ["H350", "H360", "H350i", "H360D", "H360F", "H360FD"].includes(h),
  );
  const showMeasureAlert = !!(
    isCarcinogen && form.technicalMeasure !== "closed_system"
  );

  // Backend: Narrative Generator (Prompt Point 3)
  const generateNarrative = useCallback(
    (
      currentForm: BasicCharacterizationInput,
      showAlert: boolean,
    ): BasicCharacterizationInput => {
      const measureText = {
        closed_system: "un sistema cerrado estanco",
        local_extraction: "extraccion localizada",
        general_ventilation: "ventilación general",
        none: "ninguna medida técnica específica",
      }[currentForm.technicalMeasure];

      const narrative = `Se ha realizado la caracterización básica del puesto. El proceso implica ${currentForm.processDescription || "una actividad no descrita"} con ${currentForm.isOpenProcess ? "procesos abiertos" : "sistemas cerrados"}. Las medidas de control implementadas consisten en ${measureText}, ${showAlert ? "requiriendo justificación según Art. 5 RD 665/1997." : "consideradas adecuadas."}`;

      // Compliance Logic (Simplified)
      let compliance: "green" | "red" | "unknown" = "unknown";
      if (
        currentForm.technicalMeasure === "closed_system" &&
        !currentForm.isOpenProcess
      )
        compliance = "green";
      else if (currentForm.technicalMeasure === "none") compliance = "red";

      return {
        ...currentForm,
        autoNarrative: narrative,
        complianceResult: compliance,
      };
    },
    [],
  ); // Logic is pure now

  const handleChange = useCallback(
    (field: keyof BasicCharacterizationInput, value: string | boolean) => {
      setForm((prev) => {
        let updated = { ...prev, [field]: value };

        // Logic Engine: Auto Hygiene Rights (Prompt Point 2E)
        // If exposure is confirmed (simplified as "open process" or "poor measures")
        // Check if the change affects this condition
        const isExposureConfirmed =
          updated.isOpenProcess || updated.technicalMeasure === "none";

        if (isExposureConfirmed && !updated.hygieneRights) {
          updated = { ...updated, hygieneRights: true };
        }

        // We need to pass the derived 'showMeasureAlert' to narrative... but it depends on state.
        // We can re-calculate it here or use the closed-over one?
        // No, we must calculate it based on 'updated' state, not 'prev' or 'form'.
        const isCarcinogenCheck = hazardData?.hPhrases.some((h) =>
          ["H350", "H360", "H350i", "H360D", "H360F", "H360FD"].includes(h),
        );
        const alertActive = !!(
          isCarcinogenCheck && updated.technicalMeasure !== "closed_system"
        );

        onUpdate(generateNarrative(updated, alertActive));
        return updated;
      });
    },
    [onUpdate, generateNarrative, hazardData],
  );

  if (mode === "selection") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* OPTION A: Assistant */}
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
            Para usuarios junior o procesos típicos (Soldadura, Limpieza, etc.).
          </p>
          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
            Recomendado
          </span>
        </div>

        {/* OPTION B: Expert */}
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
            Caracterización detallada paso a paso con validación normativa.
          </p>
        </div>
      </div>
    );
  }

  if (mode === "assistant") {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-bold mb-4">🚧 En construcción</h3>
        <p>
          El Asistente de Escenarios Estándar estará disponible próximamente.
        </p>
        <button
          onClick={() => setMode("selection")}
          className="mt-4 text-blue-600 underline"
        >
          Volver
        </button>
      </div>
    );
  }

  // EXPERT MODE FORM
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Shield size={20} /> Caracterización Avanzada
        </h3>
        <button
          onClick={() => setMode("selection")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cambiar modo
        </button>
      </div>

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
            className={`w-full p-2 border rounded ${form.technicalMeasure === "none" ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}`}
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

          {showMeasureAlert && (
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
