import React, { useState, useEffect } from "react";
import {
  Check,
  ArrowRight,
  Wind,
  Fan,
  Box,
  AlertTriangle,
  MoveHorizontal,
} from "lucide-react";

interface ExtractionStepProps {
  onUpdate: (implemented: boolean, justification: string) => void;
  onNext: () => void;
  onBack: () => void;
}

type DeviceType = "cabin" | "arm" | "table";

interface ExtractionData {
  deviceType: DeviceType | null;
  captureVelocity: number | "";
  distance?: number | ""; // Only for arm/exterior hood
  hasHepa: boolean | null;
  isRecirculating: boolean | null;
}

export const ExtractionStep: React.FC<ExtractionStepProps> = ({
  onUpdate,
  onNext,
  onBack,
}) => {
  const [data, setData] = useState<ExtractionData>({
    deviceType: null,
    captureVelocity: "",
    distance: "",
    hasHepa: null,
    isRecirculating: null,
  });

  const getDeviceName = (type: DeviceType) => {
    if (type === "cabin") return "Cabina / Vitrina";
    if (type === "arm") return "Brazo Articulado / Campana";
    if (type === "table") return "Mesa Aspirante";
    return "";
  };

  // 1. Logic Engine (Derived State)
  const diagnosis = React.useMemo(() => {
    if (
      !data.deviceType ||
      data.captureVelocity === "" ||
      data.isRecirculating === null
    ) {
      return { status: null, message: "", alerts: [], actionPlan: [] };
    }

    const MIN_VELOCITY = 0.5;
    const velocity = Number(data.captureVelocity);
    const distance = Number(data.distance || 0);

    let isCompliant = true;
    const alerts: string[] = [];
    const actions: string[] = [];
    let technicalText = "";

    // A. Velocity Check
    if (velocity < MIN_VELOCITY) {
      isCompliant = false;
      alerts.push("Velocidad de captura INSUFICIENTE (< 0.5 m/s).");
      actions.push("Instalar anemómetro fijo o sensor de presión.");
      actions.push("Rediseñar boca de captura (aumentar velocidad frontal).");
    }

    // B. Distance Check (For Arms)
    if (data.deviceType === "arm") {
      if (distance > 30 && velocity < 1.0) {
        alerts.push(
          `Distancia al foco (${distance}cm) excesiva para la velocidad actual.`,
        );
        actions.push("Acercar la captación a < 20cm del foco de emisión.");
      }
    }

    // C. HEPA Check (Critical if recirculating)
    if (data.isRecirculating && data.hasHepa === false) {
      isCompliant = false;
      alerts.push(
        "ALERTA CRÍTICA: Recirculación de aire sin filtración HEPA H13/H14.",
      );
      actions.push(
        "Instalar etapas de filtración absoluta (HEPA) inmediatamente o conducir la salida al exterior.",
      );
    }

    // D. Generate Justification
    if (isCompliant) {
      technicalText = `CONFORMIDAD TÉCNICA (Art. 5.3.c RD 665/1997):

El sistema de extracción localizada (${getDeviceName(data.deviceType)}) es eficaz.
- Velocidad de captura: ${velocity} m/s (Cumple estándar > ${MIN_VELOCITY} m/s).
${data.isRecirculating ? "- Sistema de filtración: HEPA (Correcto para recirculación)." : "- Descarga: Exterior (Correcto)."}

Conclusión: Se garantiza el arrastre del agente, minimizando la dispersión en zona respiratoria.`;
    } else {
      technicalText = `NO CONFORMIDAD (Art. 5.3.c RD 665/1997):

El sistema de extracción presenta deficiencias críticas que comprometen su eficacia:
${alerts.map((a) => `- ${a}`).join("\n")}

La extracción actual es puramente nominal. Con velocidad de ${velocity} m/s, la zona de captura efectiva es insuficiente.`;
    }

    return {
      status: isCompliant
        ? "compliant"
        : ("non_compliant" as "compliant" | "non_compliant"),
      message: technicalText,
      alerts,
      actionPlan: actions,
    };
  }, [data]);

  // 2. Side Effect: Notify Parent
  useEffect(() => {
    if (diagnosis.status) {
      onUpdate(diagnosis.status === "compliant", diagnosis.message);
    }
  }, [diagnosis, onUpdate]);

  const handleRecirculationChange = (val: boolean) => {
    setData((prev) => ({
      ...prev,
      isRecirculating: val,
      hasHepa: val ? prev.hasHepa : null,
    }));
  };

  const isFormComplete = () => {
    if (!data.deviceType) return false;
    if (data.captureVelocity === "") return false;
    if (data.deviceType === "arm" && data.distance === "") return false;
    if (data.isRecirculating === null) return false;
    if (data.isRecirculating === true && data.hasHepa === null) return false;
    return true;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between mb-4">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          ← Cancelar
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Wind className="w-5 h-5 text-cyan-600" />
            Auditoría de Extracción Localizada
          </h3>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
            Art. 5.3.c
          </span>
        </div>

        <div className="p-6 space-y-8">
          {/* 1. Selector de Dispositivo */}
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
              1. Tipo de Dispositivo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DeviceOption
                type="cabin"
                selected={data.deviceType === "cabin"}
                icon={<Box className="w-8 h-8" />}
                title="Cabina / Vitrina"
                junior="La opción más segura. Encerramiento parcial."
                rigor="Captura total por diseño. Menor dependencia del usuario."
                onClick={() => setData({ ...data, deviceType: "cabin" })}
              />
              <DeviceOption
                type="arm"
                selected={data.deviceType === "arm"}
                icon={<Fan className="w-8 h-8" />}
                title="Brazo Articulado"
                junior="¡Cuidado! Si está lejos (>30cm), no aspira nada."
                rigor="Captura por alcance. Requiere posicionamiento crítico."
                onClick={() => setData({ ...data, deviceType: "arm" })}
              />
              <DeviceOption
                type="table"
                selected={data.deviceType === "table"}
                icon={<MoveHorizontal className="w-8 h-8" />}
                title="Mesa Aspirante"
                junior="Ideal para lijado. El polvo cae o se aleja."
                rigor="Captura descendente/transversal. Aleja del breathing zone."
                onClick={() => setData({ ...data, deviceType: "table" })}
              />
            </div>
          </div>

          {/* 2. Datos Cuantitativos */}
          {data.deviceType && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                2. Datos Técnicos (Medición Real)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Velocidad de Captura ($v_c$)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-2 pr-12 border border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="Ej. 0.8"
                      value={data.captureVelocity}
                      onChange={(e) =>
                        setData({
                          ...data,
                          captureVelocity: e.target.valueAsNumber,
                        })
                      }
                    />
                    <span className="absolute right-3 top-2 text-gray-500 text-sm">
                      m/s
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Medido en la boca de aspiración.
                  </p>
                </div>

                {data.deviceType === "arm" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distancia al Foco ($d$)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full p-2 pr-12 border border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="Ej. 25"
                        value={data.distance}
                        onChange={(e) =>
                          setData({ ...data, distance: e.target.valueAsNumber })
                        }
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">
                        cm
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Distancia opertiva real.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿El aire se recircula al local?
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleRecirculationChange(false)}
                      className={`px-4 py-2 rounded border ${data.isRecirculating === false ? "bg-green-50 border-green-500 text-green-700 font-bold" : "hover:bg-gray-50"}`}
                    >
                      No, descarga al exterior
                    </button>
                    <button
                      onClick={() => handleRecirculationChange(true)}
                      className={`px-4 py-2 rounded border ${data.isRecirculating === true ? "bg-orange-50 border-orange-500 text-orange-700 font-bold" : "hover:bg-gray-50"}`}
                    >
                      Sí, recircula
                    </button>
                  </div>
                </div>

                {data.isRecirculating && (
                  <div className="animate-in fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Filtración HEPA certificada?
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setData({ ...data, hasHepa: true })}
                        className={`px-4 py-2 rounded border ${data.hasHepa === true ? "bg-green-50 border-green-500 text-green-700 font-bold" : "hover:bg-gray-50"}`}
                      >
                        Sí (H13/H14)
                      </button>
                      <button
                        onClick={() => setData({ ...data, hasHepa: false })}
                        className={`px-4 py-2 rounded border ${data.hasHepa === false ? "bg-red-50 border-red-500 text-red-700 font-bold" : "hover:bg-gray-50"}`}
                      >
                        No / Desconocido
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Diagnóstico Automático */}
          {diagnosis.status && (
            <div
              className={`mt-6 p-4 rounded-lg border ${diagnosis.status === "compliant" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} animate-in zoom-in-95`}
            >
              <div className="flex items-start gap-3">
                {diagnosis.status === "compliant" ? (
                  <Check className="w-6 h-6 text-green-600 mt-1" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                )}
                <div>
                  <h5
                    className={`font-bold text-lg ${diagnosis.status === "compliant" ? "text-green-800" : "text-red-800"}`}
                  >
                    {diagnosis.status === "compliant"
                      ? "Sistema Eficaz y Conforme"
                      : "Sistema Deficiente / No Conforme"}
                  </h5>
                  <p className="text-sm text-gray-700 whitespace-pre-line mt-1">
                    {diagnosis.message}
                  </p>

                  {diagnosis.actionPlan.length > 0 && (
                    <div className="mt-3 bg-white bg-opacity-60 p-3 rounded">
                      <strong className="text-sm text-gray-800 block mb-1">
                        Plan de Acción Recomendado:
                      </strong>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {diagnosis.actionPlan.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isFormComplete()}
          className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            isFormComplete()
              ? "bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Confirmar y Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const DeviceOption: React.FC<{
  type: string;
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  junior: string;
  rigor: string;
  onClick: () => void;
}> = ({ selected, icon, title, junior, rigor, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all text-center h-full ${selected ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50"}`}
  >
    <div
      className={`mb-3 p-3 rounded-full ${selected ? "bg-cyan-200 text-cyan-800" : "bg-gray-100 text-gray-500"}`}
    >
      {icon}
    </div>
    <h5 className="font-bold text-gray-800 mb-2">{title}</h5>
    <div className="text-xs text-gray-600 mb-2 flex-grow">
      <span className="block font-medium text-cyan-700 mb-1">Junior:</span>"
      {junior}"
    </div>
    <div className="text-xs text-gray-500 bg-white p-2 rounded border border-gray-100 w-full">
      <span className="block font-bold text-gray-400 mb-1 tracking-wider text-[10px]">
        RIGOR TÉCNICO
      </span>
      {rigor}
    </div>
  </button>
);
