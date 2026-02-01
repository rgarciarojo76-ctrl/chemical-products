import React from "react";
import type { TargetOrganResult } from "../../utils/targetOrgansLogic";
import {
  Activity,
  Brain,
  Eye,
  Heart,
  User,
  AlertTriangle,
  Info,
  Droplets,
} from "lucide-react"; // Note: Lucide icons are limited, we map best effort.

interface TargetOrgansDisplayProps {
  result: TargetOrganResult;
}

// Icon Map: Maps normalized organ names (spanish) to Lucide Icons
// We use a helper to get color and icon
const getOrganVisuals = (organName: string) => {
  const norm = organName.toLowerCase();

  if (
    norm.includes("pulmón") ||
    norm.includes("respiratori") ||
    norm.includes("pleura") ||
    norm.includes("nasal") ||
    norm.includes("nasofaringe")
  ) {
    return {
      icon: <Activity />,
      label: "Sistema Respiratorio",
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "border-pink-200",
    };
    // Ideally we'd use a Lung icon if available, but Activity/Wind is fallback.
  }
  if (norm.includes("hígado") || norm.includes("hepát")) {
    return {
      icon: <Activity />,
      label: "Hígado (Hepatotoxicidad)",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
    };
  }
  if (
    norm.includes("riñón") ||
    norm.includes("renal") ||
    norm.includes("nefro")
  ) {
    return {
      icon: <Activity />,
      label: "Riñón (Nefrotoxicidad)",
      color: "text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-200",
    };
  }
  if (
    norm.includes("nervioso") ||
    norm.includes("cerebro") ||
    norm.includes("snc")
  ) {
    return {
      icon: <Brain />,
      label: "Sistema Nervioso",
      color: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-200",
    };
  }
  if (
    norm.includes("sangre") ||
    norm.includes("médula") ||
    norm.includes("hemat")
  ) {
    return {
      icon: <Droplets />,
      label: "Sangre / Médula",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  }
  if (norm.includes("piel") || norm.includes("dérmico")) {
    return {
      icon: <User />,
      label: "Piel (Dermatotoxicidad)",
      color: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
    };
  }
  if (norm.includes("ojo") || norm.includes("ocular")) {
    return {
      icon: <Eye />,
      label: "Ojos",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    };
  }
  if (norm.includes("corazón") || norm.includes("cardí")) {
    return {
      icon: <Heart />,
      label: "Sistema Cardiovascular",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  }

  // Fallback
  return {
    icon: <AlertTriangle />,
    label: organName,
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
  };
};

export const TargetOrgansDisplay: React.FC<TargetOrgansDisplayProps> = ({
  result,
}) => {
  if (!result || result.organs.length === 0) return null;

  return (
    <div className="mb-6 animate-fadeIn">
      {/* HEADER */}
      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Activity size={18} className="text-primary" />
        Órganos Diana Afectados
      </h4>

      {/* DIVERGENCE ALERT */}
      {result.divergenceAlert && (
        <div className="mb-4 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-md">
          <div className="flex gap-3">
            <AlertTriangle className="text-orange-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-orange-800">
                Divergencia de fuentes detectada
              </p>
              <p className="text-xs text-orange-700 mt-1">
                La base de datos interna sugiere{" "}
                <strong>{result.organs.join(", ")}</strong>, pero la FDS indica
                otros riesgos ({result.divergentOrgans?.join(", ")}). Se ha
                priorizado la base de datos interna.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ORGANS GRID */}
      <div
        className={`grid gap-4 ${
          result.organs.length === 1
            ? "grid-cols-1 max-w-sm mx-auto"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        }`}
      >
        {result.organs.map((organ, idx) => {
          const visuals = getOrganVisuals(organ);
          return (
            <div
              key={idx}
              className={`${visuals.bg} border-2 ${visuals.border} rounded-xl p-4 flex flex-col items-center text-center transition-all hover:shadow-md hover:scale-[1.02]`}
            >
              <div
                className={`p-3 bg-white rounded-full shadow-sm mb-3 ${visuals.color}`}
              >
                {React.cloneElement(
                  visuals.icon as React.ReactElement<{
                    size: number;
                    strokeWidth: number;
                  }>,
                  {
                    size: 32,
                    strokeWidth: 1.5,
                  },
                )}
              </div>
              <span className={`font-bold text-sm ${visuals.color}`}>
                {visuals.label}
              </span>
              {/* Specific term if different from label (e.g. "Riñón" vs "Nefrotoxicidad") */}
              {visuals.label !== organ && (
                <span className="text-xs text-gray-500 mt-1 capitalize">
                  Ref: {organ}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* SOURCE FOOTER tooltip */}
      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-gray-400">
        <Info size={12} />
        <span>
          {result.source === "user_db" &&
            "Fuente: Base de Datos Interna Corporativa."}
          {result.source === "fds_h_phrase" &&
            "Fuente: Extracción automática de Frases H (FDS)."}
          {result.source === "ai_inference" &&
            "Fuente: Inferencia Toxicológica (Bibliografía IARC/INSST)."}
        </span>
      </div>
    </div>
  );
};
