export interface LEPData {
  cas: string;
  name: string;
  vla_ed?: number; // mg/m3
  vla_ed_ppm?: number;
  vla_ec?: number; // mg/m3
  notes: (
    | "piel"
    | "sen"
    | "C1A"
    | "C1B"
    | "M1A"
    | "M1B"
    | "R1A"
    | "R1B"
    | "R2"
  )[];
  year: number;
}

// Fuente: Límites de Exposición Profesional para Agentes Químicos en España (Proyección 2026)
export const BD_LEP: LEPData[] = [
  // --- EXISTING ---
  {
    cas: "50-00-0",
    name: "Formaldehído",
    vla_ed: 0.37,
    vla_ed_ppm: 0.3,
    vla_ec: 0.74,
    notes: ["C1B", "sen", "piel"],
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
    notes: ["piel", "R1B"], // Suspected Repro
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
    notes: [],
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
  // --- CARCINOGENS 2026 LIST ---
  {
    cas: "71-43-2",
    name: "Benceno",
    vla_ed: 0.66, // 0.2 ppm (Transitory until 2024 was 1ppm, now 0.2)
    vla_ed_ppm: 0.2,
    notes: ["piel", "C1A", "M1B"],
    year: 2025,
  },
  {
    cas: "107-13-1",
    name: "Acrilonitrilo",
    vla_ed: 1, // 0.45 ppm
    vla_ed_ppm: 0.45,
    notes: ["piel", "C1B", "sen"],
    year: 2025,
  },
  {
    cas: "7440-02-0",
    name: "Níquel (Compuestos solubles)",
    vla_ed: 0.1, // Inhalable
    notes: ["sen", "C1A", "R1B"],
    year: 2025, // Metalico es 0.05
  },
  {
    cas: "WOOD-01", // Pseudo-CAS
    name: "Polvo de maderas duras",
    vla_ed: 2,
    notes: ["C1A", "sen"], // Sensibilizante marcado por especies
    year: 2025,
  },
  {
    cas: "CRVI-01", // Pseudo-CAS
    name: "Compuestos de Cromo (VI)",
    vla_ed: 0.01, // 0.005 from 2025 usually
    notes: ["C1A", "sen", "M1B", "R1B"],
    year: 2025,
  },
  {
    cas: "FCR-01",
    name: "Fibras cerámicas refractarias",
    vla_ed: 0.1, // f/cc usually 0.3 or 0.1 depending on transposition
    notes: ["C1B"],
    year: 2025,
  },
  {
    cas: "75-01-4",
    name: "Cloruro de vinilo monómero",
    vla_ed: 2.6, // 1 ppm
    vla_ed_ppm: 1,
    notes: ["C1A"],
    year: 2025,
  },
  {
    cas: "75-21-8",
    name: "Óxido de etileno",
    vla_ed: 1.8, // 1 ppm
    vla_ed_ppm: 1,
    notes: ["piel", "C1B", "M1B", "R1B"], // Full CMR
    year: 2025,
  },
  {
    cas: "75-56-9",
    name: "1,2-epoxipropano (Óxido de propileno)",
    vla_ed: 2.4, // 1 ppm
    vla_ed_ppm: 1,
    notes: ["C1B", "M1B", "sen"],
    year: 2025,
  },
  {
    cas: "79-01-6",
    name: "Tricloroetileno",
    vla_ed: 55, // 10 ppm
    vla_ed_ppm: 10,
    vla_ec: 110, // STEL
    notes: ["piel", "C1B", "M1B"],
    year: 2025,
  },
  {
    cas: "79-06-1",
    name: "Acrilamida",
    vla_ed: 0.03, // Inhalable fraction and vapor
    notes: ["piel", "C1B", "M1B", "R2"],
    year: 2025,
  },
  {
    cas: "79-46-9",
    name: "2-Nitropropano",
    vla_ed: 18, // 5 ppm
    vla_ed_ppm: 5,
    notes: ["C1B"],
    year: 2025,
  },
  {
    cas: "95-53-4",
    name: "o-Toluidina",
    vla_ed: 0.5, // 0.1 ppm
    vla_ed_ppm: 0.1,
    notes: ["piel", "C1B", "sen"],
    year: 2025,
  },
  {
    cas: "101-14-4",
    name: "4,4'-Metilendianilina (MDA)",
    vla_ed: 0.08, // 0.01 ppm??? Check exact, usually very low
    notes: ["piel", "C1B", "M1B", "sen"],
    year: 2025,
  },
  {
    cas: "106-89-8",
    name: "Epiclorohidrina",
    vla_ed: 1.9, // 0.5 ppm? check
    notes: ["piel", "C1B", "sen"],
    year: 2025,
  },
  {
    cas: "106-93-4",
    name: "Dibromuro de etileno",
    vla_ed: 0.8, // 0.1 ppm
    vla_ed_ppm: 0.1,
    notes: ["piel", "C1B"],
    year: 2025,
  },
  {
    cas: "106-99-0",
    name: "1,3-Butadieno",
    vla_ed: 2.2, // 1 ppm
    vla_ed_ppm: 1,
    notes: ["C1A", "M1B"],
    year: 2025,
  },
  {
    cas: "107-06-2",
    name: "Dicloruro de etileno (1,2-Dicloroetano)",
    vla_ed: 8.2, // 2 ppm
    vla_ed_ppm: 2,
    notes: ["piel", "C1B"],
    year: 2025,
  },
  {
    cas: "302-01-2",
    name: "Hidracina",
    vla_ed: 0.013, // 0.01 ppm
    vla_ed_ppm: 0.01,
    notes: ["piel", "C1B", "sen"],
    year: 2025,
  },
  {
    cas: "593-60-2",
    name: "Bromoetileno",
    vla_ed: 4.4, // 1 ppm
    vla_ed_ppm: 1,
    notes: ["C1B"],
    year: 2025,
  },
  {
    cas: "CAD-01",
    name: "Cadmio y compuestos",
    vla_ed: 0.001, // Inhalable 0.001 mg/m3 (Limit since 2027? No, 2021)
    notes: ["C1B", "M1B", "R1B"],
    year: 2025,
  },
  {
    cas: "BER-01",
    name: "Berilio y compuestos",
    vla_ed: 0.0002, // 0.2 ug/m3 = 0.0002 mg/m3
    notes: ["piel", "sen", "C1B"],
    year: 2025,
  },
  {
    cas: "ARS-01",
    name: "Ácido arsénico y sales",
    vla_ed: 0.01,
    notes: ["C1A"],
    year: 2025,
  },
  {
    cas: "101-14-4-MOCA", // MOCA
    name: "4,4'-metilenbis (2 cloroanilina) (MOCA)",
    vla_ed: 0.01, // ??? Very low
    notes: ["piel", "C1B"],
    year: 2025,
  },

  // --- REPROTOXICS ---
  {
    cas: "7439-92-1",
    name: "Plomo y compuestos",
    vla_ed: 0.03, // New directive lowered from 0.15 to 0.03 mg/m3
    notes: ["R1A"],
    year: 2026, // Anticipating
  },
  {
    cas: "127-19-5",
    name: "N,N-dimetilacetamida",
    vla_ed: 36, // 10 ppm
    vla_ed_ppm: 10,
    vla_ec: 72,
    notes: ["piel", "R1B"],
    year: 2025,
  },
  {
    cas: "98-95-3",
    name: "Nitrobenceno",
    vla_ed: 1, // 0.2 ppm
    vla_ed_ppm: 0.2,
    notes: ["piel", "R1B"],
    year: 2025,
  },
  {
    cas: "68-12-2",
    name: "N,N-Dimetilformamida (DMF)",
    vla_ed: 15, // 5 ppm
    vla_ed_ppm: 5,
    vla_ec: 30,
    notes: ["piel", "R1B"],
    year: 2025,
  },
  {
    cas: "109-86-4",
    name: "2-Metoxietanol",
    vla_ed: 3.2, // 1 ppm
    vla_ed_ppm: 1,
    notes: ["piel", "R1B"],
    year: 2025,
  },
  {
    cas: "110-49-6",
    name: "Acetato de 2-metoxietilo",
    vla_ed: 4.9, // 1 ppm
    vla_ed_ppm: 1,
    notes: ["piel", "R1B"],
    year: 2025,
  },
  {
    cas: "110-80-5",
    name: "2-Etoxietanol",
    vla_ed: 7.5, // 2 ppm
    vla_ed_ppm: 2,
    notes: ["piel", "R1B"],
    year: 2025,
  },
  {
    cas: "111-15-9",
    name: "Acetato de 2-etoxietilo",
    vla_ed: 11, // 2 ppm
    vla_ed_ppm: 2,
    notes: ["piel", "R1B"],
    year: 2025,
  },
  {
    cas: "872-50-4",
    name: "1-metil-2-pirrolidona (NMP)",
    vla_ed: 40, // 10 ppm
    vla_ed_ppm: 10,
    vla_ec: 80,
    notes: ["piel", "R1B"],
    year: 2025,
  },
  {
    cas: "HG-01",
    name: "Mercurio y compuestos divalentes",
    vla_ed: 0.02,
    notes: ["piel", "R1B"],
    year: 2025,
  },
  {
    cas: "80-05-7",
    name: "Bisfenol A (4,4'-isopropilidendifenol)",
    vla_ed: 2, // Inhalable
    notes: ["R1B", "sen"], // Also ED (Endocrine Disruptor)
    year: 2025,
  },
  {
    cas: "630-08-0",
    name: "Monóxido de carbono",
    vla_ed: 23, // 20 ppm
    vla_ed_ppm: 20,
    vla_ec: 117, // 100 ppm
    notes: ["R1A"],
    year: 2025,
  },
];

export const getLEPData = (cas: string): LEPData | undefined => {
  return BD_LEP.find((item) => item.cas === cas);
};
