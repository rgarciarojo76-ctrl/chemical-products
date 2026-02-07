import React, { useState, useEffect } from "react";
import { Check, X, ArrowRight, Users, Clock, ShieldAlert } from "lucide-react";

interface MinimizationWorkersStepProps {
  onUpdate: (implemented: boolean, justification: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface WorkerCheckItem {
  id: string;
  category: "presence" | "segregation" | "duration";
  title: string;
  juniorText: string;
  rigorText: string;
  status: "yes" | "no" | null;
  actionPlan?: string;
}

export const MinimizationWorkersStep: React.FC<
  MinimizationWorkersStepProps
> = ({ onUpdate, onNext, onBack }) => {
  const [items, setItems] = useState<WorkerCheckItem[]>([
    // 1. Auditoría de Presencia
    {
      id: "roles",
      category: "presence",
      title: "Filtro de Roles Críticos",
      juniorText:
        "¿Es estrictamente necesario que todo el personal actual esté en la zona?",
      rigorText: "Validación de roles Directos vs Indirectos/Auxiliares.",
      status: null,
      actionPlan:
        "Redefinir permisos de acceso según matriz de competencia/necesidad.",
    },
    // 2. Segregación Física
    {
      id: "zoning",
      category: "segregation",
      title: "Zonificación y Control",
      juniorText: "¿Está la zona marcada y limitada físicamente?",
      rigorText:
        "Hitos de control: Delimitación, Señalización y Barreras Físicas.",
      status: null,
      actionPlan:
        "Instalar barreras físicas y señalización de 'Prohibido paso a personal no autorizado'.",
    },
    // 3. Gestión de Duración e Intensidad
    {
      id: "admin_tasks",
      category: "duration",
      title: "Segregación Administrativa",
      juniorText: "¿Se rellenan papeles o usan ordenadores dentro de la zona?",
      rigorText: "Externalización de tareas de registro a zonas limpias.",
      status: null,
      actionPlan:
        "Habilitar 'Punto de Control Limpio' (cabina/pupitre) fuera del área de riesgo.",
    },
    {
      id: "prep_tasks",
      category: "duration",
      title: "Optimización Preparación/Limpieza",
      juniorText: "¿Se prepara el material fuera antes de entrar?",
      rigorText: "Ratio Tarea Directa vs Auxiliar para reducir permanencia.",
      status: null,
      actionPlan:
        "Establecer zona de preparación previa (staging area) limpia.",
    },
    {
      id: "rotation",
      category: "duration",
      title: "Protocolo de Rotación",
      juniorText: "¿Se turnan los operarios para repartir la carga?",
      rigorText: "Sistemas de rotación para evitar picos > VLA-ED.",
      status: null,
      actionPlan: "Establecer cronograma de rotación o entrada escalonada.",
    },
  ]);

  const handleStatusChange = (id: string, newStatus: "yes" | "no") => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  useEffect(() => {
    const allAnswered = items.every((i) => i.status !== null);
    if (!allAnswered) return;

    const nonCompliances = items.filter((i) => i.status === "no");
    let implemented = false;
    let justification = "";

    if (nonCompliances.length === 0) {
      implemented = true;
      justification = `CERTIFICACIÓN DE MINIMIZACIÓN DE EXPOSICIÓN (Art. 5.3.b RD 665/1997):

Se garantiza que el número de trabajadores y su tiempo de exposición están limitados al mínimo posible.
Evidencias:
- Control estricto de acceso (solo personal directo).
- Tareas administrativas y auxiliares externalizadas a zona limpia.
- Delimitación física efectiva del área de riesgo.

Conclusión: Cumplimiento organizativo verificado.`;
    } else {
      implemented = false; // Any "NO" here basically means organizational failure, usually correctible.
      justification = `DESVIACIÓN IDENTIFICADA (Art. 5.3.b RD 665/1997):

Se detecta una sobreexposición temporal o de personal innecesaria. Se requiere intervención organizativa inmediata:

${nonCompliances
  .map(
    (i) =>
      `❌ ${i.title}: ${i.juniorText}\n   -> PLAN DE ACCIÓN: ${i.actionPlan}`,
  )
  .join("\n\n")}

Compromiso: La empresa implementará estas medidas organizativas antes de la próxima evaluación.`;
    }

    onUpdate(implemented, justification);
  }, [items, onUpdate]);

  const allAnswered = items.every((i) => i.status !== null);
  const categories = {
    presence: items.filter((i) => i.category === "presence"),
    segregation: items.filter((i) => i.category === "segregation"),
    duration: items.filter((i) => i.category === "duration"),
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
            <Users className="w-5 h-5 text-purple-600" />
            Auditoría de Personal y Tiempos
          </h3>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
            Art. 5.3.b
          </span>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 1: Presence */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
              <Users className="w-4 h-4" /> 1. Auditoría de Presencia
            </h4>
            <div className="space-y-4">
              {categories.presence.map((item) => (
                <CheckRow
                  key={item.id}
                  item={item}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>

          {/* Section 2: Segregation */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
              <ShieldAlert className="w-4 h-4" /> 2. Segregación Física
            </h4>
            <div className="space-y-4">
              {categories.segregation.map((item) => (
                <CheckRow
                  key={item.id}
                  item={item}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Duration */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
              <Clock className="w-4 h-4" /> 3. Gestión de Duración e Intensidad
            </h4>
            <div className="space-y-4">
              {categories.duration.map((item) => (
                <CheckRow
                  key={item.id}
                  item={item}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!allAnswered}
          className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            allAnswered
              ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Confirmar y Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Helper Component for concise rows
const CheckRow: React.FC<{
  item: WorkerCheckItem;
  onStatusChange: (id: string, s: "yes" | "no") => void;
}> = ({ item, onStatusChange }) => (
  <div className="flex justify-between items-start group">
    <div className="flex-1 pr-4">
      <p className="font-semibold text-gray-800 text-base">{item.title}</p>
      <p className="text-gray-600 text-sm mb-1">{item.juniorText}</p>
      <p className="text-xs text-purple-600 font-medium bg-purple-50 inline-block px-2 py-0.5 rounded opacity-80 group-hover:opacity-100 transition-opacity">
        🕵️ {item.rigorText}
      </p>
    </div>
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => onStatusChange(item.id, "yes")}
        className={`p-2 rounded-lg border transition-all ${
          item.status === "yes"
            ? "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-200"
            : "bg-white border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-500"
        }`}
      >
        <Check className="w-5 h-5" />
      </button>
      <button
        onClick={() => onStatusChange(item.id, "no")}
        className={`p-2 rounded-lg border transition-all ${
          item.status === "no"
            ? "bg-red-100 border-red-500 text-red-700 ring-2 ring-red-200"
            : "bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
        }`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);
