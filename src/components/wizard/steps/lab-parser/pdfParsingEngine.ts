import type { Sample } from "../../../../types";

export interface ParsedData {
  fileName: string;
  agentName: string; // Extracted agent
  casNumber: string; // Extracted CAS
  confidence: number; // 0-100
  samples: Partial<Sample>[];
  warnings: string[];
}

// Simulates an AI analysis process
export const parseLabReport = async (
  file: File,
  expectedCas: string,
): Promise<ParsedData> => {
  return new Promise((resolve) => {
    // Simulate processing delay (3 seconds)
    setTimeout(() => {
      // Mock Data - In a real app, this would come from an OCR API (e.g., Azure Form Recognizer / AWS Textract)
      const isCorrectAgent = Math.random() > 0.1; // 10% chance of wrong agent

      resolve({
        fileName: file.name,
        agentName: isCorrectAgent ? "Agente Correcto" : "Tolueno (Detectado)",
        casNumber: isCorrectAgent ? expectedCas || "71-43-2" : "108-88-3",
        confidence: 95,
        warnings: isCorrectAgent
          ? []
          : ["El agente detectado en el informe no coincide con el evaluado."],
        samples: [
          {
            id: "M1",
            type: "lab_calc",
            value: 0.045, // mg/m3 calculated (mock)
            raw: {
              mass: 15, // ug
              flow: 2.0, // l/min (should be matched with real data)
              time: 120, // min (should be matched with real data)
            },
            isBelowLod: false,
          },
          {
            id: "M2",
            type: "lab_calc",
            value: 0.01,
            raw: {
              mass: 2, // ug
              flow: 2.0,
              time: 120,
            },
            isBelowLod: true, // < LOD
            lodMultiplier: 0.5,
          },
          {
            id: "M3",
            type: "lab_calc",
            value: 0.05,
            raw: {
              mass: 20, // ug
              flow: 2.0,
              time: 120,
            },
            isBelowLod: false,
          },
        ],
      });
    }, 3500); // 3.5s delay for "AI" effect
  });
};

export const calculateDailyExposure = (cLab: number, tReal: number): number => {
  // ED = (C_lab * T_real) / 8
  // T_real in hours
  return (cLab * tReal) / 8;
};
