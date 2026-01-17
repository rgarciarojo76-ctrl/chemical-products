import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
// Vital: VITE_SHARED_SECRET
const SHARED_SECRET = import.meta.env.VITE_SHARED_SECRET;
interface GatekeeperProps {
  children: ReactNode;
}
const Gatekeeper: React.FC<GatekeeperProps> = ({ children }) => {
  const [accessGranted, setAccessGranted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const verifyToken = async () => {
      // 1. Validar configuración
      if (!SHARED_SECRET) {
        console.error("CRITICAL: VITE_SHARED_SECRET is missing.");
        setError("Error de Configuración (Falta VITE_SHARED_SECRET).");
        return;
      }
      // 2. Leer parámetros de URL
      const params = new URLSearchParams(window.location.search);
      const timestamp = params.get("t");
      const signature = params.get("h");
      // 3. Validación básica
      if (!timestamp || !signature) {
        window.location.href = "https://direccion-tecnica-ia-lab.vercel.app";
        return;
      }
      // 4. Protección Anti-Replay
      const now = Date.now();
      const timeDiff = now - parseInt(timestamp, 10);
      if (timeDiff > 60000 || timeDiff < -5000) {
        setError(
          "⛔ CRÍTICO: El enlace ha caducado. Vuelve a entrar desde el Portal.",
        );
        return;
      }
      // 5. Verificación Criptográfica
      try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(SHARED_SECRET),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["verify"],
        );

        const signatureBuf = hexToBuf(signature);
        const verified = await crypto.subtle.verify(
          "HMAC",
          key,
          signatureBuf as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          encoder.encode(timestamp),
        );
        if (verified) {
          setAccessGranted(true);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } else {
          setError("⛔ ACCESO DENEGADO: Firma Digital Inválida.");
        }
      } catch (e) {
        console.error(e);
        setError("Error interno de criptografía.");
      }
    };
    function hexToBuf(hex: string): Uint8Array {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
      }
      return bytes;
    }
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
          background: "#fef2f2",
          color: "#991b1b",
          fontFamily: "sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2em", marginBottom: "10px" }}>
          🛡️ Seguridad Activada
        </h1>
        <h3 style={{ fontWeight: "normal" }}>{error}</h3>
        <a
          href="https://direccion-tecnica-ia-lab.vercel.app"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#dc2626",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Volver al Portal Oficial
        </a>
      </div>
    );
  }
  if (!accessGranted) return null;
  return <>{children}</>;
};
export default Gatekeeper;
