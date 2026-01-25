import type { BasicCharacterizationInput } from "../types";

export interface StandardScenario {
  id: string;
  title: string;
  keywords: string[];
  source: string; // e.g., "BASEQUIM 011"
  icon: string; // Emoji or Icon name
  description: string;

  // The optimized presets
  defaults: Partial<BasicCharacterizationInput>;

  // Gap Analysis Rules
  minTechnicalMeasure: BasicCharacterizationInput["technicalMeasure"];
  gapWarning: string;
}

export const StandardScenarios_DB: StandardScenario[] = [
  {
    id: "welding_tig_stainless",
    title: "Soldadura TIG en Acero Inoxidable",
    keywords: [
      "soldadura",
      "tig",
      "acero",
      "inox",
      "humo",
      "metal",
      "cromo",
      "níquel",
    ],
    source: "BASEQUIM Ficha 011",
    icon: "🔥",
    description:
      "Volatilización de metales base y aporte por arco eléctrico (Cr VI, Ni, Mn).",
    defaults: {
      processDescription:
        "Soldadura TIG en acero inoxidable con aporte, generando humos metálicos.",
      isOpenProcess: true, // It is open, but controlled
      technicalMeasure: "local_extraction", // Priority 1
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Pantalla soldadura + Mascarilla FFP3 / Motorizado TH2",
      frequency: "daily",
      duration: "2h_4h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "La Ficha 011 de BASEQUIM recomienda Extracción Localizada en antorcha o brazo aspirante. Una medida inferior aumentará significativamente la exposición a Cancerígenos.",
  },
  {
    id: "wood_sanding_hard",
    title: "Lijado/Mecanizado de Maderas Duras",
    keywords: [
      "madera",
      "lijado",
      "polvo",
      "carpintería",
      "mecanizado",
      "aserrín",
      "roble",
      "haya",
    ],
    source: "BASEQUIM 017 / Guía RD 665",
    icon: "🪚",
    description:
      "Generación mecánica de polvo de madera dura (Cancerígeno) por abrasión.",
    defaults: {
      processDescription:
        "Lijado de superficie de madera dura con herramienta portátil.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Integrated tool extraction
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Mascarilla FFP2 o superior",
      frequency: "daily",
      duration: "gt_4h", // Corrected from hour_4
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "El polvo de maderas duras es cancerígeno. Se requiere captación en el origen (herramienta conectada o mesa de aspiración). El uso exclusivo de Ventilación General no es aceptable.",
  },
  {
    id: "diesel_emissions",
    title: "Emisiones Motor Diésel (Talleres/Minería)",
    keywords: [
      "diesel",
      "motor",
      "taller",
      "humo",
      "escape",
      "carbono",
      "hollin",
    ],
    source: "RD 1154/2020 / Ficha ACT 2",
    icon: "🚛",
    description: "Exposición a humos de combustión diésel (Carbono Elemental).",
    defaults: {
      processDescription:
        "Pruebas de funcionamiento de motores diésel en espacio confinado/taller.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Hose connection
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Mascarilla FFP3 con carbón activo (olores)",
      hygieneRights: true, // Specific mention
      frequency: "sporadic", // Often variable
      duration: "15m_2h", // Corrected from min_30
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Para emisiones diésel en interiores, es necesaria la captación directa en el tubo de escape. La ventilación dispersiva es insuficiente.",
  },
  {
    id: "silica_cutting",
    title: "Manipulación de Sílice (Corte/Perforación)",
    keywords: [
      "sílice",
      "silice",
      "corte",
      "hormigón",
      "piedra",
      "cantera",
      "polvo",
      "obra",
    ],
    source: "Guía Técnica Sílice (INS)",
    icon: "🧱",
    description:
      "Corte o perforación de materiales con sílice cristalina respirable.",
    defaults: {
      processDescription:
        "Corte de material de construcción con disco abrasivo.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Mapped suppression to closest valid enum
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Mascarilla P3",
      frequency: "daily",
      duration: "2h_4h", // Corrected from hour_2
    },
    minTechnicalMeasure: "local_extraction", // Mapped from suppression
    gapWarning:
      "La sílice cristalina requiere vía húmeda (asimilada aquí a control localizado) o extracción en la herramienta. Trabajar en seco sin captación está prohibido.",
  },
];
