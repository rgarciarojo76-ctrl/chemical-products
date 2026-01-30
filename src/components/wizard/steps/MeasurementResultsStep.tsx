import React, { useState, useEffect } from "react";
import {
  TestTube,
  Calculator,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import type { Sample, En689Result, GesData } from "../../../types";
import {
  calculateSampleConcentration,
  runEn689Evaluation,
} from "../../../utils/en689_calculator";

interface MeasurementResultsStepProps {
  onUpdate: (result: En689Result) => void;
  onNext: () => void;
  onBack: () => void;
  vlaReference?: number;
  gesData?: GesData;
  initialSamples?: Sample[];
}

export const MeasurementResultsStep: React.FC<MeasurementResultsStepProps> = ({
  onUpdate,
  onNext,
  onBack,
  vlaReference = 1.0, // Default Safety
  initialSamples = [],
  gesData,
}) => {
  const [samples, setSamples] = useState<Sample[]>(
    initialSamples.length > 0
      ? initialSamples
      : [
          // Default: 3 empty samples if required
          {
            id: "1",
            type: "direct",
            value: 0,
            isBelowLod: false,
          },
          {
            id: "2",
            type: "direct",
            value: 0,
            isBelowLod: false,
          },
          {
            id: "3",
            type: "direct",
            value: 0,
            isBelowLod: false,
          },
        ],
  );

  const [result, setResult] = useState<En689Result | null>(null);

  // Auto-calculate on sample change
  useEffect(() => {
    // 1. Recalculate values for all 'calc' type samples
    const processedSamples = samples.map((s) => {
      if (s.type === "lab_calc") {
        return { ...s, value: calculateSampleConcentration(s) };
      }
      return s;
    });

    // 2. Run Engine
    const evalResult = runEn689Evaluation(processedSamples, vlaReference);
    setResult(evalResult);
    onUpdate(evalResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samples, vlaReference]);

  const updateSample = (id: string, updates: Partial<Sample>) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  };

  const addSample = () => {
    const newId = (samples.length + 1).toString();
    setSamples((prev) => [
      ...prev,
      { id: newId, type: "direct", value: 0, isBelowLod: false },
    ]);
  };

  const removeSample = (id: string) => {
    setSamples((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <TestTube className="text-purple-600" /> 5. Resultados de la Medición
        </h3>
        <p className="text-gray-500 mb-4">
          Introduzca los resultados del laboratorio para obtener el dictamen de
          conformidad UNE-EN 689.
        </p>

        {/* VLA Display */}
        <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="bg-white p-2 rounded-md shadow-sm">
            <span className="text-xs text-gray-500 uppercase font-bold block">
              VLA Referencia
            </span>
            <span className="text-lg font-bold text-purple-700">
              {vlaReference} mg/m³
            </span>
          </div>
          <div className="flex-1 text-sm text-purple-800">
            <strong>GES Activo:</strong> {gesData?.gesId || "No definido"} (
            {gesData?.workerCount || 0} operarios). se requieren{" "}
            {gesData?.samplingStrategy.minSamples || 3} muestras mínimas.
          </div>
        </div>
      </div>

      {/* INPUT TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3 w-32">Tipo Input</th>
                <th className="px-4 py-3">
                  Datos (Masa / Caudal / Tiempo / Conc)
                </th>
                <th className="px-4 py-3 w-40">Concentración</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {samples.map((sample, idx) => (
                <tr key={sample.id} className="border-b hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    M{idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="border rounded p-1 text-xs w-full"
                      value={sample.type}
                      onChange={(e) =>
                        updateSample(sample.id, {
                          type: e.target.value as "direct" | "lab_calc",
                        })
                      }
                    >
                      <option value="direct">Directo (mg/m³)</option>
                      <option value="lab_calc">Lab (M/Q/t)</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {sample.type === "direct" ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.001"
                          className="border rounded p-2 w-32 font-mono"
                          value={sample.value || ""}
                          onChange={(e) =>
                            updateSample(sample.id, {
                              value: parseFloat(e.target.value),
                            })
                          }
                          placeholder="0.000"
                        />
                        <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sample.isBelowLod}
                            onChange={(e) =>
                              updateSample(sample.id, {
                                isBelowLod: e.target.checked,
                                lodMultiplier: 0.5, // Default to 0.5 rules
                              })
                            }
                          />
                          &lt; LOD
                        </label>
                        {sample.isBelowLod && (
                          <select
                            className="border rounded p-1 text-xs bg-yellow-50"
                            value={sample.lodMultiplier}
                            onChange={(e) =>
                              updateSample(sample.id, {
                                lodMultiplier: parseFloat(e.target.value) as
                                  | 0.5
                                  | 1,
                              })
                            }
                          >
                            <option value={0.5}>x 0.5</option>
                            <option value={1}>x 1.0</option>
                          </select>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400">
                            Masa (µg)
                          </span>
                          <input
                            type="number"
                            className="border rounded p-1 w-20 text-xs"
                            placeholder="µg"
                            value={sample.raw?.mass || ""}
                            onChange={(e) =>
                              updateSample(sample.id, {
                                raw: {
                                  mass: parseFloat(e.target.value),
                                  flow: sample.raw?.flow || 0,
                                  time: sample.raw?.time || 0,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400">
                            Caudal (l/min)
                          </span>
                          <input
                            type="number"
                            className="border rounded p-1 w-16 text-xs"
                            placeholder="l/min"
                            value={sample.raw?.flow || ""}
                            onChange={(e) =>
                              updateSample(sample.id, {
                                raw: {
                                  mass: sample.raw?.mass || 0,
                                  flow: parseFloat(e.target.value),
                                  time: sample.raw?.time || 0,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400">
                            Tiempo (min)
                          </span>
                          <input
                            type="number"
                            className="border rounded p-1 w-16 text-xs"
                            placeholder="min"
                            value={sample.raw?.time || ""}
                            onChange={(e) =>
                              updateSample(sample.id, {
                                raw: {
                                  mass: sample.raw?.mass || 0,
                                  flow: sample.raw?.flow || 0,
                                  time: parseFloat(e.target.value),
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-gray-700">
                      {sample.type === "direct" && sample.isBelowLod && (
                        <span className="text-xs text-gray-400 mr-1">
                          (Est.)
                        </span>
                      )}
                      {(
                        (sample.type === "lab_calc"
                          ? calculateSampleConcentration(sample)
                          : sample.value *
                            (sample.isBelowLod
                              ? sample.lodMultiplier || 1
                              : 1)) || 0
                      ).toFixed(4)}{" "}
                      <span className="text-xs font-normal text-gray-400">
                        mg/m³
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeSample(sample.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Eliminar muestra"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 bg-gray-50 border-t flex justify-center">
            <button
              onClick={addSample}
              className="flex items-center gap-2 text-sm text-purple-600 font-medium hover:text-purple-800 transition-colors"
            >
              <Plus size={16} /> Añadir Muestra
            </button>
          </div>
        </div>
      </div>

      {/* VERDICT PANEL */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Main Verdict */}
          <div
            className={`p-6 rounded-xl border-2 flex flex-col justify-center items-center text-center transition-colors ${
              result.decision === "compliant"
                ? "bg-green-50 border-green-200"
                : result.decision === "non_compliant"
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
            }`}
          >
            {result.decision === "compliant" && (
              <CheckCircle2 size={48} className="text-green-600 mb-2" />
            )}
            {result.decision === "non_compliant" && (
              <XCircle size={48} className="text-red-600 mb-2" />
            )}
            {result.decision === "need_more_samples" && (
              <HelpCircle size={48} className="text-yellow-600 mb-2" />
            )}

            <h2
              className={`text-2xl font-black uppercase mb-1 ${
                result.decision === "compliant"
                  ? "text-green-700"
                  : result.decision === "non_compliant"
                    ? "text-red-700"
                    : "text-yellow-700"
              }`}
            >
              {result.decision === "compliant"
                ? "Conforme"
                : result.decision === "non_compliant"
                  ? "No Conforme"
                  : "Muestras Insuficientes"}
            </h2>
            <p className="text-sm font-medium opacity-80 mb-4">
              {result.ruleApplied === "screening"
                ? "Criterio: Test Preliminar (Screening)"
                : "Criterio: Test Estadístico (UNE-EN 689)"}
            </p>

            {/* Quality Alerts */}
            {result.qualityAlerts.length > 0 && (
              <div className="w-full bg-white/60 rounded p-2 text-xs text-left text-red-700 flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <div>
                  {result.qualityAlerts.map((alert, i) => (
                    <div key={i}>{alert}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Statistics Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calculator size={18} className="text-gray-400" /> Detalle
              Estadístico
            </h4>

            {result.ruleApplied === "statistical_utl" ||
            result.ruleApplied === "statistical_fail" ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Media Geométrica (MG):</span>
                  <span className="font-mono font-bold">
                    {result.stats?.gm.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Desv. Est. (GSD):</span>
                  <span
                    className={`font-mono font-bold ${
                      (result.stats?.gsd || 0) > 3
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {result.stats?.gsd.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">UR (P95, 70% UCL):</span>
                  <span
                    className={`font-mono font-bold ${
                      (result.stats?.ur || 0) > vlaReference
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {result.stats?.ur.toFixed(4)}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Índice (I)
                    </span>
                    <span className="text-xl font-bold text-gray-800">
                      {(result.stats?.complianceIndex || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                <p>Estadística avanzada disponible con N ≥ 6.</p>
                <div className="mt-2 text-xs bg-gray-50 p-2 rounded inline-block">
                  Criterio actual: Todos ≤ {(result.stats?.ur || 0).toFixed(2)}{" "}
                  (Fracción del VLA)
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm bg-blue-50 text-blue-800 p-2 rounded">
              <span className="font-bold">Próxima Medición:</span>
              <span>{result.nextCheck}</span>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!result || result.decision === "need_more_samples"}
          className={`px-6 py-2 rounded-lg font-bold shadow-md transition-all ${
            !result || result.decision === "need_more_samples"
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          Finalizar Informe →
        </button>
      </div>
    </div>
  );
};
