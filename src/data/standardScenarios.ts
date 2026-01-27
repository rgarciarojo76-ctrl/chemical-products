import type { BasicCharacterizationInput } from "../types";

export interface StandardScenario {
  id: string;
  title: string;
  keywords: string[];
  source: string; // e.g., "BASEQUIM 011"
  documentUrl: string; // Actual URL
  risks: ("carcinogen" | "mutagen" | "reprotoxic" | "sensitizer" | "other")[];
  relatedSubstances?: string[]; // e.g. ["formaldehído", "styrene"] - lowercase
  relatedCNAEs?: string[]; // e.g. ["86", "20"] - startsWith matching
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
    documentUrl: "https://www.insst.es/basequim",
    risks: ["carcinogen", "sensitizer"],
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
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/ntp",
    risks: ["carcinogen", "reprotoxic"], // Mn is Repro, Fumes Carcinogen
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
    documentUrl: "https://www.hse.gov.uk/pubns/guidance/wl14.pdf",
    risks: ["carcinogen"], // Fumes
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
    documentUrl: "https://www.insst.es/basequim",
    risks: ["carcinogen"], // Wood dust
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
    documentUrl: "https://www.hse.gov.uk/pubns/guidance/wl2.pdf",
    risks: ["carcinogen"],
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
    documentUrl: "https://www.insst.es/basequim",
    risks: ["sensitizer", "carcinogen"], // Isocyanates and some solvent/pigments
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
    documentUrl: "https://www.hse.gov.uk/pubns/guidance/sr2.pdf",
    risks: ["other"], // Typically solvents, not CMR by default
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
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/ntp",
    risks: ["reprotoxic"], // Many solvents are repro (Toluene)
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
    documentUrl: "https://www.hse.gov.uk/pubns/guidance/sr18.pdf",
    risks: ["reprotoxic"],
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
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/guias-tecnicas",
    risks: ["carcinogen"],
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
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/guias-tecnicas",
    risks: ["carcinogen"],
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
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/guias-tecnicas",
    risks: ["carcinogen"],
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
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/ntp",
    risks: ["carcinogen", "mutagen", "reprotoxic"], // Generic lab
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
    documentUrl:
      "https://www.mscbs.gob.es/ciudadanos/saludAmbLaboral/docs/ProtocoloVigilanciaSanitariaFormaldehido.pdf",
    risks: ["carcinogen", "sensitizer"],
    relatedSubstances: ["formaldehído", "formol"],
    relatedCNAEs: ["86", "8610", "7500"], // Sanidad y Veterinaria
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
  {
    id: "formaldehyde_embalming",
    title: "Tanatopraxia / Embalsamamiento",
    keywords: [
      "funeraria",
      "embalsamamiento",
      "formol",
      "cadáver",
      "tanatorio",
    ],
    source: "Guía Bioseguridad Funeraria",
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/ntp",
    risks: ["carcinogen", "sensitizer"],
    relatedSubstances: ["formaldehído", "formol", "metanal"],
    relatedCNAEs: ["9603"],
    icon: "⚰️",
    description: "Inyección y drenaje con fluidos de conservación (Formol).",
    defaults: {
      processDescription: "Inyección arterial de fluidos con formaldehído.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Mesa con extracción
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara media cara A2P2 (altas conc.)",
      frequency: "daily",
      duration: "2h_4h",
      dermalPPE: "Delantal impermeable + Guantes Nitrilo caña larga",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Altas concentraciones en inyección. Ventilación general insuficiente (requiere 15 ren/h o extracción en mesa).",
  },
  {
    id: "resins_manufacture",
    title: "Fabricación Resinas Fenólicas/Urea",
    keywords: ["resina", "fenol", "formaldehído", "tableros", "cola"],
    source: "NTP 873 (Tableros)",
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/ntp",
    risks: ["carcinogen", "sensitizer"],
    relatedSubstances: ["formaldehído", "formol", "fenol"],
    relatedCNAEs: ["20", "16"], // Química y Madera
    icon: "🏭",
    description: "Síntesis o uso industrial de resinas con formaldehído libre.",
    defaults: {
      processDescription: "Mezcla y reacción de componentes para resinas.",
      isOpenProcess: false, // Reactores cerrados usualmente
      technicalMeasure: "closed_system",
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "A2 (Mantenimiento/Fugas)",
      frequency: "daily",
      duration: "gt_4h",
      dermalPPE: "Traje Químico Tipo 3/4",
    },
    minTechnicalMeasure: "closed_system",
    gapWarning:
      "En fabricación industrial, el sistema cerrado es el estándar. Fugas críticas en bombas/válvulas.",
  },

  // --- OTHERS ---
  {
    id: "diesel_emissions",
    title: "Emisiones Motor Diésel (Talleres/ITV)",
    keywords: ["diesel", "motor", "taller", "humo", "tubo escape"],
    source: "RD 1154/2020",
    documentUrl: "https://www.boe.es/eli/es/rd/2020/12/22/1154/con",
    risks: ["carcinogen"],
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
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/ntp",
    risks: ["sensitizer"], // NOT CARCINOGEN - Should be filtered out
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
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/ntp",
    risks: ["other"], // Physical risk + Corrosive
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
    documentUrl:
      "https://www.insst.es/el-instituto-al-dia/catalogo-de-publicaciones/guias-tecnicas",
    risks: ["carcinogen", "reprotoxic"], // Many are suspected
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
    documentUrl: "https://www.hse.gov.uk/pubns/guidance/cn7.pdf",
    risks: ["reprotoxic"], // Styrene is suspected Repro
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
    documentUrl: "https://www.insst.es",
    risks: ["reprotoxic"],
    icon: "👟",
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
    documentUrl: "https://www.insst.es",
    risks: ["sensitizer"], // NOT CMR
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

  // --- AMPLIACIÓN 2026: CANCERÍGENOS, MUTÁGENOS Y REPROTÓXICOS (CMR) ---

  // 1. DISOLVENTES CANCERÍGENOS (Benceno, Tricloroetileno, etc.)
  {
    id: "cmr_solvent_handling",
    title: "Manipulación de Disolventes CMR (Benceno, Tricloroetileno, etc.)",
    keywords: [
      "benceno",
      "disolvente",
      "limpieza",
      "desengrase",
      "laboratorio",
      "tricloroetileno",
      "1,2-dicloroetano",
      "cloroformo",
    ],
    source: "INSST NTP 467 / Guías Técnicas",
    documentUrl: "https://www.insst.es/",
    risks: ["carcinogen", "mutagen", "other"], // other = skin
    relatedSubstances: [
      "benceno",
      "tricloroetileno",
      "tetracloroetileno",
      "percloroetileno",
      "1,2-dicloroetano",
      "dicloruro de etileno",
      "cloroformo",
      "1,2-dicloropropano",
      "nitrobenceno",
      "dimetilformamida",
      "dmf",
      "nmp",
      "dmac",
    ],
    icon: "🧪",
    description:
      "Uso de disolventes volátiles clasificados C1A/C1B. Peligro por inhalación y contacto dérmico.",
    defaults: {
      processDescription:
        "Uso manual o semicerrado de disolventes orgánicos peligrosos.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction",
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE:
        "Máscara media cara + Filtro AX (si bajo pto ebullición) o A2",
      dermalPPE:
        "Guantes Laminados (PE/EVOH) o Viton (Nitrilo suele ser permeable a estos)",
      frequency: "daily",
      duration: "15m_2h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Agentes C1A/C1B requieren sustitución prioritaria. Si no es posible, sistema cerrado o extracción localizada estricta y EPIs de alta resistencia química.",
  },

  // 2. MONÓMEROS Y PLÁSTICOS (Acrilonitrilo, Vinilo, Estireno)
  {
    id: "cmr_monomers",
    title: "Polimerización y Monómeros (Acrilonitrilo, Vinilo, Estireno)",
    keywords: [
      "plástico",
      "resina",
      "monómero",
      "reactor",
      "fuga",
      "acrilonitrilo",
      "vinilo",
      "estireno",
    ],
    source: "Industria Química / Plásticos",
    documentUrl: "https://www.insst.es/",
    risks: ["carcinogen", "other"], // other = flammable
    relatedSubstances: [
      "acrilonitrilo",
      "cloruro de vinilo",
      "estireno",
      "1,3-butadieno",
      "acrilamida",
      "metil metacrilato",
      "óxido de propileno",
      "epiclorohidrina",
      "bromoetileno",
    ],
    icon: "🏭",
    description:
      "Procesos de síntesis o manipulación de monómeros reactivos y volátiles.",
    defaults: {
      processDescription:
        "Control de reactores, toma de muestras o carga de aditivos.",
      isOpenProcess: false,
      technicalMeasure: "closed_system", // Corrected
      cleaningMethod: "hepa_wet", // Corrected
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara Compelta A2P3 o Semimáscara",
      frequency: "daily",
      duration: "gt_4h",
      dermalPPE: "Traje Tipo 3/4 + Guantes Químicos",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "El Cloruro de Vinilo y otros monómeros son C1A. Se recomienda monitorización ambiental continua y sistemas cerrados.",
  },

  // 3. METALES TOXICOS (Níquel, Cadmio, Arsénico, Berilio)
  {
    id: "cmr_toxic_metals",
    title: "Manipulación de Polvos Metálicos Tócicos (Ni, Cd, As, Be)",
    keywords: [
      "polvo",
      "metal",
      "níquel",
      "cadmio",
      "arsénico",
      "berilio",
      "fusión",
      "lija",
    ],
    source: "UNE-EN 689 / Guía Metales",
    documentUrl: "https://www.insst.es/",
    risks: ["carcinogen", "reprotoxic", "sensitizer"],
    relatedSubstances: [
      "níquel",
      "compuestos de níquel",
      "cadmio",
      "arsénico",
      "ácido arsénico",
      "berilio",
      "cobalto",
      "plomo",
      "trióxido de antimonio",
    ],
    icon: "🔩",
    description:
      "Generación de polvo respirable conteniendo metales pesados cancerígenos.",
    defaults: {
      processDescription:
        "Pesada, mezcla, lijado o procesado de sales metálicas.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction",
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara FFP3 o P3 (Partículas tóxicas)",
      dermalPPE: "Guantes Nitrilo + Ropa protección partículas",
      frequency: "daily",
      duration: "15m_2h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Limpieza con aspirador HEPA H estricta. Prohibido barrer. VLA muy bajos (microgramos).",
  },

  // 4. CROMO VI (Tratamientos Superficiales)
  {
    id: "chrome_vi_plating",
    title: "Baños de Cromado / Tratamiento Superficial (Cr VI)",
    keywords: [
      "cromo",
      "hexavalente",
      "baño",
      "galvanotecnia",
      "electrolisis",
      "niebla",
    ],
    source: "R.D. 374/2001 / Guía Técnica",
    documentUrl: "https://www.insst.es/",
    risks: ["carcinogen", "sensitizer", "other"], // other=corrosine
    relatedSubstances: [
      "cromo vi",
      "trióxido de cromo",
      "cromatos",
      "dicromatos",
      "ácido crómico",
    ],
    icon: "🚿",
    description: "Emisión de nieblas ácidas con Cromo VI durante electrolisis.",
    defaults: {
      processDescription: "Operación en cubas de cromado electrolítico.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction",
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara FFP3 (Nieblas) + Pantalla Facial",
      dermalPPE: "Guantes Alta Resist. (Butilo/Viton) + Delantal",
      frequency: "daily",
      duration: "gt_4h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Uso obligatorio de supresores de niebla y extracción localizada. Control estricto del VLA-EC.",
  },

  // 5. MADERA DURA
  {
    id: "hardwood_dust",
    title: "Procesado de Madera Dura (Polvo)",
    keywords: [
      "madera",
      "polvo",
      "lija",
      "corte",
      "aserradero",
      "carpintería",
      "roble",
      "haya",
    ],
    source: "UNE-EN 50632 / Guía Madera",
    documentUrl: "https://www.insst.es/",
    risks: ["carcinogen", "sensitizer"],
    relatedSubstances: [
      "polvo de maderas duras",
      "madera",
      "roble",
      "haya",
      "caoba",
    ],
    icon: "🪚",
    description:
      "Corte y lijado de maderas duras carcinógenas (Roble, Haya, etc.).",
    defaults: {
      processDescription: "Lijado o corte de madera.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Aspiración herramienta + Banco
      cleaningMethod: "hepa_wet", // closest
      accessRestricted: false,
      signageGHS08: true,
      respiratoryPPE: "Mascarilla FFP2 / FFP3",
      frequency: "daily",
      duration: "2h_4h",
      dermalPPE: "Ropa trabajo (evitar acumulación polvo)",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Maquinaria debe tener extracción integrada. Limpieza HEPA obligatoria.",
  },

  // 6. FORMALDEHÍDO (Anatomía Patológica / Formol)
  {
    id: "formaldehyde_lab",
    title: "Uso de Formaldehído (Sanidad / Laboratorio)",
    keywords: [
      "formaldehído",
      "formol",
      "hospital",
      "anatomía",
      "biopsia",
      "muestras",
    ],
    source: "Guía Práctica Formaldehído",
    documentUrl: "https://www.insst.es/",
    risks: ["carcinogen", "sensitizer"],
    relatedSubstances: ["formaldehído", "formol", "paraformaldehído"],
    icon: "🏥",
    description: "Tallado de muestras, conservación en formol.",
    defaults: {
      processDescription: "Manipulación de muestras biológicas en formol.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction", // Mesa de tallado con extracción
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Media máscara A2P2 (o B+P2)",
      dermalPPE: "Guantes Nitrilo (Doble guante rec.)",
      frequency: "daily",
      duration: "2h_4h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "El formaldehído es sensibilizante y C1B. Mesas con extracción inferior/trasera obligatorias.",
  },

  // 7. ÓXIDO DE ETILENO (Esterilización)
  {
    id: "eto_sterilization",
    title: "Esterilización con Óxido de Etileno",
    keywords: [
      "eto",
      "oxido",
      "etileno",
      "esterilizacion",
      "hospital",
      "equipos",
    ],
    source: "NTP 1157",
    documentUrl: "https://www.insst.es/",
    risks: ["carcinogen", "mutagen", "reprotoxic"],
    relatedSubstances: ["óxido de etileno"],
    icon: "🧼",
    description: "Ciclos de esterilización de material médico.",
    defaults: {
      processDescription: "Carga/Descarga de esterilizador y aireación.",
      isOpenProcess: false, // Ciclo cerrado
      technicalMeasure: "containment_extraction", // Cabina para descarga
      cleaningMethod: "none",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE:
        "Máscara AX (Gases bajo pto ebullición) o Suministro Aire",
      dermalPPE: "Guantes específicos",
      frequency: "weekly",
      duration: "15m_2h",
    },
    minTechnicalMeasure: "general_ventilation",
    gapWarning:
      "Riesgo muy alto en apertura de puerta. Se requiere sistema de aireación forzada previa.",
  },

  // 8. FIBRAS CERÁMICAS REFRACTARIAS (FCR)
  {
    id: "rcf_furnace",
    title: "Manipulación de Fibras Cerámicas Refractarias",
    keywords: [
      "fcr",
      "fibra",
      "ceramica",
      "horno",
      "aislamiento",
      "refractario",
    ],
    source: "Directiva Cancerígenos",
    documentUrl: "https://www.insst.es/",
    risks: ["carcinogen", "other"], // other=irritant
    relatedSubstances: ["fibras cerámicas", "fcr", "lana aislante"],
    icon: "🧱",
    description:
      "Instalación o retirada de aislamiento en hornos industriales.",
    defaults: {
      processDescription: "Retirada de aislamiento degradado (fibras).",
      isOpenProcess: true,
      technicalMeasure: "suppression", // Humectación
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "Máscara Completa P3 / Motorizada TH3",
      dermalPPE: "Mono Tipo 5/6 (Desechable) con capucha",
      frequency: "sporadic",
      duration: "gt_4h",
    },
    minTechnicalMeasure: "suppression",
    gapWarning:
      "Material Friable. Prohibido barrer. Usar técnicas húmedas y aspiración H.",
  },

  // 9. PLOMO (Baterías / Fundición)
  {
    id: "lead_handling",
    title: "Trabajos con Plomo (Baterías/Fundición)",
    keywords: ["plomo", "bateria", "fundicion", "reciclaje", "soldadura"],
    source: "Guía Técnica Plomo (Nueva Directiva)",
    documentUrl: "https://www.insst.es/",
    risks: ["reprotoxic", "other"], // other=acumulativo
    relatedSubstances: ["plomo", "compuestos de plomo", "oxido de plomo"],
    icon: "🔋",
    description: "Exposición a polvo o humos de plomo. Riesgo bioacumulativo.",
    defaults: {
      processDescription: "Manipulación de pasta de plomo o fundición.",
      isOpenProcess: true,
      technicalMeasure: "local_extraction",
      cleaningMethod: "hepa_wet",
      accessRestricted: true,
      signageGHS08: true,
      respiratoryPPE: "FFP3 / P3",
      dermalPPE: "Guantes impermeables + Ropa cambio diario",
      frequency: "daily",
      duration: "gt_4h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Control biológico (Plomo en sangre) obligatorio. Higiene personal estricta (no comer/fumar).",
  },

  // 10. REPROTÓXICOS VARIOS (Disolventes esp.)
  {
    id: "repro_solvents",
    title: "Disolventes Reprotóxicos (DMF, DMAc, 2-ME)",
    keywords: ["reprotoxico", "disolvente", "dmf", "dmac", "metoxietanol"],
    source: "Guía Reprotóxicos",
    documentUrl: "https://www.insst.es/",
    risks: ["reprotoxic", "other"],
    relatedSubstances: [
      "n,n-dimetilformamida",
      "dmf",
      "n,n-dimetilacetamida",
      "dmac",
      "2-metoxietanol",
      "2-etoxietanol",
    ],
    icon: "🤰",
    description: "Disolventes industriales con toxicidad para la reproducción.",
    defaults: {
      processDescription:
        "Uso de disolvente en proceso industrial (textil/químico).",
      isOpenProcess: false,
      technicalMeasure: "local_extraction",
      cleaningMethod: "hepa_wet",
      accessRestricted: false,
      signageGHS08: true,
      respiratoryPPE: "Máscara A2",
      dermalPPE: "Guantes Butilo/Teflón (Permeabilidad crítica)",
      frequency: "daily",
      duration: "2h_4h",
    },
    minTechnicalMeasure: "local_extraction",
    gapWarning:
      "Especial protección a trabajadoras gestantes/lactantes. Absorción vía dérmica muy relevante.",
  },
];
