import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "var(--spacing-md)",
        fontSize: "0.8rem",
        color: "var(--color-text-light)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      © {new Date().getFullYear()} Dirección Técnica - Motor de Decisión CMR (RD
      665/1997)
    </footer>
  );
};

export default Footer;
