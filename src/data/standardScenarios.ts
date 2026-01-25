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
  // --- METALWORKING (SOLDADURA Y CORTE) ---
  {
    id: "welding_tig_stainless",
    title: "Soldadura TIG en Acero Inoxidable",
    keywords: ["soldadura", "tig", "acero", "inox", "cromo", "níquel"],
    source: "BASEQUIM Ficha 011",
    icon: "🔥",
    description: "Volatilización de metales (Cr VI, Ni) por arco eléctrico.",
    defaults: {
      processDescription: "Soldadura TIG en acero inoxidable con aporte.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction",
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Pantalla soldadura + Mascarilla FFP3 / Motorizado TH2",
      frequency: "daily",
      duration: "2h_4h",
      dermalPPE: "Guantes soldador + Manguitos",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Ficha 011 BASEQUIM exige extracción localizada. Riesgo cáncer pulmón (Cr VI).",
  },
  {
    id: "welding_mig_mag",
    title: "Soldadura MIG/MAG (Acero Carbono)",
    keywords: ["soldadura", "mig", "mag", "hilo", "humos", "manganeso"],
    source: "INSST NTP 1022",
    icon: "⚡",
    description: "Soldadura de hilo continuo. Alta generación de humos y Mn.",
    defaults: {
      processDescription: "Soldadura MIG/MAG de piezas de acero al carbono.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Antorcha aspirante preferible
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: false,
      respiratoryPPE: "FFP2 (Mínimo) / FFP3 (Recomendado)",
      frequency: "daily",
      duration: "gt_4h",
      dermalPPE: "Ropa inifuga, Guantes cuero",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "La alta tasa de emisión del MIG/MAG requiere extracción en antorcha o brazo muy próximo.",
  },
  {
    id: "oxycut_plasma",
    title: "Corte por Plasma / Oxicorte",
    keywords: ["corte", "plasma", "laser", "oxicorte", "chapa", "humos"],
    source: "HSE COSHH WL14",
    icon: "🎆",
    description:
      "Corte térmico de metales. Emisión masiva de humos metálicos y gases (NOx, O3).",
    defaults: {
      processDescription: "Corte automatizado/manual de chapa metálica.",
      isOpenProcess: true, // A menudo mesa de agua o extracción inferior
      technicalMeasure: "local_extraction", // Mesa sectorizada
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "No necesaria si extracción eficaz (Si manual: FFP3)",
      frequency: "daily",
      duration: "2h_4h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "El corte térmico genera columnas de humo de alta velocidad. Solo mesas de aspiración sectorizada son efectivas.",
  },

  // --- SURFACE TREATMENT (LIJADO Y PULIDO) ---
  {
    id: "wood_sanding_hard",
    title: "Lijado/Mecanizado de Maderas Duras",
    keywords: ["madera", "lijado", "polvo", "carpintería", "roble", "haya"],
    source: "BASEQUIM 017 / Guía RD 665",
    icon: "🪚",
    description: "Polvo de madera dura (Cancerígeno) por abrasión mecánica.",
    defaults: {
      processDescription: "Lijado de madera dura con herramienta portátil.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction",
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Mascarilla FFP2 o superior",
      frequency: "daily",
      duration: "gt_4h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Polvo cancerígeno. Obligatoria extracción integrada en herramienta.",
  },
  {
    id: "metal_grinding",
    title: "Amolado/Desbaste de Metal",
    keywords: ["radial", "amoladora", "desbaste", "chispa", "polvo"],
    source: "HSE COSHH WL2",
    icon: "⚙️",
    description:
      "Eliminación de material con disco abrasivo de alta velocidad.",
    defaults: {
      processDescription:
        "Desbaste de soldaduras o piezas metálicas con radial.",
      isOpenProcess: true,
      technicalMeasure: "none", // Muy difícil de controlar a menudo, pero debería tener LEV
      cleaningMethod: "hepa_wet",
      accessRestricted: false,
      signageGHS08: false,
      respiratoryPPE: "FFP3 (Si no hay extracción) / FFP2",
      frequency: "daily",
      duration: "15m_2h",
      dermalPPE: "Guantes anticorte",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "El amolado dispersa polvo a alta energía. Se recomiendan herramientas con carenado de extracción.",
  },

  // --- CHEMICALS & PAINTING ---
  {
    id: "spray_painting_booth",
    title: "Pintura a Pistola (Cabina)",
    keywords: [
      "pintura",
      "spray",
      "pistola",
      "barniz",
      "isocianatos",
      "disolvente",
    ],
    source: "BASEQUIM 054",
    icon: "🎨",
    description:
      "Aplicación de pintura en spray. Riesgo por isocianatos y VOCs.",
    defaults: {
      processDescription: "Aplicación de pintura poliuretano/epoxi a pistola.",
      isOpenProcess: true, // Aunque es cabina, el operario suele estar dentro
      technicalMeasure: "containment_extraction", // Cabina
      cleaningMethod: "none", // Limpieza programada
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara completa A2P3 / Suministro aire",
      frequency: "daily",
      duration: "2h_4h",
      dermalPPE: "Mono Tyvek + Guantes Nitrilo",
    },
    minTechnicalMeasure: "containment_extraction", // Cabina es "containment" en nuestro modelo simplificado o LEV muy bueno
    gapWarning:
      "La aplicación a pistola DEBE realizarse en cabina con flujo vertical u horizontal controlado. Nunca en abierto.",
  },
  {
    id: "manual_painting",
    title: "Pintura a Brocha/Rodillo (Disolvente)",
    keywords: ["pintura", "manual", "rodillo", "brocha", "disolvente"],
    source: "HSE COSHH SR2",
    icon: "🖌️",
    description:
      "Aplicación manual. Evaporación pasiva de disolventes orgánicos.",
    defaults: {
      processDescription:
        "Pintado manual de piezas/superficies con base disolvente.",
      isOpenProcess: true,
      technicalMeasure: "general_ventilation", // A menudo aceptable si cantidad baja
      cleaningMethod: "none",
      accessRestricted: false,
      signageGHS08: false,
      respiratoryPPE: "Máscara media cara A1 (Vapores Orgánicos)",
      frequency: "weekly",
      duration: "2h_4h",
      dermalPPE: "Guantes Nitrilo",
    },
    minTechnicalMeasure: "general_ventilation",
    gapWarning:
      "Asegure ventilación cruzada adecuada (5-10 renovaciones/h). Si espacio confinado, extracción forzada obligatoria.",
  },
  {
    id: "degreasing_solvent",
    title: "Desengrase Manual con Trapo",
    keywords: [
      "limpieza",
      "desengrase",
      "trapo",
      "disolvente",
      "acetona",
      "mek",
    ],
    source: "INSST NTP 768",
    icon: "🧽",
    description: "Limpieza de piezas con trapos impregnados en disolvente.",
    defaults: {
      processDescription:
        "Limpieza manual de superficies con disolvente orgánico.",
      isOpenProcess: true,
      technicalMeasure: "general_ventilation",
      cleaningMethod: "none",
      accessRestricted: false,
      signageGHS08: false,
      respiratoryPPE: "Máscara A1 o FFP con Carbón (si molestia)",
      frequency: "daily",
      duration: "15m_2h",
      dermalPPE: "Guantes Nitrilo/Neopreno (Según ficha)",
    },
    minTechnicalMeasure: "general_ventilation",
    gapWarning:
      "Priorice disolventes de alto punto de ebullición (>100ºC). Evite acetona/MEK en grandes superficies sin extracción.",
  },
  {
    id: "parts_washer",
    title: "Lavadora de Piezas (Estática)",
    keywords: ["lavadora", "piezas", "hidrocarburos", "batea"],
    source: "HSE COSHH SR18",
    icon: "🛁",
    description: "Uso de fuente de desengrase con recirculación.",
    defaults: {
      processDescription:
        "Limpieza en fuente lavapiezas con disolvente alt. ebullición.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Muchas tienen tapa o borde aspirante
      cleaningMethod: "none",
      accessRestricted: false,
      signageGHS08: false,
      respiratoryPPE: "No requerida habitualmente",
      frequency: "daily",
      duration: "15m_2h",
      dermalPPE: "Guantes protección química",
    },
    minTechnicalMeasure: "general_ventilation",
    gapWarning: "",
  },

  // --- CONSTRUCTION & SILICA ---
  {
    id: "silica_cutting",
    title: "Corte/Perforación (Sílice Cristalina)",
    keywords: ["sílice", "corte", "hormigón", "ladrillo", "cantera", "rcs"],
    source: "Guía Técnica Sílice (INSST)",
    icon: "🧱",
    description:
      "Generación de SCR (Sílice Cristalina Respirable) Cancerígeno 1A.",
    defaults: {
      processDescription: "Corte de material de construcción con disco.",
      isOpenProcess: true,
      technicalMeasure: "suppression", // Vía húmeda es clave
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Mascarilla P3 / FFP3",
      frequency: "daily",
      duration: "2h_4h",
      dermalPPE: "Ropa trabajo",
    },
    minTechnicalMeasure: "suppression",
    gapWarning:
      "PROHIBIDO TRABAJAR EN SECO sin captación. Usar agua (vía húmeda) o extracción integrada.",
  },
  {
    id: "demolition_hammer",
    title: "Demolición Manual (Martillo Picador)",
    keywords: ["demolición", "martillo", "obra", "escombros", "sílice"],
    source: "Guía Técnica Sílice",
    icon: "🔨",
    description: "Picado de hormigón/paredes. Alta emisión de polvo.",
    defaults: {
      processDescription:
        "Demolición de muros/soleras con martillo neumático/eléctrico.",
      isOpenProcess: true,
      technicalMeasure: "general_ventilation", // Difícil LEV, a veces agua
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara completa P3 o Motorizado",
      frequency: "sporadic", // O daily en fases
      duration: "gt_4h",
      dermalPPE: "Auditiva + Guantes impacto",
    },
    minTechnicalMeasure: "none", // Aceptamos none si no hay LEV posible, PERO EPI CRITICO
    gapWarning:
      "Si no es posible vía húmeda, el EPI (P3) es la única barrera. Asegure ajuste facial.",
  },
  {
    id: "asbestos_removal",
    title: "Retirada de Amianto (Fibrocemento)",
    keywords: ["amianto", "uralita", "fibrocemento", "tejado"],
    source: "RD 396/2006 (Plan de Trabajo)",
    icon: "☠️",
    description:
      "Manipulación de materiales con amianto. Estrictamente regulado.",
    defaults: {
      processDescription:
        "Desmontaje de placas de fibrocemento (Amianto no friable).",
      isOpenProcess: true, // Exterior usualmente
      technicalMeasure: "suppression", // Rociado encapsulante
      cleaningMethod: "hepa_wet", // Aspirador H
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Mascarilla FFP3 (Mínimo, 1 uso) o Motorizada TM2P",
      frequency: "sporadic",
      duration: "2h_4h",
      dermalPPE: "Mono desechable Tipo 5/6",
    },
    minTechnicalMeasure: "suppression",
    gapWarning:
      "REQUIERE PLAN DE TRABAJO APROBADO. Prohibido romper placas. Rociado continuo con agua/encapsulante.",
  },

  // --- LABORATORIES & INDOOR AIRE ---
  {
    id: "lab_fume_hood",
    title: "Manipulación en Vitrina de Gases",
    keywords: ["laboratorio", "vitrina", "reactivos", "química", "ácido"],
    source: "NTP 672 (Vitrina)",
    icon: "⚗️",
    description: "Trasvases o reacciones dentro de vitrina extractora.",
    defaults: {
      processDescription:
        "Manipulación de reactivos volátiles/tóxicos en laboratorio.",
      isOpenProcess: true, // Abierto pero contenido
      technicalMeasure: "containment_extraction", // Vitrina
      cleaningMethod: "none",
      accessRestricted: true,
      signageGHS08: false,
      respiratoryPPE: "No requerida (Si vitrina OK)",
      frequency: "daily",
      duration: "15m_2h",
      dermalPPE: "Bata + Guantes Nitrilo + Gafas",
    },
    minTechnicalMeasure: "containment_extraction",
    gapWarning:
      "La banda de la vitrina debe estar a la altura de seguridad. No usar como almacén.",
  },
  {
    id: "formaldehyde_pathology",
    title: "Uso de Formol (Anatomía Patológica)",
    keywords: ["formol", "formaldehído", "hospital", "biopsia", "cancerígeno"],
    source: "Protocolo Sanitario Formol",
    icon: "🏥",
    description: "Tallado de muestras en formol. Cancerígeno 1B.",
    defaults: {
      processDescription:
        "Tallado/Recepción de biopsias conservadas en formol.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Mesa tallado
      cleaningMethod: "none",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara media cara A2 o A2P2 (Si salpicaduras)",
      frequency: "daily",
      duration: "2h_4h",
      dermalPPE: "Guantes Nitrilo (Doble o espesor >0.4mm)",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "El formaldehído es cancerígeno y sensibilizante. Obligatorio mesa de tallado con extracción trasera/inferior.",
  },

  // --- OTHERS ---
  {
    id: "diesel_emissions",
    title: "Emisiones Motor Diésel (Talleres/ITV)",
    keywords: ["diesel", "motor", "taller", "humo", "tubo escape"],
    source: "RD 1154/2020",
    icon: "🚛",
    description: "Exposición a humos diésel (Carbono Elemental). Cancerígeno.",
    defaults: {
      processDescription: "Prueba de motores en recinto interior.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Manguera a escape
      cleaningMethod: "none",
      accessRestricted: false,
      signageGHS08: true,
      respiratoryPPE: "No habitual (Controlar foco)",
      frequency: "sporadic",
      duration: "15m_2h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Prohibido verter humos al ambiente interior. Usar boquerel de extracción directa.",
  },
  {
    id: "flour_dust",
    title: "Polvo de Harina (Panadería)",
    keywords: ["harina", "panadería", "obrador", "asma", "polvo"],
    source: "NTP 1060 (Enzimas/Harina)",
    icon: "🥖",
    description: "Sensibilizante (Asma del panadero).",
    defaults: {
      processDescription: "Pesada y vertido de harina en amasadora.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Tapa amasadora o LEV
      cleaningMethod: "hepa_wet", // NUNCA barrer
      accessRestricted: false,
      signageGHS08: true, // Por sensibilizante
      respiratoryPPE: "FFP2 (En tareas de polvo)",
      frequency: "daily",
      duration: "15m_2h",
      dermalPPE: "Ropa trabajo",
    },
    minTechnicalMeasure: "general_ventilation", // LEV deseable, pero GV a veces OK en artesanal
    gapWarning:
      "Principal causa de asma ocupacional. Prohibido barrer en seco (usar aspirador). Verter con suavidad.",
  },
  {
    id: "battery_charging",
    title: "Carga de Baterías (Plomo-Ácido)",
    keywords: ["batería", "ácido", "hidrógeno", "elektror"],
    source: "NTP 1074 (H2)",
    icon: "🔋",
    description: "Emisión de Hidrógeno (Explosivo) y nieblas ácidas.",
    defaults: {
      processDescription: "Zona de carga de carretillas eléctricas.",
      isOpenProcess: true,
      technicalMeasure: "general_ventilation", // Esencial para H2
      cleaningMethod: "none",
      accessRestricted: true,
      signageGHS08: false,
      respiratoryPPE: "No necesaria",
      frequency: "daily",
      duration: "15m_2h",
      dermalPPE: "Gafas + Guantes (manipulación electrolito)",
    },
    minTechnicalMeasure: "general_ventilation",
    gapWarning:
      "Asegurar ventilación (rejillas techo/suelo) para evitar bolsa de hidrógeno explosiva.",
  },
  {
    id: "phytosanitary_application",
    title: "Aplicación Fitosanitarios (Mochila)",
    keywords: ["pesticida", "herbicida", "mochila", "campo", "sulfatar"],
    source: "INSST Guía Fito",
    icon: "🌾",
    description: "Pulverización manual de productos químicos agrícolas.",
    defaults: {
      processDescription: "Aplicación manual con mochila pulverizadora.",
      isOpenProcess: true,
      technicalMeasure: "none", // Exterior
      cleaningMethod: "none",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara A2P3 o A2P2",
      frequency: "sporadic", // Estacional
      duration: "2h_4h",
      dermalPPE: "Traje impermeable (Tipo 4) + Guantes Nitrilo",
    },
    minTechnicalMeasure: "none",
    gapWarning:
      "En exterior, el EPI es la única barrera real. Respetar plazos de seguridad.",
  },
  {
    id: "resins_lamination",
    title: "Laminado de Resinas (Poliéster/Fibra)",
    keywords: ["fibra", "vidrio", "poliéster", "estireno", "barco", "piscina"],
    source: "HSE COSHH CN7",
    icon: "🚤",
    description: "Emisión de Estireno durante curado en molde abierto.",
    defaults: {
      processDescription: "Laminado manual de resina poliéster reforzada.",
      isOpenProcess: true,
      technicalMeasure: "general_ventilation", // LEV difícil en piezas grandes
      cleaningMethod: "none",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara A2 (Estireno)",
      frequency: "daily",
      duration: "gt_4h",
      dermalPPE: "Mono Tyvek + Guantes dobles",
    },
    minTechnicalMeasure: "general_ventilation",
    gapWarning:
      "El estireno requiere ventilación muy abundante (50-100 ppm límite). Rotación de trabajadores recomendada.",
  },
  {
    id: "gluing_shoe",
    title: "Pegado de Calzado/Cuero (Colas)",
    keywords: [
      "cola",
      "pegamento",
      "zapatero",
      "disolvente",
      "tolueno",
      "hexano",
    ],
    source: "Ficha Sector Calzado",
    icon: "uD83DuDC5F",
    description:
      "Uso de adhesivos de contacto base disolvente (n-hexano, tolueno).",
    defaults: {
      processDescription:
        "Aplicación de adhesivo con brocha en banco de trabajo.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Cabina de mesa
      cleaningMethod: "none",
      accessRestricted: false,
      signageGHS08: true, // Neurotóxicos
      respiratoryPPE: "Máscara A1/A2",
      frequency: "daily",
      duration: "gt_4h",
      dermalPPE: "Guantes PVA o específicos (Nitrilo degrada)",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Riesgo de neurotoxicidad (n-hexano). Imprescindible extracción en la mesa de encolado hacia abajo/atrás.",
  },
  {
    id: "hairdressing_products",
    title: "Peluquería (Tintes/Decolorantes)",
    keywords: ["peluquería", "persulfato", "tinte", "amoniaco", "asma"],
    source: "Guía Asma Peluquería",
    icon: "💇",
    description: "Preparación de mezclas colorantes. Riesgo asma y dermatitis.",
    defaults: {
      processDescription: "Mezcla de polvos decolorantes y aplicación.",
      isOpenProcess: true,
      technicalMeasure: "general_ventilation",
      cleaningMethod: "hepa_wet",
      accessRestricted: false,
      signageGHS08: false,
      respiratoryPPE: "FFP2 (Al mezclar polvos)",
      frequency: "daily",
      duration: "15m_2h", // Picos cortos repetidos
      dermalPPE: "Guantes vinilo/nitrilo (Desechables)",
    },
    minTechnicalMeasure: "general_ventilation",
    gapWarning:
      "Ventilar bien el local (evitar acumulación amoniaco). Usar guantes siempre para evitar dermatitis alérgica.",
  },
];
