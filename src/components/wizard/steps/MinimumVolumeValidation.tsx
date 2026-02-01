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
  // String state for inputs to allow smooth typing (handling "10," etc.)
  const [loqStr, setLoqStr] = useState<string>(initialLoq.toString());
  const [timeStr, setTimeStr] = useState<string>(initialTime.toString());

  // Logic state
  const [loq, setLoq] = useState<number>(initialLoq);
  const [plannedTime, setPlannedTime] = useState<number>(initialTime);

  // Sync String -> Number
  const handleLoqChange = (val: string) => {
    setLoqStr(val);
    const parsed = parseFloat(val.replace(",", "."));
    if (!isNaN(parsed) && parsed >= 0) setLoq(parsed);
  };

  const handleTimeChange = (val: string) => {
    setTimeStr(val);
    const parsed = parseFloat(val.replace(",", "."));
    if (!isNaN(parsed) && parsed >= 0) setPlannedTime(parsed);
  };

  // Sync External Changes (e.g. Auto-Fix updates plannedTime)
  useEffect(() => {
    if (
      plannedTime.toString() !== timeStr &&
      Math.abs(plannedTime - parseFloat(timeStr.replace(",", "."))) > 0.1
    ) {
      // eslint-disable-next-line
      setTimeStr(plannedTime.toString());
    }
  }, [plannedTime, timeStr]);

  // Auto-validate (Calculation)
  const result = useMemo(() => {
    return validateMinimumVolume(vla, flowRate, loq, exposureType, plannedTime);
  }, [vla, flowRate, loq, exposureType, plannedTime]);

  // Sync to Parent ONLY on committed changes (Blur or Button Click)
  // This prevents the infinite render loop while typing
  const syncToParent = () => {
    onValidationChange(result, loq, plannedTime);
  };

  const handleFixTime = () => {
    if (result && result.tMinMinutes > 0) {
      const newTime = result.tMinMinutes;
      setPlannedTime(newTime);
      setTimeStr(newTime.toString());
      // For auto-fix, we CAN sync immediately because it's a single discrete event, not a typing stream
      // However, we must wait for state update... actually result depends on state.
      // Better to trigger a one-off sync?
      // Or just let the user see the update locally.
      // Let's manually trigger sync with the NEW values to be safe.
      onValidationChange(
        { ...result, tMinMinutes: newTime, isValid: true }, // Optimistic update or wait for recalc?
        loq,
        newTime,
      );
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
                  type="text"
                  inputMode="decimal"
                  value={loqStr}
                  onChange={(e) => handleLoqChange(e.target.value)}
                  onBlur={syncToParent}
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
                type="text"
                inputMode="numeric"
                value={timeStr}
                onChange={(e) => handleTimeChange(e.target.value)}
                onBlur={syncToParent}
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
              <span className="font-mono font-bold text-blue-700">
                {result.tMinMinutes} min
              </span>
            </div>

            {/* Logic Explanation */}
            {result.tMinStrategy &&
              result.tMinAnalytical &&
              result.tMinStrategy > result.tMinAnalytical && (
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2 border border-blue-100">
                  <Info size={12} className="inline mr-1" />
                  <strong>Nota:</strong> Analíticamente bastarían{" "}
                  <strong>{result.tMinAnalytical} min</strong> (UNE-EN 482),
                  pero se requieren <strong>{result.tMinStrategy} min</strong>{" "}
                  para asegurar representatividad estadística (UNE-EN 689).
                </div>
              )}
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
