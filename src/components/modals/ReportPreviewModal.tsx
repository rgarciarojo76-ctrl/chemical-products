import React from "react";
import type { ReportData } from "../../utils/reportGenerator";
import { generatePDF } from "../../utils/pdfRenderer";
import { Download, FileText, X, AlertTriangle } from "lucide-react";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReportData;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    generatePDF(data);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                backgroundColor: "#eff6ff",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              <FileText size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                Vista Previa del Informe
              </h3>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                Verifique los datos antes de generar el documento oficial.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          {/* Agent Card */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
            }}
          >
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#4b5563" }}>
              DATOS DEL AGENTE QUÍMICO (BASE DE DATOS OFICIAL)
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                fontSize: "0.95rem",
              }}
            >
              <div>
                <strong>Agente:</strong> {data.agent.name}
              </div>
              <div>
                <strong>CAS:</strong> {data.agent.cas}
              </div>
              <div>
                <strong>VLA-ED:</strong> {data.agent.vla_ed}
              </div>
              <div>
                <strong>VLA-EC:</strong> {data.agent.vla_ec}
              </div>
            </div>
          </div>

          {/* Narrative Preview */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#4b5563" }}>
              NARRATIVA GENERADA
            </h4>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f8fafc",
                border: "1px dashed #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "#334155",
              }}
            >
              {data.exposure.description}
            </div>
          </div>

          {/* Conclusion */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#4b5563" }}>
              CONCLUSIÓN HIGIÉNICA
            </h4>
            <div
              style={{
                padding: "1rem",
                backgroundColor: data.conclusion.type === 'A' ? "#f0fdf4" : "#fef2f2",
                borderLeft: `4px solid ${data.conclusion.type === 'A' ? "#22c55e" : "#ef4444"}`,
                borderRadius: "4px",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {data.conclusion.type === 'B' && <AlertTriangle size={20} color="#ef4444" />}
                <strong style={{ color: data.conclusion.type === 'A' ? "#15803d" : "#b91c1c" }}>
                  {data.conclusion.type === 'A' ? " ESCENARIO A (CONTROLADO)" : " ESCENARIO B (RIESGO NO DESCARTABLE)"}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5 }}>
                {data.conclusion.text}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            backgroundColor: "#f9fafb",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              color: "#374151",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "var(--color-primary)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Download size={20} />
            Descargar PDF Oficial
          </button>
        </div>
      </div>
    </div>
  );
};
