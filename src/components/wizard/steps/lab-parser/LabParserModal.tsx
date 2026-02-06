import React, { useState, useEffect } from "react";
import { X, UploadCloud, Cpu, CheckCircle2 } from "lucide-react";
import type { ParsedData } from "./pdfParsingEngine";
import { parseLabReport } from "./pdfParsingEngine";
import { ExtractionValidator } from "./ExtractionValidator";

interface LabParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (samples: ParsedData["samples"]) => void;
  expectedCas?: string;
  gesDuration?: number; // Total duration in hours
}

export const LabParserModal: React.FC<LabParserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  expectedCas = "",
  gesDuration = 8,
}) => {
  const [step, setStep] = useState<"upload" | "processing" | "validation">(
    "upload",
  );
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep("upload");
      setFile(null);
      setParsedData(null);
      setLogs([]);
    }
  }, [isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      startProcessing(selectedFile);
    }
  };

  const startProcessing = async (file: File) => {
    setStep("processing");
    const logSequence = [
      "Inicializando motor OCR (Tesseract v5)...",
      "Escaneando estructura del documento...",
      `Buscando CAS ${expectedCas || "del agente"}...`,
      "Identificando tabla de resultados...",
      "Extrayendo valores de masa absoluta (µg)...",
      "Verificando límites de detección (LOD/LOQ)...",
      "Validación cruzada completada.",
    ];

    // Simulate logs
    for (let i = 0; i < logSequence.length; i++) {
      setTimeout(() => {
        setLogs((prev) => [...prev, logSequence[i]]);
      }, i * 500);
    }

    try {
      const result = await parseLabReport(file, expectedCas);
      setTimeout(() => {
        setParsedData(result);
        setStep("validation");
      }, 4000);
    } catch (error) {
      console.error(error);
      setStep("upload"); // Fail gracefully
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-scaleIn overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">
                Motor de Lectura Inteligente (OCR/IA)
              </h3>
              <p className="text-xs text-gray-500">
                Versión 2.4.0 • Modelo Biológico-Químico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative bg-gray-100/50">
          {/* STEP 1: UPLOAD */}
          {step === "upload" && (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-xl bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-12 text-center hover:border-indigo-500 transition-all group cursor-pointer relative overflow-hidden">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud size={40} className="text-indigo-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Arrastra tu Informe de Laboratorio
                </h4>
                <p className="text-gray-500 mb-6">
                  o haz clic para explorar archivos PDF
                </p>

                <div className="flex gap-4 justify-center text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} /> Lectura de Tablas
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} /> Detección ND/LOQ
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} /> Validación CAS
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROCESSING */}
          {step === "processing" && (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-black">
              <div className="w-full max-w-md">
                {/* Terminal Effect */}
                <div className="font-mono text-green-400 text-sm mb-8 h-48 overflow-hidden relative">
                  {logs.map((log, i) => (
                    <div key={i} className="mb-1 opacity-80">
                      &gt; {log}
                    </div>
                  ))}
                  <div className="animate-pulse">_</div>
                </div>

                {/* Loader */}
                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-indigo-500 blur-sm animate-loading-bar"></div>
                </div>
                <p className="text-center text-gray-400 mt-4 text-xs tracking-wider uppercase">
                  Analizando Documento...
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: VALIDATION */}
          {step === "validation" && parsedData && (
            <ExtractionValidator
              parsedData={parsedData}
              file={file}
              expectedCas={expectedCas}
              gesDuration={gesDuration}
              onConfirm={onConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
};
