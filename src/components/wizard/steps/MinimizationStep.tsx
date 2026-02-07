import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  Settings,
  ClipboardList,
} from "lucide-react";

interface MinimizationStepProps {
  onUpdate: (implemented: boolean, justification: string) => void;
  onNext: () => void;
  onBack: () => void;
}

type PathType = "qualitative" | "quantitative" | null;

interface CheckItem {
  id: string;
  title: string;
  juniorText: string;
  rigorText: string;
  status: "yes" | "no" | null; // yes = compliant, no = non-compliant
  failureType?: "correctible" | "technical"; // Only if status === 'no'
  technicalReason?: string; // If failureType === 'technical'
}

export const MinimizationStep: React.FC<MinimizationStepProps> = ({
  onUpdate,
  onNext,
  onBack,
}) => {
  const [selectedPath, setSelectedPath] = useState<PathType>(null);

  const [qualitativeItems, setQualitativeItems] = useState<CheckItem[]>([
    {
      id: "stock",
      title: "Gestión de Stock",
      juniorText:
        "¿El volumen en el área se limita al consumo de la jornada? (¿Hay garrafas de más?)",
      rigorText: "Suficiencia de stock vs Acumulación innecesaria.",
      status: null,
    },
    {
      id: "containers",
      title: "Integridad de Contenedores",
      juniorText:
        "¿Se mantienen cerrados si no están en uso? (¿Hay botes abiertos?)",
      rigorText: "Prevención de exposición por evaporación/difusión.",
      status: null,
    },
    {
      id: "hygiene",
      title: "Higiene de Superficies",
      juniorText: "¿Hay restos o manchas en el área? (¿Está la mesa sucia?)",
      rigorText: "Control de carga química residual en superficies.",
      status: null,
    },
  ]);

  const [quantitativeItems, setQuantitativeItems] = useState<CheckItem[]>([
    {
      id: "load",
      title: "Ajuste de Carga",
      juniorText: "¿El volumen coincide con la capacidad nominal del equipo?",
      rigorText: "Prevención de sobrellenado operativo.",
      status: null,
    },
    {
      id: "dosing",
      title: "Tecnología de Dosificación",
      juniorText: "¿Es automática o de precisión? (¿Se echa con báscula/auto?)",
      rigorText: "Minimización de desviación por manipulación manual.",
      status: null,
    },
    {
      id: "formula",
      title: "Optimización de Fórmula",
      juniorText: "¿Se ha reducido la concentración al mínimo funcional?",
      rigorText: "Reducción de la fracción de masa del agente.",
      status: null,
    },
  ]);

  const activeItems =
    selectedPath === "qualitative" ? qualitativeItems : quantitativeItems;
  const setActiveItems =
    selectedPath === "qualitative" ? setQualitativeItems : setQuantitativeItems;

  const handleStatusChange = (id: string, newStatus: "yes" | "no") => {
    setActiveItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              failureType: newStatus === "yes" ? undefined : "correctible",
            }
          : item,
      ),
    );
  };

  const handleFailureTypeChange = (
    id: string,
    type: "correctible" | "technical",
  ) => {
    setActiveItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, failureType: type } : item,
      ),
    );
  };

  const handleTechnicalReasonChange = (id: string, reason: string) => {
    setActiveItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, technicalReason: reason } : item,
      ),
    );
  };

  // Generate Justification Logic
  useEffect(() => {
    if (!selectedPath) return;

    const allAnswered = activeItems.every((i) => i.status !== null);
    if (!allAnswered) return;

    const nonCompliances = activeItems.filter((i) => i.status === "no");
    const technicalFailures = nonCompliances.filter(
      (i) => i.failureType === "technical",
    );
    const correctibleFailures = nonCompliances.filter(
      (i) => i.failureType === "correctible",
    );

    let implemented = false;
    let justification = "";

    if (nonCompliances.length === 0) {
      implemented = true;
      justification = `CERTIFICACIÓN DE MINIMIZACIÓN (Art. 5.3.a RD 665/1997):

Se certifica que la cantidad de agente en el puesto de trabajo está limitada al mínimo estrictamente necesario.
Evidencias observadas:
${activeItems.map((i) => `- ${i.title}: Controlado conforme a criterio técnico.`).join("\n")}

Conclusión: Riesgo por cantidad acumulada minimizado correctamente.`;
    } else {
      // Logic: If there are technical limitations, it might still be "implemented" in the sense of "best effort",
      // but strictly it's a "NO" to the question "Is it minimized?".
      // Actually, if it's the "Technical Minimum Possible", then YES, it is minimized (to the minimum *necessary*).
      // So if ALL failures are TECHNICAL, then Implemented = TRUE (with justification).
      // If ANY failure is CORRECTIBLE, then Implemented = FALSE (needs action).

      if (correctibleFailures.length > 0) {
        implemented = false;
        justification = `DESVIACIÓN IDENTIFICADA (Art. 5.3.a RD 665/1997):

Se han detectado desviaciones que impiden certificar la minimización completa del agente:

${correctibleFailures
  .map((i) => {
    let action = "";
    if (i.id === "stock")
      action =
        "Plan de Acción: Diseñar e implantar procedimiento de suministro 'Just-in-Time'.";
    if (i.id === "containers")
      action =
        "Plan de Acción: Reforzar política de recipientes cerrados y tapas.";
    if (i.id === "hygiene")
      action =
        "Plan de Acción: Revisar protocolo de limpieza y frecuencia de retirada de residuos.";
    if (i.id === "load")
      action = "Plan de Acción: Ajustar procedimientos de carga operativa.";
    if (i.id === "dosing")
      action =
        "Plan de Acción: Evaluar instalación de sistemas de pesaje/dosificación automática.";
    if (i.id === "formula")
      action =
        "Plan de Acción: Analizar viabilidad de reducción de concentración en I+D.";

    return `❌ ${i.title}: Desviación operativa.\n   -> ${action}`;
  })
  .join("\n\n")}

${technicalFailures.length > 0 ? "\nAdicionalmente, existen limitaciones técnicas justificadas:" : ""}
${technicalFailures.map((i) => `- ${i.title}: ${i.technicalReason || "Justificación técnica no detallada."}`).join("\n")}
`;
      } else {
        // Only technical failures -> It IS minimized to the technical limit
        implemented = true;
        justification = `JUSTIFICACIÓN DE MÍNIMO TÉCNICO ALCANZABLE (Art. 5.3.a RD 665/1997):

Aunque existen factores no ideales, se justifica que la cantidad presente es la mínima necesaria por razones técnicas:

${technicalFailures
  .map(
    (i) =>
      `⚠️ ${i.title}: ${i.technicalReason || "Necesidad de proceso crítica."}`,
  )
  .join("\n\n")}

Conclusión: Se considera cumplido el criterio de "mínimo necesario" dadas las limitaciones actuales del proceso.`;
      }
    }

    onUpdate(implemented, justification);
  }, [selectedPath, activeItems, onUpdate]);

  if (!selectedPath) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800">
          Seleccione el tipo de evaluación
        </h3>
        <p className="text-gray-600">
          Elija el enfoque más adecuado para auditar la minimización del agente
          en este puesto:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedPath("qualitative")}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-bold text-lg text-gray-800 mb-2">
              Evaluación Cualitativa
            </h4>
            <span className="text-sm text-gray-500 font-medium tracking-wider mb-2">
              ENFOQUE ORGANIZATIVO
            </span>
            <p className="text-gray-600 text-sm">
              Ideal para puestos manuales, almacenes o tareas de mantenimiento.
              Se enfoca en gestión de stock, integridad de envases e higiene.
            </p>
          </button>

          <button
            onClick={() => setSelectedPath("quantitative")}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center group"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200">
              <Settings className="w-8 h-8 text-indigo-600" />
            </div>
            <h4 className="font-bold text-lg text-gray-800 mb-2">
              Evaluación Cuantitativa
            </h4>
            <span className="text-sm text-gray-500 font-medium tracking-wider mb-2">
              ENFOQUE DE PROCESO
            </span>
            <p className="text-gray-600 text-sm">
              Para líneas de producción, reactores o procesos automatizados. Se
              enfoca en capacidades de carga, dosificación y formulación.
            </p>
          </button>
        </div>
      </div>
    );
  }

  const allAnswered = activeItems.every((i) => i.status !== null);
  const hasDetailsPending = activeItems.some(
    (i) =>
      i.status === "no" &&
      i.failureType === "technical" &&
      (!i.technicalReason || i.technicalReason.length < 5),
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between mb-4">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          ← Cancelar
        </button>
        <button
          onClick={() => {
            setSelectedPath(null);
            onUpdate(false, "");
          }}
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
        >
          ↻ Reiniciar Auditoría
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            {selectedPath === "qualitative" ? (
              <ClipboardList className="w-5 h-5 text-blue-600" />
            ) : (
              <Settings className="w-5 h-5 text-indigo-600" />
            )}
            Auditoría de Minimización (
            {selectedPath === "qualitative" ? "Cualitativa" : "Cuantitativa"})
          </h3>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
            Art. 5.3.a
          </span>
        </div>

        <div className="p-6 space-y-6">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-1">
                    {item.juniorText}
                  </p>
                  <p className="text-xs text-blue-600 font-medium bg-blue-50 inline-block px-2 py-0.5 rounded">
                    🎯 Criterio Auditor: {item.rigorText}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button
                    onClick={() => handleStatusChange(item.id, "yes")}
                    className={`p-2 rounded-lg border transition-all ${
                      item.status === "yes"
                        ? "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-200"
                        : "bg-white border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-500"
                    }`}
                    title="Cumple correctamente"
                  >
                    <Check className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, "no")}
                    className={`p-2 rounded-lg border transition-all ${
                      item.status === "no"
                        ? "bg-red-100 border-red-500 text-red-700 ring-2 ring-red-200"
                        : "bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
                    }`}
                    title="No cumple / Desviación"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Logic for NO answer */}
              {item.status === "no" && (
                <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-4 animate-in zoom-in-95 duration-200">
                  <h5 className="font-semibold text-red-800 text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Análisis de la Desviación:
                  </h5>

                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`failure-${item.id}`}
                        checked={item.failureType === "correctible"}
                        onChange={() =>
                          handleFailureTypeChange(item.id, "correctible")
                        }
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Error Corregible (Gestión)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`failure-${item.id}`}
                        checked={item.failureType === "technical"}
                        onChange={() =>
                          handleFailureTypeChange(item.id, "technical")
                        }
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Limitación Técnica (Justificable)
                      </span>
                    </label>
                  </div>

                  {item.failureType === "correctible" ? (
                    <div className="text-sm text-red-700 bg-white p-2 rounded border border-red-100">
                      🤖 <strong>Acción Automática:</strong> Se generará una
                      entrada en el Plan de Acción para corregir este punto.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-600 block">
                        Justificación Técnica Obligatoria (Defensa de Mínimo
                        Técnico):
                      </label>
                      <textarea
                        value={item.technicalReason || ""}
                        onChange={(e) =>
                          handleTechnicalReasonChange(item.id, e.target.value)
                        }
                        className="w-full text-sm p-2 border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        placeholder="Explique por qué técnicamente es imposible reducir más la cantidad..."
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!allAnswered || hasDetailsPending}
          className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            allAnswered && !hasDetailsPending
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Confirmar y Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
