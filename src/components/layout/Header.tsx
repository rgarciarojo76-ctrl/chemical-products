import React from "react";

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

        {/* Center: Disclaimer */}
        <div
          className="show-on-desktop"
          style={{
            fontSize: "0.7rem",
            color: "#d97706", // Amber-600
            fontWeight: 500,
            textAlign: "center",
            margin: "0 1rem",
          }}
        >
          AVISO: Apoyo técnico (no sustitutivo del criterio profesional). La
          información debe ser validada.
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

          <button
            style={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "0.4rem 0.8rem",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "#374151",
              cursor: "not-allowed", // Disabled for now
              opacity: 0.6,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
