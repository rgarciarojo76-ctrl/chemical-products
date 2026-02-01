import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  AlertOctagon,
  Info,
  ArrowRight,
  FlaskConical,
} from "lucide-react";
import {
  validateMinimumVolume,
  type VolumeValidationResult,
} from "../../../utils/uneEn482Logic";

interface MinimumVolumeValidationProps {
  vla: number; // mg/m³
  flowRate: number; // L/min
  exposureType: "continuous" | "variable" | "peaks";
  onValidationChange: (
    result: VolumeValidationResult,
    loq: number,
    time: number,
  ) => void;
  initialLoq?: number;
  initialTime?: number;
}

export const MinimumVolumeValidation: React.FC<
  MinimumVolumeValidationProps
> = ({
  vla,
  flowRate,
  exposureType,
  onValidationChange,
  initialLoq = 10,
  initialTime = 60,
}) => {
  const [loq, setLoq] = useState<number>(initialLoq);
  const [plannedTime, setPlannedTime] = useState<number>(initialTime);

  // Auto-validate (Calculation)
  const result = useMemo(() => {
    return validateMinimumVolume(vla, flowRate, loq, exposureType, plannedTime);
  }, [vla, flowRate, loq, exposureType, plannedTime]);

  // Notify Parent (Side Effect)
  useEffect(() => {
    onValidationChange(result, loq, plannedTime);
  }, [result, loq, plannedTime]); // onValidationChange excluded to avoid loop if not memoized parent side

  const handleFixTime = () => {
    if (result && result.tMinMinutes > 0) {
      setPlannedTime(result.tMinMinutes);
    }
  };

  if (!result) return null;

  return (
    <div className="mt-8 mb-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">⚖️</span>
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Validación Volumen Mínimo (UNE-EN 482)
          </h3>
          <p className="text-sm text-gray-500">
            Verificación de suficiencia de muestreo según Norma UNE.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: INPUTS (Laboratorio & Planificación) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
            <FlaskConical size={18} className="text-blue-600" />
            Parámetros del Laboratorio
          </h4>

          <div className="space-y-4">
            {/* LOQ INPUT */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Límite de Cuantificación (LOQ){" "}
                <span className="text-xs text-gray-400 font-normal">(µg)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={loq}
                  onChange={(e) => setLoq(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-100 outline-none font-mono"
                />
                <div className="group relative">
                  <Info size={16} className="text-gray-400 cursor-help" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Valor mínimo detectable por el método analítico. Consúltelo
                    con su laboratorio.
                  </span>
                </div>
              </div>
            </div>

            {/* PLANNED TIME INPUT */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Tiempo Planificado{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (minutos)
                </span>
              </label>
              <input
                type="number"
                min="1"
                value={plannedTime}
                onChange={(e) => setPlannedTime(parseInt(e.target.value) || 0)}
                className={`w-full p-2 border rounded focus:ring-2 outline-none font-mono font-bold ${
                  result.isValid
                    ? "border-green-300 bg-green-50 text-green-800 focus:ring-green-100"
                    : "border-red-300 bg-red-50 text-red-800 focus:ring-red-100"
                }`}
              />
            </div>
          </div>
        </div>

        {/* CARD 2: RESULT & VALIDATION */}
        <div
          className={`rounded-xl p-5 border-l-4 shadow-sm transition-colors duration-300 ${
            result.isValid
              ? "bg-green-50 border-green-500 border-t border-r border-b border-gray-100"
              : "bg-red-50 border-red-500 border-t border-r border-b border-gray-100"
          }`}
        >
          <h4
            className={`font-bold mb-3 flex items-center gap-2 ${
              result.isValid ? "text-green-800" : "text-red-800"
            }`}
          >
            {result.isValid ? (
              <>
                <CheckCircle2 size={20} />
                Validación Exitosa (UNE-EN 482)
              </>
            ) : (
              <>
                <AlertOctagon size={20} />
                ¡Tiempo Insuficiente!
              </>
            )}
          </h4>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-black/5 pb-2">
              <span className="text-gray-600">
                Concentración Mín. a Validar (10% VLA):
              </span>
              <span className="font-mono font-bold">
                {result.cMin.toFixed(3)} mg/m³
              </span>
            </div>
            <div className="flex justify-between border-b border-black/5 pb-2">
              <span className="text-gray-600">Volumen Mínimo (Vmin):</span>
              <span className="font-mono font-bold">
                {result.vMinLiters.toFixed(1)} L
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo Mínimo (tmin):</span>
              <span className="font-mono font-bold">
                {result.tMinMinutes} min
              </span>
            </div>
          </div>

          {!result.isValid && (
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-xs text-red-700 mb-3">
                Con un LOQ de <strong>{loq} µg</strong>, muestrear{" "}
                <strong>{plannedTime} min</strong> no permite detectar el 10%
                del VLA. Un resultado "No Detectado" no será válido legalmente.
              </p>
              <button
                onClick={handleFixTime}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight size={16} />
                Ajustar a {result.tMinMinutes} minutos
              </button>
            </div>
          )}

          {result.isValid && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-xs text-green-700">
                <strong>Correcto.</strong> El volumen (
                {(flowRate * plannedTime).toFixed(0)} L) supera al volumen
                mínimo calculado ({result.vMinLiters.toFixed(0)} L).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
