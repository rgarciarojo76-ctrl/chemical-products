export interface LEPData {
  cas: string;
  name: string;
  vla_ed?: number; // mg/m3
  vla_ed_ppm?: number;
  vla_ec?: number; // mg/m3
  notes: ("piel" | "sen" | "C1A" | "C1B" | "M1A" | "M1B" | "R1A" | "R1B")[];
  year: number;
}

// Fuente: Límites de Exposición Profesional para Agentes Químicos en España (INSST 2025 - Simulado)
export const BD_LEP: LEPData[] = [
  {
    cas: "50-00-0",
    name: "Formaldehído",
    vla_ed: 0.37,
    vla_ed_ppm: 0.3,
    vla_ec: 0.74, // STEL
    notes: ["C1B", "sen", "piel"], // C1B = Carc. 1B, Sen = Sensibilizante
    year: 2025,
  },
  {
    cas: "14808-60-7",
    name: "Sílice Libre Cristalina (Cuarzo)",
    vla_ed: 0.05, // Fracción respirable
    notes: ["C1A"],
    year: 2025,
  },
  {
    cas: "108-88-3",
    name: "Tolueno",
    vla_ed: 192,
    vla_ed_ppm: 50,
    vla_ec: 384,
    notes: ["piel", "R1B"], // R1B = Tóxico Repro 1B (simulado)
    year: 2025,
  },
  {
    cas: "67-63-0",
    name: "Alcohol Isopropílico (Isopropanol)",
    vla_ed: 500,
    vla_ed_ppm: 200,
    vla_ec: 1000,
    notes: [],
    year: 2025,
  },
  {
    cas: "7664-93-9",
    name: "Ácido Sulfúrico",
    vla_ed: 0.05, // Fracción torácica
    notes: [], // Nieblas fuertes pueden ser C1A
    year: 2025,
  },
  {
    cas: "1330-20-7",
    name: "Xileno (isómeros)",
    vla_ed: 221,
    vla_ed_ppm: 50,
    vla_ec: 442,
    notes: ["piel"],
    year: 2025,
  },
];

export const getLEPData = (cas: string): LEPData | undefined => {
  return BD_LEP.find((item) => item.cas === cas);
};
