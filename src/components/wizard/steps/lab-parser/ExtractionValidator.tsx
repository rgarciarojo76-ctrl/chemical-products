import React, { useState, useEffect } from "react";
import { Check, Eye, AlertTriangle } from "lucide-react";
import type { ParsedData } from "./pdfParsingEngine";

interface ValidatorProps {
  parsedData: ParsedData;
  file: File | null;
  expectedCas: string;
  gesDuration: number;
  onConfirm: (samples: ParsedData["samples"]) => void;
}

export const ExtractionValidator: React.FC<ValidatorProps> = ({
  parsedData,
  file,
  expectedCas,
  gesDuration, // Default 8h if not provided, but usually comes from step 3
  onConfirm,
}) => {
  const [editedSamples, setEditedSamples] = useState(
    parsedData.samples.map((s) => ({
      ...s,
      valid: true, // Internal flag
    })),
  );

  const [tRealInput, setTRealInput] = useState<number>(gesDuration * 60); // minutes

  // Mock PDF Viewer URL
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);

      // eslint-disable-next-line
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const updateSample = (
    index: number,
    field: string,
    value: number | boolean | object,
  ) => {
    const newSamples = [...editedSamples];
    newSamples[index] = { ...newSamples[index], [field]: value };
    setEditedSamples(newSamples);
  };

  const calculateEd = (massUg: number, volumeM3: number, tRealMin: number) => {
    // Conc = Mass (mg) / Vol (m3). Mass is in ug, so /1000
    if (!volumeM3 || volumeM3 === 0) return 0;
    const concMgM3 = massUg / 1000 / volumeM3;

    // ED = Conc * (TReal / 480) [480 min = 8h]
    const ed = concMgM3 * (tRealMin / 480);
    return ed;
  };

  return (
    <div className="h-full flex text-sm">
      {/* LEFT: PDF VIEWER */}
      <div className="w-1/2 h-full bg-gray-700 p-4 border-r border-gray-600 flex flex-col">
        <div className="bg-gray-800 text-gray-300 px-3 py-2 rounded-t-lg flex justify-between items-center text-xs">
          <span>{parsedData.fileName}</span>
          <span className="bg-yellow-600 text-white px-2 rounded">
            Vista Previa
          </span>
        </div>
        <div className="flex-1 bg-gray-500 rounded-b-lg overflow-hidden relative group">
          {file ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              No PDF Loaded
            </div>
          )}
          {/* Highlight Overlay Simulation */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-20 bg-yellow-400/30 border-2 border-yellow-400 pointer-events-none animate-pulse"></div>
        </div>
      </div>

      {/* RIGHT: FORM */}
      <div className="w-1/2 h-full bg-white flex flex-col">
        {/* Validation Header */}
        <div className="p-6 border-b bg-gray-50">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <Eye size={18} className="text-indigo-600" />
            Validación de Extracción
          </h4>
          <p className="text-gray-500 text-xs mt-1">
            Por favor, confirma que los datos leídos coinciden con la imagen.
          </p>

          {/* ALERTS */}
          {parsedData.warnings.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-start gap-2">
              <AlertTriangle size={16} />
              <div>
                <strong>Incoherencia Detectada:</strong>
                <ul className="list-disc pl-4 mt-1">
                  {parsedData.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {parsedData.casNumber !== expectedCas && expectedCas && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
              ⚠️ El CAS extraído ({parsedData.casNumber}) no es idéntico al
              esperado ({expectedCas}). Verifica la identidad del agente.
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* GLOBAL TIME SETTING */}
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <label className="text-xs font-bold text-indigo-900 block mb-1">
              Tiempo Real de Exposición (Minutos)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="p-2 border rounded w-32 font-bold text-center"
                value={tRealInput}
                onChange={(e) => setTRealInput(Number(e.target.value))}
              />
              <span className="text-xs text-indigo-600">
                Se aplicará a todas las muestras para el cálculo de ED.
              </span>
            </div>
          </div>

          {/* SAMPLES TABLE */}
          <table className="w-full text-left">
            <thead className="text-xs text-gray-400 uppercase border-b">
              <tr>
                <th className="pb-2">Muestra</th>
                <th className="pb-2">Masa (µg) / Datos</th>
                <th className="pb-2">Cálculos</th>
                <th className="pb-2 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {editedSamples.map((sample, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-4 font-bold text-gray-700 align-top pt-5">
                    {sample.id}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-gray-500 font-bold">
                          Masa Analítica (µg)
                        </label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded text-right font-mono text-xs focus:ring-1 focus:ring-indigo-500"
                          value={sample.raw?.mass || 0}
                          onChange={(e) =>
                            updateSample(idx, "raw", {
                              ...sample.raw,
                              mass: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 font-bold">
                          Volumen Aire (L)
                        </label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded text-right font-mono text-xs focus:ring-1 focus:ring-indigo-500"
                          // Assuming we need vol input or mock it. Let's assume standard pump flow for demo
                          value={
                            (sample.raw?.flow || 2) * (sample.raw?.time || 120)
                          }
                          readOnly
                          title="Calculado por Flujo x Tiempo (Paso anterior)"
                        />
                      </div>

                      {/* ND Toggle */}
                      <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={sample.isBelowLod}
                          onChange={(e) =>
                            updateSample(idx, "isBelowLod", e.target.checked)
                          }
                        />
                        <span className="text-xs text-gray-500">
                          ¿Inferior a LQ? (&lt; LQ)
                        </span>
                      </label>
                    </div>
                  </td>
                  <td className="py-4 align-top pt-5">
                    <div className="bg-gray-100 p-2 rounded text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vol:</span>
                        <span>
                          {(
                            ((sample.raw?.flow || 2) *
                              (sample.raw?.time || 120)) /
                            1000
                          ).toFixed(3)}{" "}
                          m³
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-indigo-700">
                        <span>Conc:</span>
                        <span>
                          {(
                            (sample.raw?.mass || 0) /
                            ((sample.raw?.flow || 2) *
                              (sample.raw?.time || 120))
                          ).toFixed(3)}{" "}
                          mg/m³
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                        <span>ED:</span>
                        <span>
                          {calculateEd(
                            sample.raw?.mass || 0,
                            ((sample.raw?.flow || 2) *
                              (sample.raw?.time || 120)) /
                              1000,
                            tRealInput,
                          ).toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right align-top pt-5">
                    <div className="flex justify-end">
                      <div
                        className={`w-2 h-2 rounded-full ${sample.valid ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            className="px-6 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg flex items-center gap-2"
            onClick={() => {
              // Transform back to App format
              const finalSamples = editedSamples.map((s) => ({
                ...s,
                // Recalculate everything before saving
                value:
                  (s.raw?.mass || 0) /
                  ((s.raw?.flow || 2) * (s.raw?.time || 120)), // Conc
                date: new Date().toISOString().split("T")[0],
              }));
              onConfirm(finalSamples);
            }}
          >
            <Check size={18} /> Confirmar Importación
          </button>
        </div>
      </div>
    </div>
  );
};
