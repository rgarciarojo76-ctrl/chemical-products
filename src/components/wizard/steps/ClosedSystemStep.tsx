import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Factory,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import type { ClosedSystemAnalysis, PhaseAnalysis } from "../../../types";
import {
  calculateSystemCost,
  generateJustificationText,
  generateInvestmentText,
  STANDARD_REASONS,
} from "../../../utils/closedSystemEngine";

interface ClosedSystemStepProps {
  onUpdate: (analysis: ClosedSystemAnalysis) => void;
  onNext: () => void;
  onBack: () => void;
  initialData?: ClosedSystemAnalysis;
}

const INITIAL_PHASES: Record<
  "loading" | "process" | "emptying" | "maintenance",
  PhaseAnalysis
> = {
  loading: {
    id: "A",
    name: "Carga / Alimentación",
    isViable: false,
    status: "pending",
  } as PhaseAnalysis,
  process: {
    id: "B",
    name: "Proceso / Reacción",
    isViable: false,
    status: "pending",
  } as PhaseAnalysis,
  emptying: {
    id: "C",
    name: "Vaciado / Envasado",
    isViable: false,
    status: "pending",
  } as PhaseAnalysis,
  maintenance: {
    id: "D",
    name: "Limpieza / Mant.",
    isViable: false,
    status: "pending",
  } as PhaseAnalysis,
};

export const ClosedSystemStep: React.FC<ClosedSystemStepProps> = ({
  onUpdate,
  onNext,
  onBack,
  initialData,
}) => {
  const [isClosed, setIsClosed] = useState<boolean | null>(
    initialData?.isClosedSystem ?? null,
  );
  const [phases, setPhases] = useState<Record<string, PhaseAnalysis>>(
    initialData?.phases || INITIAL_PHASES,
  );
  const [materialFactor, setMaterialFactor] = useState<1.0 | 1.4>(
    initialData?.financials?.materialFactor || 1.0,
  );
  const [activeTab, setActiveTab] = useState<
    "loading" | "process" | "emptying" | "maintenance"
  >("loading");

  // Derive estimate based on current state
  // Derive estimate based on current state
  const estimate = useMemo<ReturnType<
    typeof calculateSystemCost
  > | null>(() => {
    if (isClosed === false) {
      return calculateSystemCost(
        {
          isClosedSystem: false,
          phases: phases as ClosedSystemAnalysis["phases"],
          outputDoc: "exemption_justification",
        }, // temp obj
        materialFactor,
      );
    }
    return null;
  }, [isClosed, phases, materialFactor]);

  // Sync parent state
  useEffect(() => {
    if (isClosed === false && estimate) {
      // Determine output doc type
      const anyViable = Object.values(phases).some((p) => p.isViable);
      const outputDoc = anyViable
        ? "investment_plan"
        : "exemption_justification";

      onUpdate({
        isClosedSystem: false,
        phases: phases as ClosedSystemAnalysis["phases"],
        financials: estimate,
        outputDoc,
      });
    } else if (isClosed === true) {
      onUpdate({
        isClosedSystem: true,
        phases: INITIAL_PHASES as ClosedSystemAnalysis["phases"],
        outputDoc: "exemption_justification", // Not used if closed
      });
    }
  }, [isClosed, phases, materialFactor, estimate, onUpdate]); // Added props to dep array, but careful with loops. Using JSON stringify might be safer if frequent updates.
  // Actually onUpdate is stable usually.

  const updatePhase = (key: string, updates: Partial<PhaseAnalysis>) => {
    setPhases((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }));
  };

  const renderPhaseContent = (
    key: "loading" | "process" | "emptying" | "maintenance",
  ) => {
    const phase = phases[key];
    const reasons: string[] =
      (STANDARD_REASONS as Record<string, string[]>)[key] || [];

    const phaseImages = {
      loading: "/images/closed_system/phase_a_loading.png",
      process: "/images/closed_system/phase_b_process.png",
      emptying: "/images/closed_system/phase_c_discharge.png",
      maintenance: "/images/closed_system/phase_d_cleaning.png",
    };

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
        {/* Visual Schematic */}
        <div className="mb-6 flex justify-center bg-white p-4 rounded border border-gray-100 shadow-sm">
          <img
            src={phaseImages[key]}
            alt={`Esquema Fase ${phase.name}`}
            className="max-h-48 object-contain"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <Factory size={18} /> Fase {phase.id}: {phase.name}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() =>
                updatePhase(key, {
                  isViable: true,
                  reasons: [],
                  status: "evaluated",
                })
              }
              className={`px-3 py-1 rounded text-sm font-bold flex items-center gap-1 transition-colors ${
                phase.isViable
                  ? "bg-green-600 text-white shadow"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
            >
              <CheckCircle2 size={14} /> VIABLE
            </button>
            <button
              onClick={() =>
                updatePhase(key, {
                  isViable: false,
                  costInputs: {},
                  status: "evaluated",
                })
              }
              className={`px-3 py-1 rounded text-sm font-bold flex items-center gap-1 transition-colors ${
                !phase.isViable
                  ? "bg-red-600 text-white shadow"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
            >
              <XCircle size={14} /> NO VIABLE
            </button>
          </div>
        </div>

        {phase.isViable ? (
          <div className="animate-fadeIn space-y-4">
            <div className="p-3 bg-green-50 text-green-800 text-sm rounded border border-green-200">
              <p>
                <strong>Mejora Técnica:</strong> Estimar inversión para cerrar
                esta fase.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {key === "loading" && (
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Puntos de Carga
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={phase.costInputs?.units || 0}
                    onChange={(e) =>
                      updatePhase(key, {
                        costInputs: {
                          ...phase.costInputs,
                          units: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              )}
              {key === "process" && (
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Volumen Reactor ($m^3$)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={phase.costInputs?.volume || 0}
                    onChange={(e) =>
                      updatePhase(key, {
                        costInputs: {
                          ...phase.costInputs,
                          volume: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              )}
              {key === "emptying" && (
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Líneas de Envasado
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={phase.costInputs?.units || 0}
                    onChange={(e) =>
                      updatePhase(key, {
                        costInputs: {
                          ...phase.costInputs,
                          units: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              )}
              {key === "maintenance" && (
                <div className="col-span-2 text-sm text-gray-500 italic">
                  * El coste de mejoras en limpieza (CIP) requiere estudio
                  específico. Se incluirá como recomendación cualitativa.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn space-y-3">
            <div className="p-3 bg-red-50 text-red-800 text-sm rounded border border-red-200">
              <p>
                <strong>Justificación Técnica:</strong> Seleccione los
                impedimentos.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {reasons.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 text-sm cursor-pointer p-2 hover:bg-gray-100 rounded"
                >
                  <input
                    type="checkbox"
                    checked={phase.reasons?.includes(r)}
                    onChange={(e) => {
                      const newReasons = e.target.checked
                        ? [...(phase.reasons || []), r]
                        : (phase.reasons || []).filter((x) => x !== r);
                      updatePhase(key, { reasons: newReasons });
                    }}
                  />
                  {r}
                </label>
              ))}
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 mt-2">
                Observaciones Adicionales
              </label>
              <textarea
                className="w-full p-2 border rounded text-sm"
                rows={2}
                value={phase.comments || ""}
                onChange={(e) => updatePhase(key, { comments: e.target.value })}
                placeholder="Detalle técnico específico..."
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-blue-900">
          <ShieldCheck /> Módulo Ingeniería: Sistemas Cerrados (Art. 5.2)
        </h2>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 className="font-bold text-lg mb-2">
            D.2 ¿Se utiliza el agente en un sistema cerrado?
          </h3>
          <p className="text-sm text-blue-800 mb-4">
            Un sistema cerrado impide cualquier liberación del agente al
            ambiente laboral.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setIsClosed(true)}
              className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${
                isClosed === true
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              ✅ SÍ, es cerrado
            </button>
            <button
              onClick={() => setIsClosed(false)}
              className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${
                isClosed === false
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 hover:border-red-300"
              }`}
            >
              ❌ NO, es abierto/semi
            </button>
          </div>
        </div>

        {isClosed === false && (
          <div className="space-y-6 animate-fadeIn">
            {/* TABS */}
            <div className="flex border-b">
              {(["loading", "process", "emptying", "maintenance"] as const).map(
                (k) => {
                  const p = phases[k];
                  const isActive = activeTab === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setActiveTab(k)}
                      className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                        isActive
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Fase {p.id}
                      {p.isViable ? (
                        <span className="ml-1 text-green-500">●</span>
                      ) : (
                        <span className="ml-1 text-red-500">●</span>
                      )}
                    </button>
                  );
                },
              )}
            </div>

            {/* CONTENT */}
            <div>
              {activeTab === "loading" && renderPhaseContent("loading")}
              {activeTab === "process" && renderPhaseContent("process")}
              {activeTab === "emptying" && renderPhaseContent("emptying")}
              {activeTab === "maintenance" && renderPhaseContent("maintenance")}
            </div>

            {/* MATERIAL FACTOR & TOTAL */}
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    Estimación Económica (2026)
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Solo para fases marcadas como VIABLES
                  </p>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={materialFactor === 1.4}
                      onChange={(e) =>
                        setMaterialFactor(e.target.checked ? 1.4 : 1.0)
                      }
                    />
                    <span className="text-sm font-medium">
                      Requiere Acero INOX (+40%)
                    </span>
                  </label>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-black text-slate-800">
                    {estimate?.totalCost.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                  <span className="text-xs text-slate-500 uppercase font-bold">
                    Inversión Propuesta
                  </span>
                </div>
              </div>
            </div>

            {/* DOC PREVIEW */}
            {/* DOC PREVIEW */}
            <div
              className={`mt-4 p-4 rounded text-sm font-mono whitespace-pre-wrap border ${
                Object.values(phases).some((p) => p.isViable)
                  ? "bg-blue-50 border-blue-200 text-blue-900"
                  : "bg-orange-50 border-orange-200 text-orange-900"
              }`}
            >
              <h5 className="font-bold mb-2 flex items-center gap-2">
                <FileText size={14} />
                {Object.values(phases).some((p) => p.isViable)
                  ? "GENERANDO: PLAN DE INVERSIÓN"
                  : "GENERANDO: JUSTIFICACIÓN EXENCIÓN"}
              </h5>
              {Object.values(phases).some((p) => p.isViable) && estimate
                ? generateInvestmentText(
                    {
                      isClosedSystem: false,
                      phases: phases as ClosedSystemAnalysis["phases"],
                      outputDoc: "investment_plan",
                    } as ClosedSystemAnalysis,
                    estimate,
                  )
                : generateJustificationText({
                    isClosedSystem: false,
                    phases: phases as ClosedSystemAnalysis["phases"],
                    outputDoc: "exemption_justification",
                  } as ClosedSystemAnalysis)}
            </div>
          </div>
        )}

        {isClosed === true && (
          <div className="mt-6 p-6 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center gap-4">
            <CheckCircle2 size={32} />
            <div>
              <h4 className="font-bold">Cumplimiento Art. 5.2 Confirmado</h4>
              <p className="text-sm">
                El sistema cerrado es la medida prioritaria. No se requieren más
                acciones de ingeniería.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          disabled={
            isClosed === null ||
            (isClosed === false &&
              Object.values(phases).some((p) => p.status !== "evaluated"))
          }
          className={`px-6 py-2 rounded-lg font-bold shadow-md transition-all ${
            isClosed === null ||
            (isClosed === false &&
              Object.values(phases).some((p) => p.status !== "evaluated"))
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Guardar y Continuar →
        </button>
      </div>
    </div>
  );
};
