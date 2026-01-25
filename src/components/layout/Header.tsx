import { AlertTriangle } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0.75rem 1.5rem",
        marginBottom: "var(--spacing-xl)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* Left: Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Dirección Técnica Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/logo-direccion-tecnica.jpg"
              alt="Dirección Técnica"
              style={{ height: "48px", width: "auto" }}
            />
          </div>

          <div
            style={{ width: "1px", height: "32px", backgroundColor: "#e5e7eb" }}
          ></div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              className="notranslate"
              translate="no"
              style={{
                color: "#009bdb",
                fontWeight: 700,
                fontSize: "1rem",
                lineHeight: 1,
              }}
            >
              DIRECCIÓN TÉCNICA
            </span>
            <span
              className="notranslate"
              translate="no"
              style={{
                fontSize: "0.7rem",
                color: "#6b7280",
                marginTop: "2px",
              }}
            >
              IA LAB
            </span>
          </div>
        </div>

        {/* Center: Disclaimer (Premium Pill Standard) */}
        <div className="status-disclaimer">
          <AlertTriangle size={18} className="disclaimer-icon" />
          <div className="disclaimer-content">
            <span className="disclaimer-title">AVISO:</span>
            <span className="disclaimer-body">
              Apoyo técnico (no sustitutivo del criterio profesional). La
              información debe ser validada.
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            style={{
              backgroundColor: "#e0f2fe", // Sky-100
              color: "#0284c7", // Sky-600
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid #bae6fd",
            }}
          >
            Estado: Piloto interno
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
