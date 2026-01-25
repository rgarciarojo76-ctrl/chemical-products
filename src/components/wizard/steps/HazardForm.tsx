import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { StepCard } from "../../ui/StepCard";
import type { HPhrase, HazardInput, HazardAssessment } from "../../../types";
import { CMR_PHRASES } from "../../../utils/engineLogic";
import { lookupChemical } from "../../../data/insstDatabase";

// Configure worker (assuming file will be in public folder or imported)
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface HazardFormProps {
  onAnalyze: (input: HazardInput) => HazardAssessment;
  onNext: () => void;
  onBack?: () => void;
  initialData?: HazardInput;
}

export const HazardForm: React.FC<HazardFormProps> = ({
  onAnalyze,
  onNext,
  onBack,
  initialData,
}) => {
  const [formData, setFormData] = useState<HazardInput>(
    initialData || {
      substanceName: "",
      hPhrases: [],
      isMixture: false,
      origin: "raw_material",
    },
  );
  const [result, setResult] = useState<HazardAssessment | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<
    "idle" | "analyzing" | "success" | "error"
  >("idle");
  const [detectedComponents, setDetectedComponents] = useState<
    { name: string; cat?: string; notes?: string; phrases?: HPhrase[] }[]
  >([]);
  const [detectedRoutes, setDetectedRoutes] = useState<{
    inhalation: boolean;
    dermal: boolean;
    oral: boolean;
    parenteral: boolean;
  }>({ inhalation: false, dermal: false, oral: false, parenteral: false });

  const togglePhrase = (phrase: HPhrase) => {
    setFormData((prev) => ({
      ...prev,
      hPhrases: prev.hPhrases.includes(phrase)
        ? prev.hPhrases.filter((p) => p !== phrase)
        : [...prev.hPhrases, phrase],
    }));
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    // Extract text from first 5 pages (usually enough for Section 2: Hazards)
    const maxPages = Math.min(pdf.numPages, 5);
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? (item as { str: string }).str : ""))
        .join(" ");
      fullText += pageText + " ";
    }
    return fullText;
  };

  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setAnalysisStatus("analyzing");
    try {
      const text = await extractTextFromPDF(file);
      console.log("PDF Text Extracted:", text.substring(0, 500) + "...");
      analyzeText(text);
      setAnalysisStatus("success");
      setAnalysisStatus("success");
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      setAnalysisStatus("error");
      setTimeout(() => setAnalysisStatus("idle"), 3000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input value to allow re-uploading the same file
    e.target.value = "";
  };

  // Helper to reuse the analysis logic
  const analyzeText = (text: string) => {
    // Known CMR List for Regex Search (Demo subset)
    const knownCMRs = [
      { name: "Formaldehído", regex: /formaldeh[ií]do/i },
      { name: "Dicromato de Potasio", regex: /dicromato.*potasio/i },
      { name: "Sílice Cristalina", regex: /s[ií]lice.*cristalina/i },
      { name: "Benceno", regex: /benceno/i },
      { name: "Oxido de Etileno", regex: /[oó]xido.*etileno/i },
      { name: "Cadmio", regex: /cadmio/i },
    ];

    const foundComponents: { name: string; percent: number }[] = [];
    let maxConcentration = 0;

    // 1. Search for Substance + % context (heuristic)
    knownCMRs.forEach((cmr) => {
      const regex = new RegExp(
        `(${cmr.regex.source}).{0,100}?(\\d{1,3}(?:[.,]\\d{1,2})?)\\s?%`,
        "i",
      );
      const match = text.match(regex);

      if (match) {
        const val = parseFloat(match[2].replace(",", "."));
        foundComponents.push({ name: cmr.name, percent: val });
        if (val > maxConcentration) maxConcentration = val;
      } else if (cmr.regex.test(text)) {
        const looseMatch = text
          .substring(text.search(cmr.regex))
          .substring(0, 150)
          .match(/(\d{1,3}(?:[.,]\d{1,2})?)\s?%/);
        if (looseMatch) {
          const val = parseFloat(looseMatch[1].replace(",", "."));
          foundComponents.push({ name: cmr.name, percent: val });
          if (val > maxConcentration) maxConcentration = val;
        } else {
          foundComponents.push({ name: cmr.name, percent: 0 });
        }
      }
    });

    // 2. Detect H-Phrases
    const foundPhrases: HPhrase[] = [];
    CMR_PHRASES.forEach((phrase) => {
      const regex = new RegExp(`\\b${phrase}\\b`, "i");
      if (regex.test(text)) {
        foundPhrases.push(phrase);
      }
    });

    // 3. Construct Summary
    let substanceSummary = "";
    let isMixture = false;
    let finalConc = undefined;

    if (foundComponents.length > 0) {
      const unique = Array.from(
        new Map(foundComponents.map((item) => [item.name, item])).values(),
      );
      substanceSummary = unique
        .map(
          (c) =>
            `${c.name} (${c.percent > 0 ? c.percent + "%" : "Conc. desc."})`,
        )
        .join(", ");

      if (unique.length > 1 || /mezcla|preparado/i.test(text)) {
        isMixture = true;
      }
      if (maxConcentration > 0) finalConc = maxConcentration;
    } else {
      if (/mezcla|preparado/i.test(text)) isMixture = true;
      const concMatch = text.match(/(\d{1,2}[.,]\d{1,2})\s*%/);
      if (concMatch) finalConc = parseFloat(concMatch[1].replace(",", "."));
    }

    // Populate detectedComponents state for UI (Multi-substance support)
    const componentsForState =
      foundComponents.length > 0
        ? foundComponents.map((c) => {
            const data = lookupChemical(c.name);
            // Simple heuristic to extract C1A/C1B from notes if available
            let cat = "Clasificación CMR Detectada";
            if (data?.notes?.includes("C1A"))
              cat = "Cat. 1A (Cancerígeno Confirmado en Humanos)";
            else if (data?.notes?.includes("C1B"))
              cat = "Cat. 1B (Cancerígeno Supuesto en Humanos)";
            else if (CMR_PHRASES.some((h) => foundPhrases.includes(h)))
              cat = "Posible CMR (Por Frases H globales)";

            return {
              name: c.name,
              cat: cat,
              notes: data?.notes,
              phrases: foundPhrases, // Shared for now unless we link specific phrases
            };
          })
        : [];

    setDetectedComponents(componentsForState);

    // 4. Detect Physical Form
    let detectedForm: HazardInput["detectedPhysicalForm"] = undefined;
    if (/aerosol|niebla|spray/i.test(text)) {
      detectedForm = "liquid_high_volatility";
    } else if (/polvo|dust|pulvurulento|part[ií]culas/i.test(text)) {
      detectedForm = "solid_dust";
    } else if (/gas\b|gu(á|a)s/i.test(text) && !/gasolina/i.test(text)) {
      detectedForm = "gas";
    } else if (/l[ií]quido|liquid/i.test(text)) {
      detectedForm = "liquid_low_volatility";
      if (/vapor|evaporaci[óo]n rápida/i.test(text))
        detectedForm = "liquid_high_volatility";
    } else if (/s[óo]lido|solid/i.test(text)) {
      detectedForm = "solid_massive";
    }

    // 5. Detect Exposure Routes (Section 11 mainly, but searching broadly)
    const routes = {
      inhalation:
        /inhalac|respiratoria|vapor|polvo|aerosol|H350i|H330|H331|H332/i.test(
          text,
        ),
      dermal: /piel|cut[áa]ne|d[ée]rmic|contacto.*piel|H310|H311|H312/i.test(
        text,
      ),
      oral: /ingesti[óo]n|oral|tragar|H300|H301|H302/i.test(text),
      parenteral:
        /parenteral|inyecci[óo]n|pinchazo|sangre|torrente|aguja/i.test(text),
    };
    // Default Inhalation to true if gas/liquid/dust detected as it's the primary route
    if (detectedForm && detectedForm !== "solid_massive")
      routes.inhalation = true;

    setDetectedRoutes(routes);

    setFormData((prev) => {
      const chemicalData = lookupChemical(
        substanceSummary || prev.substanceName,
      );
      return {
        ...prev,
        substanceName:
          substanceSummary ||
          prev.substanceName ||
          "Sustancia no identificada (Manual)",
        hPhrases: foundPhrases.length > 0 ? foundPhrases : prev.hPhrases,
        isMixture: isMixture,
        concentration: finalConc,
        extraDetails:
          foundComponents.length > 0
            ? JSON.stringify(foundComponents)
            : undefined,
        detectedPhysicalForm: detectedForm,
        vlaInfo: chemicalData
          ? {
              vlaVal: chemicalData.vla.ed_mg,
              suggestedLod: chemicalData.suggestedLod,
              unit: "mg/m³",
              sampling: chemicalData.sampling,
            }
          : undefined,
      };
    });
  };

  const handleAnalyze = () => {
    if (!formData.substanceName) {
      alert("Por favor indique el nombre del agente.");
      return;
    }
    const assessment = onAnalyze(formData);
    setResult(assessment);
  };

  return (
    <StepCard
      title="Módulo A: Identificación de Peligro"
      description="Introduzca los datos de la Ficha de Datos de Seguridad (FDS) para determinar si aplica el RD 665/1997."
      icon="⚠️"
    >
      {/* Upload Area */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        style={{
          marginBottom: "var(--spacing-lg)",
          padding: "1.5rem",
          border: isDragging
            ? "2px dashed var(--color-primary-dark)"
            : "2px dashed var(--color-primary)",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: isDragging ? "rgba(0, 86, 179, 0.1)" : "#f0f7ff",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            marginBottom: "0.5rem",
            pointerEvents: "none",
          }}
        >
          📄
        </div>
        <h4
          style={{
            margin: "0 0 0.5rem 0",
            color: "var(--color-primary)",
            pointerEvents: "none",
          }}
        >
          {isDragging
            ? "¡SUELTA EL DOCUMENTO AQUÍ!"
            : "Análisis Automático de la Ficha de Datos de Seguridad"}
        </h4>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#666",
            marginBottom: "1rem",
            pointerEvents: "none",
          }}
        >
          {isDragging
            ? "..."
            : "Arrastra tu PDF aquí o usa el botón para buscarlo."}
        </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="fds-upload"
        />
        <label
          htmlFor="fds-upload"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor:
              analysisStatus === "analyzing" ? "#ccc" : "var(--color-white)",
            border: "1px solid var(--color-primary)",
            color: "var(--color-primary)",
            borderRadius: "4px",
            cursor: analysisStatus === "analyzing" ? "wait" : "pointer",
            fontWeight: 600,
            position: "relative", // Ensure label stays clickable
            zIndex: 10,
          }}
        >
          {analysisStatus === "analyzing"
            ? "Analizando Ficha..."
            : "Subir Ficha de Seguridad (PDF)"}
        </label>
        {analysisStatus === "success" && (
          <div
            style={{ marginTop: "0.5rem", color: "green", fontWeight: "bold" }}
          >
            ✅ Datos extraídos correctamente
          </div>
        )}
        {analysisStatus === "error" && (
          <div
            style={{ marginTop: "0.5rem", color: "red", fontWeight: "bold" }}
          >
            ❌ Error al leer el PDF
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "1rem 0",
          color: "#ccc",
        }}
      >
        <div
          style={{ flex: 1, height: "1px", background: "currentColor" }}
        ></div>
        <span style={{ padding: "0 1rem", fontSize: "0.8rem" }}>
          O INTRODUCCIÓN MANUAL
        </span>
        <div
          style={{ flex: 1, height: "1px", background: "currentColor" }}
        ></div>
      </div>

      <div className="form-group mb-2">
        <label
          style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}
        >
          Agente(s) cancerigeno(s) identificado(s)
        </label>
        <input
          type="text"
          value={formData.substanceName}
          onChange={(e) =>
            setFormData({ ...formData, substanceName: e.target.value })
          }
          placeholder="Ej: Dicromato de Potasio"
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        {/* MULTI-SUBSTANCE DISPLAY */}
        {detectedComponents.length > 0 ? (
          <div style={{ marginTop: "1rem" }}>
            {detectedComponents.map((comp, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.75rem",
                  backgroundColor: "#fff8f1",
                  borderLeft: "4px solid #dc2626",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontWeight: "bold", color: "#dc2626" }}>
                  {comp.name} - {comp.cat}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                    color: "#444",
                  }}
                >
                  {comp.cat?.includes("1A") || comp.cat?.includes("1B")
                    ? "Sustancia de ALTO RIESGO. Requiere evaluación rigurosa según Art. 5 (Sustitución/Sistema Cerrado)."
                    : "Se recomienda verificar la FDS para confirmar la categoría específica."}
                </div>
                {comp.notes && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#666",
                      marginTop: "0.25rem",
                    }}
                  >
                    Notas: {comp.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* FALLBACK: SINGLE SUBSTANCE MANUAL logic (Keep existing) */

          /* FALLBACK: SINGLE SUBSTANCE MANUAL logic (Keep existing) */
          formData.hPhrases.length > 0 &&
          (() => {
            // Helper to infer explanation (embedded for now, or could be utils)
            const getExplanation = (phrases: HPhrase[]) => {
              let cat = "";
              let text = "";
              let color = "#d97706";

              if (phrases.some((p) => ["H340", "H350", "H360FD"].includes(p))) {
                cat = "Categoría 1A o 1B (Peligro Confirmado)";
                text =
                  "Sustancia de la que se sabe o se supone que es carcinógena, mutágena o tóxica para la reproducción en humanos. REQUIERE SUSTITUCIÓN PRIORITARIA.";
                color = "#dc2626"; // Red
              } else if (
                phrases.some((p) => ["H351", "H341", "H361"].includes(p))
              ) {
                cat = "Categoría 2 (Sospechoso)";
                text =
                  "Se sospecha que provoca cáncer, defectos genéticos o daña la fertilidad/feto. Requiere vigilancia.";
                color = "#d97706"; // Amber
              } else {
                cat = "Clasificación CMR Detectada";
                text = "El agente presenta frases H vinculadas a riesgos CMR.";
              }
              return { cat, text, color };
            };

            const info = getExplanation(formData.hPhrases);

            return (
              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  backgroundColor: "#fff8f1",
                  borderLeft: `4px solid ${info.color}`,
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontWeight: "bold", color: info.color }}>
                  {info.cat}
                </div>
                <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  {info.text}
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* ROUTES OF EXPOSURE VISUALIZATION */}
      <div className="form-group mb-4">
        <label
          style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}
        >
          Vías de Entrada (Identificadas en FDS)
        </label>
        <div className="routes-grid">
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "6px",
              textAlign: "center",
              backgroundColor: detectedRoutes.inhalation
                ? "#e0f2fe"
                : "#f3f4f6",
              border: detectedRoutes.inhalation
                ? "2px solid #0ea5e9"
                : "1px solid #e5e7eb",
              opacity: detectedRoutes.inhalation ? 1 : 0.6,
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
              👃
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: detectedRoutes.inhalation ? "#0369a1" : "#6b7280",
              }}
            >
              Inhalatoria
            </div>
          </div>
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "6px",
              textAlign: "center",
              backgroundColor: detectedRoutes.dermal ? "#fef3c7" : "#f3f4f6",
              border: detectedRoutes.dermal
                ? "2px solid #d97706"
                : "1px solid #e5e7eb",
              opacity: detectedRoutes.dermal ? 1 : 0.6,
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
              ✋
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: detectedRoutes.dermal ? "#92400e" : "#6b7280",
              }}
            >
              Dérmica
            </div>
          </div>
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "6px",
              textAlign: "center",
              backgroundColor: detectedRoutes.oral ? "#ffe4e6" : "#f3f4f6",
              border: detectedRoutes.oral
                ? "2px solid #e11d48"
                : "1px solid #e5e7eb",
              opacity: detectedRoutes.oral ? 1 : 0.6,
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
              👄
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: detectedRoutes.oral ? "#be123c" : "#6b7280",
              }}
            >
              Oral / Digestiva
            </div>
          </div>
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "6px",
              textAlign: "center",
              backgroundColor: detectedRoutes.parenteral
                ? "#f3e8ff"
                : "#f3f4f6",
              border: detectedRoutes.parenteral
                ? "2px solid #9333ea"
                : "1px solid #e5e7eb",
              opacity: detectedRoutes.parenteral ? 1 : 0.6,
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
              🩹
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: detectedRoutes.parenteral ? "#7e22ce" : "#6b7280",
              }}
            >
              Parenteral
            </div>
          </div>
        </div>
      </div>

      <div className="form-group mb-2">
        <label
          style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}
        >
          Frases H Identificadas (Sección 2 FDS)
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {CMR_PHRASES.map((phrase) => (
            <button
              key={phrase}
              onClick={() => togglePhrase(phrase)}
              style={{
                padding: "0.5rem",
                border: formData.hPhrases.includes(phrase)
                  ? "2px solid var(--color-danger)"
                  : "1px solid #ccc",
                backgroundColor: formData.hPhrases.includes(phrase)
                  ? "var(--color-danger-bg)"
                  : "white",
                color: formData.hPhrases.includes(phrase)
                  ? "var(--color-danger-text)"
                  : "#333",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group mb-4">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={formData.isMixture}
            onChange={(e) =>
              setFormData({ ...formData, isMixture: e.target.checked })
            }
          />
          <span style={{ fontWeight: 600 }}>Es una Mezcla</span>
        </label>

        {formData.isMixture && (
          <div style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
            <label style={{ marginRight: "0.5rem" }}>Concentración (%):</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.0"
              style={{ width: "80px", padding: "0.25rem" }}
              value={formData.concentration || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  concentration: parseFloat(e.target.value),
                })
              }
            />
            <p
              style={{
                fontSize: "0.8rem",
                color: "#666",
                marginTop: "0.25rem",
              }}
            >
              Nota Técnica: El límite legal de clasificación es 0.1% para
              Cancerígenos/Mutágenos y 0.3% para Reprotóxicos. Por debajo de
              estos valores, se emitirá una recomendación de precaución.
            </p>
          </div>
        )}
      </div>

      <div
        className="actions"
        style={{
          marginTop: "var(--spacing-lg)",
          borderTop: "1px solid #eee",
          paddingTop: "var(--spacing-md)",
          display: "flex",
          gap: "1rem",
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              color: "#666",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            &larr; Anterior
          </button>
        )}
        {!result ? (
          <button
            onClick={handleAnalyze}
            style={{
              flex: 1,
              backgroundColor: "var(--color-primary)",
              color: "white",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "1rem",
            }}
          >
            Validar Peligrosidad
          </button>
        ) : (
          <div
            className={`result-box ${result.isHazardous ? "danger" : "safe"}`}
            style={{
              padding: "1rem",
              backgroundColor:
                result.isHazardous || result.requiresZeroExposure
                  ? "#fff3cd"
                  : "#d4edda",
              border: `1px solid ${result.isHazardous ? "#ffecb5" : "#c3e6cb"}`,
              borderRadius: "6px",
            }}
          >
            <h4 style={{ color: result.isHazardous ? "#856404" : "#155724" }}>
              {result.isHazardous
                ? "Agente Cancerígeno, Mutágeno o Reprotóxico Confirmado"
                : result.requiresZeroExposure
                  ? "Principio de Precaución"
                  : "No clasificado como Cancerígeno, Mutágeno o Reprotóxico"}
            </h4>

            {result.justifications.map((just, idx) => (
              <div
                key={idx}
                style={{
                  marginTop: "1rem",
                  borderTop: idx > 0 ? "1px dashed rgba(0,0,0,0.1)" : "none",
                  paddingTop: idx > 0 ? "0.5rem" : "0",
                }}
              >
                <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
                  {just.technical}
                </p>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    borderLeft: "2px solid rgba(0,0,0,0.2)",
                    paddingLeft: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <strong>Base Legal:</strong> {just.legal.article} -{" "}
                  {just.legal.text}
                </div>
              </div>
            ))}

            <button
              onClick={onNext}
              style={{
                marginTop: "1rem",
                backgroundColor:
                  result.isHazardous || result.requiresZeroExposure
                    ? "var(--color-danger)"
                    : "var(--color-safe)",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                float: "right",
              }}
            >
              Continuar &rarr;
            </button>
            <div style={{ clear: "both" }}></div>
          </div>
        )}
      </div>
    </StepCard>
  );
};
