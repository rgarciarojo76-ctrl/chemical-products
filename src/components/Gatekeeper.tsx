import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";

// ENS: Hash SHA-256 de la contraseña almacenado (no la contraseña real)
const AUTH_HASH = import.meta.env.VITE_AUTH_HASH;

interface GatekeeperProps {
  children: ReactNode;
}

const Gatekeeper: React.FC<GatekeeperProps> = ({ children }) => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // DEBUG: Mostrar variables de entorno para diagnóstico en Vercel
    console.log("DEBUG ENVIRONMENT:", JSON.stringify(import.meta.env));
    console.log("DEBUG AUTH_HASH:", AUTH_HASH ? "CONFIGURED" : "MISSING");

    const verifyToken = async () => {
      // 1. Validar configuración
      if (!AUTH_HASH) {
        console.error("Falta VITE_AUTH_HASH en las variables de entorno");
        setError("Error de Configuración de Seguridad");
        return;
      }

      // 2. Leer parámetro de la URL (?k=...)
      const params = new URLSearchParams(window.location.search);
      const key = params.get("k");

      if (!key) {
        // Si ya estamos validados (podríamos usar localStorage, pero por ahora session-only)
        setError("Acceso Denegado: Credencial no detectada.");
        return;
      }

      // 3. Verificar Hash (SHA-256)
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(key);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        if (hashHex === AUTH_HASH) {
          setAccessGranted(true);
          // Limpiar la URL para que no se vea la clave
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } else {
          setError("Acceso Inválido: Credencial incorrecta.");
        }
      } catch (e) {
        console.error(e);
        setError("Error de Verificación de Seguridad.");
      }
    };

    verifyToken();
  }, []);

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "#dc2626",
          backgroundColor: "#fef2f2",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>⛔ {error}</h1>
        <p>
          Por favor, inicie sesión a través del{" "}
          <a
            href="https://direccion-tecnica-chemicals.vercel.app"
            style={{ color: "#0284c7", fontWeight: "bold" }}
          >
            Portal Oficial
          </a>
          .
        </p>
      </div>
    );
  }

  if (!accessGranted) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "#666",
        }}
      >
        Verificando credenciales de seguridad... 🔐
      </div>
    );
  }

  return <>{children}</>;
};

export default Gatekeeper;
