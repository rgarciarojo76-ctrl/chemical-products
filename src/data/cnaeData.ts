export interface AgentInfo {
  name: string;
  context: string; // The full string from Excel for context (risk phases etc)
}

export interface CnaeEntry {
  code: string;
  description: string;
  agents: AgentInfo[];
}

export const CNAE_DATA: CnaeEntry[] = [
  {
    code: "0111",
    description:
      "Cultivo de cereales (excepto arroz), leguminosas y semillas oleaginosas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0112",
    description: "Cultivo de arroz",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0113",
    description: "Cultivo de hortalizas, raíces y tubérculos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0114",
    description: "Cultivo de caña de azúcar",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0115",
    description: "Cultivo de tabaco",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0119",
    description: "Otros cultivos no perennes",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0121",
    description: "Cultivo de la vid",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0122",
    description: "Cultivo de frutos tropicales y subtropicales",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0123",
    description: "Cultivo de cítricos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0124",
    description: "Cultivo de frutos con hueso y pepitas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0125",
    description: "Cultivo de otros árboles y arbustos frutales y frutos secos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0126",
    description: "Cultivo de frutos oleaginosos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0128",
    description:
      "Cultivo de especias, plantas aromáticas, medicinales y farmacéuticas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0129",
    description: "Otros cultivos perennes",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0130",
    description: "Propagación de plantas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0141",
    description: "Explotación de ganado bovino para la producción de leche",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0142",
    description: "Explotación de otro ganado bovino y búfalos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0143",
    description: "Explotación de caballos y otros equinos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0145",
    description: "Explotación de ganado ovino y caprino",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0146",
    description: "Explotación de ganado porcino",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0147",
    description: "Avicultura",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0149",
    description: "Otras explotaciones de ganado",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0150",
    description: "Producción agrícola combinada con la producción ganadera",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0161",
    description: "Actividades de apoyo a la agricultura",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "Sulfato de Dimetilo",
        context: "[Cancerígeno ] Sulfato de Dimetilo - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "0162",
    description: "Actividades de apoyo a la ganadería",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "0163",
    description: "Actividades de preparación posterior a la cosecha",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0164",
    description: "Tratamiento de semillas para reproducción",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0170",
    description:
      "Caza, captura de animales y servicios relacionados con las mismas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
    ],
  },
  {
    code: "0210",
    description: "Silvicultura y otras actividades forestales",
    agents: [
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
    ],
  },
  {
    code: "0220",
    description: "Explotación de la madera",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "0321",
    description: "Acuicultura marina",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "0322",
    description: "Acuicultura en agua dulce",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "0510",
    description: "Extracción de antracita y hulla",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "0610",
    description: "Extracción de crudo de petróleo",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "0729",
    description: "Extracción de otros minerales metálicos no férreos",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "0811",
    description:
      "Extracción de piedra ornamental y para la construcción, piedra caliza, yeso, creta y pizarra",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "0812",
    description:
      "Extracción de gravas y arenas, extracción de arcilla y caolín",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "0891",
    description:
      "Extracción de minerales para productos químicos y fertilizantes",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "0892",
    description: "Extracción de turba",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "0893",
    description: "Extracción de sal",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "0899",
    description: "Otras industrias extractivas n.c.o.p.",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "0910",
    description:
      "Actividades de apoyo a la extracción de petróleo y gas natural",
    agents: [
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "0990",
    description: "Actividades de apoyo a otras industrias extractivas",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "1062",
    description: "Fabricación de almidones y productos amiláceos",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "1091",
    description:
      "Fabricación de productos para la alimentación de animales de granja",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "1092",
    description:
      "Fabricación de productos para la alimentación de animales de compañía",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "1310",
    description: "Preparación e hilado de fibras textiles",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1320",
    description: "Fabricación de tejidos textiles",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1330",
    description: "Acabado de textiles",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CLORURO DE VINILO",
        context: "[Cancerígeno ] CLORURO DE VINILO - Carc. 1A",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1391",
    description: "Fabricación de tejidos de punto",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1392",
    description:
      "Fabricación de artículos confeccionados con textiles, excepto prendas de vestir",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1393",
    description: "Fabricación de alfombras y moquetas",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1394",
    description: "Fabricación de cuerdas, cordeles, bramantes y redes",
    agents: [
      {
        name: "POLVO METAL",
        context: "[Cancerígeno ] POLVO METAL - Carc. 1B, Muta. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "1396",
    description:
      "Fabricación de otros productos textiles de uso técnico e industrial",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1399",
    description: "Fabricación de otros productos textiles n.c.o.p.",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1420",
    description:
      "Actividades de servicios relacionados con la ganadería, excepto actividades veterinarias",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "1511",
    description:
      "Preparación, curtido y acabado del cuero, preparación y teñido de pieles",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CLORURO DE VINILO",
        context: "[Cancerígeno ] CLORURO DE VINILO - Carc. 1A",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1512",
    description:
      "Fabricación de artículos de marroquinería, viaje y de guarnicionería y talabartería",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1520",
    description: "Fabricación de calzado",
    agents: [
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1610",
    description: "Aserrado y cepillado de la madera",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1621",
    description: "Fabricación de chapas y tableros de madera",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1622",
    description: "Fabricación de suelos de madera ensamblados",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1623",
    description:
      "Fabricación de otras estructuras de madera y piezas de carpintería y ebanistería para la construcción",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1624",
    description: "Fabricación de envases y embalajes de madera",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1629",
    description:
      "Fabricación de otros productos de madera, artículos de corcho, cestería y espartería",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1711",
    description: "Fabricación de pasta papelera",
    agents: [
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1712",
    description: "Fabricación de papel y cartón",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CLORURO DE VINILO",
        context: "[Cancerígeno ] CLORURO DE VINILO - Carc. 1A",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1721",
    description:
      "Fabricación de papel y cartón ondulados, fabricación de envases y embalajes de papel y cartón",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1722",
    description:
      "Fabricación de artículos de papel y cartón para uso doméstico, sanitario e higiénico",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1723",
    description: "Fabricación de artículos de papelería",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1729",
    description: "Fabricación de otros artículos de papel y cartón",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "1811",
    description: "Impresión de periódicos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "1812",
    description: "Otras actividades de impresión y artes gráficas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "1813",
    description: "Servicios de preimpresión y preparación de soportes",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "1814",
    description: "Encuadernación y servicios relacionados con la misma",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "1820",
    description: "Reproducción de soportes grabados",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "1920",
    description: "Refino de petróleo",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2011",
    description: "Fabricación de gases industriales",
    agents: [
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2012",
    description: "Fabricación de colorantes y pigmentos",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CLORURO DE VINILO",
        context: "[Cancerígeno ] CLORURO DE VINILO - Carc. 1A",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2013",
    description: "Fabricación de otros productos básicos de química inorgánica",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2014",
    description: "Fabricación de otros productos básicos de química orgánica",
    agents: [
      {
        name: "ACRILONITRILO",
        context: "[Cancerígeno ] ACRILONITRILO - Carc. 1B",
      },
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CADMIO (inhalable)",
        context:
          "[Cancerígeno ] CADMIO (inhalable) - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CADMIO (respirable)",
        context:
          "[Cancerígeno ] CADMIO (respirable) - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CLORURO DE VINILO",
        context: "[Cancerígeno ] CLORURO DE VINILO - Carc. 1A",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "Sulfato de Dimetilo",
        context: "[Cancerígeno ] Sulfato de Dimetilo - Carc. 1B, Muta. 2",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2015",
    description: "Fabricación de fertilizantes y compuestos nitrogenados",
    agents: [
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "2016",
    description: "Fabricación de plásticos en formas primarias",
    agents: [
      {
        name: "ACRILONITRILO",
        context: "[Cancerígeno ] ACRILONITRILO - Carc. 1B",
      },
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2017",
    description: "Fabricación de caucho sintético en formas primarias",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "2020",
    description: "Fabricación de pesticidas y otros productos agroquímicos",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "Sulfato de Dimetilo",
        context: "[Cancerígeno ] Sulfato de Dimetilo - Carc. 1B, Muta. 2",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2030",
    description:
      "Fabricación de pinturas, barnices y revestimientos similares, tintas de imprenta y masillas",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2041",
    description:
      "Fabricación de jabones, detergentes y otros artículos de limpieza y abrillantamiento",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2042",
    description: "Fabricación de perfumes y cosméticos",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2051",
    description: "Fabricación de explosivos",
    agents: [
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CADMIO (inhalable)",
        context:
          "[Cancerígeno ] CADMIO (inhalable) - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CADMIO (respirable)",
        context:
          "[Cancerígeno ] CADMIO (respirable) - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2052",
    description: "Fabricación de colas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2053",
    description: "Fabricación de aceites esenciales",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "2059",
    description: "Fabricación de otros productos químicos n.c.o.p.",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2060",
    description: "Fabricación de fibras artificiales y sintéticas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2110",
    description: "Fabricación de productos farmacéuticos de base",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2120",
    description: "Fabricación de especialidades farmacéuticas",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2211",
    description: "Fabricación de neumáticos y cámaras de caucho",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2219",
    description: "Fabricación de otros productos de caucho",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2221",
    description: "Fabricación de placas, hojas, tubos y perfiles de plástico",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2222",
    description: "Fabricación de envases y embalajes de plástico",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2223",
    description: "Fabricación de productos de plástico para la construcción",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2229",
    description: "Fabricación de otros productos de plástico",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "ESTER",
        context: "[Cancerígeno ] ESTER - Carc. 1B, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2311",
    description: "Fabricación de vidrio plano",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2312",
    description: "Manipulado y transformación de vidrio plano",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2313",
    description: "Fabricación de vidrio hueco",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2314",
    description: "Fabricación de fibra de vidrio",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2319",
    description:
      "Fabricación y manipulado de otro vidrio, incluido el vidrio técnico",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2320",
    description: "Fabricación de productos cerámicos refractarios",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2331",
    description: "Fabricación de azulejos y baldosas de cerámica",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2332",
    description:
      "Fabricación de ladrillos, tejas y productos de tierras cocidas para la construcción",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2341",
    description:
      "Fabricación de artículos cerámicos de uso doméstico y ornamental",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2342",
    description: "Fabricación de aparatos sanitarios cerámicos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2344",
    description: "Fabricación de otros productos cerámicos de uso técnico",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2349",
    description: "Fabricación de otros productos cerámicos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2351",
    description: "Fabricación de cemento",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2352",
    description: "Fabricación de cal y yeso",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2361",
    description: "Fabricación de elementos de hormigón para la construcción",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2362",
    description: "Fabricación de elementos de yeso para la construcción",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2363",
    description: "Fabricación de hormigón fresco",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2364",
    description: "Fabricación de mortero",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2365",
    description: "Fabricación de fibrocemento",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2369",
    description: "Fabricación de otros productos de hormigón, yeso y cemento",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2370",
    description: "Corte, tallado y acabado de la piedra",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2391",
    description: "Fabricación de productos abrasivos",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2399",
    description:
      "Fabricación de otros productos minerales no metálicos n.c.o.p.",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "2410",
    description:
      "Fabricación de productos básicos de hierro, acero y ferroaleaciones",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2420",
    description:
      "Fabricación de tubos, tuberías, perfiles huecos y sus accesorios, de acero",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2432",
    description: "Laminación en frío",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2433",
    description: "Producción de perfiles en frío por conformación con plegado",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2434",
    description: "Trefilado en frío",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2442",
    description: "Producción de aluminio",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2444",
    description: "Producción de cobre",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2445",
    description: "Producción de otros metales no férreos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2451",
    description: "Fundición de hierro",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2452",
    description: "Fundición de acero",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2453",
    description: "Fundición de metales ligeros",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2454",
    description: "Fundición de otros metales no férreos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2511",
    description: "Fabricación de estructuras metálicas y sus componentes",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2512",
    description: "Fabricación de carpintería metálica",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2521",
    description:
      "Fabricación de radiadores y calderas para calefacción central",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2529",
    description:
      "Fabricación de otras cisternas, grandes depósitos y contenedores de metal",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2530",
    description:
      "Fabricación de generadores de vapor, excepto calderas para calefacción central",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2540",
    description: "Fabricación de armas y municiones",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2550",
    description: "Forja, estampación y embutición de metales",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2561",
    description: "Tratamiento y revestimiento de metales",
    agents: [
      {
        name: "AMIDA",
        context: "[Cancerígeno ] AMIDA - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2562",
    description: "Ingeniería mecánica por cuenta de terceros",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2571",
    description: "Fabricación de artículos de cuchillería y cubertería",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2572",
    description: "Fabricación de cerraduras y herrajes",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2573",
    description: "Fabricación de herramientas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2591",
    description: "Fabricación de bidones y toneles de hierro o acero",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2592",
    description: "Fabricación de envases y embalajes metálicos ligeros",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2593",
    description: "Fabricación de productos de alambre, cadenas y muelles",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2594",
    description: "Fabricación de pernos y productos de tornillería",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2599",
    description: "Fabricación de otros productos metálicos n.c.o.p.",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2611",
    description: "Fabricación de componentes electrónicos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2612",
    description: "Fabricación de circuitos impresos ensamblados",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2620",
    description: "Fabricación de ordenadores y equipos periféricos",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2630",
    description: "Fabricación de equipos de telecomunicaciones",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2640",
    description: "Fabricación de productos electrónicos de consumo",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2651",
    description:
      "Fabricación de instrumentos y aparatos de medida, verificación y navegación",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2660",
    description:
      "Fabricación de equipos de radiación, electromédicos y electroterapéuticos",
    agents: [
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2670",
    description: "Fabricación de instrumentos de óptica y equipo fotográfico",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2680",
    description: "Fabricación de soportes magnéticos y ópticos",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2711",
    description:
      "Fabricación de motores, generadores y transformadores eléctricos",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2712",
    description: "Fabricación de aparatos de distribución y control eléctrico",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2720",
    description: "Fabricación de pilas y acumuladores eléctricos",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2732",
    description:
      "Fabricación de otros hilos y cables electrónicos y eléctricos",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2733",
    description: "Fabricación de dispositivos de cableado",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2740",
    description: "Fabricación de lámparas y aparatos eléctricos de iluminación",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2751",
    description: "Fabricación de electrodomésticos",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2752",
    description: "Fabricación de aparatos domésticos no eléctricos",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2790",
    description: "Fabricación de otro material y equipo eléctrico",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "NIQUEL, ARSENICO",
        context: "[Cancerígeno ] NIQUEL, ARSENICO - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "2811",
    description:
      "Fabricación de motores y turbinas, excepto los destinados a aeronaves, vehículos automóviles y ciclomotores",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2812",
    description: "Fabricación de equipos de transmisión hidráulica y neumática",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2813",
    description: "Fabricación de otras bombas y compresores",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2815",
    description:
      "Fabricación de cojinetes, engranajes y órganos mecánicos de transmisión",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2821",
    description: "Fabricación de hornos y quemadores",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2822",
    description: "Fabricación de maquinaria de elevación y manipulación",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2823",
    description:
      "Fabricación de máquinas y equipos de oficina, excepto equipos informáticos",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2824",
    description: "Fabricación de herramientas eléctricas manuales",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2825",
    description:
      "Fabricación de maquinaria de ventilación y refrigeración no doméstica",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2829",
    description: "Fabricación de otra maquinaria de uso general n.c.o.p.",
    agents: [
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2830",
    description: "Fabricación de maquinaria agraria y forestal",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2841",
    description: "Fabricación de maquinas herramienta para trabajar el metal",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2849",
    description: "Fabricación de otras máquinas herramienta",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2891",
    description: "Fabricación de maquinaria para la industria metalúrgica",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2892",
    description:
      "Fabricación de maquinaria para las industrias extractivas y de la construcción",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2893",
    description:
      "Fabricación de maquinaria para la industria de la alimentación, bebidas y tabaco",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2894",
    description:
      "Fabricación de maquinaria para las industrias textil, de la confección y del cuero",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2896",
    description:
      "Fabricación de maquinaria para las industrias del plástico y del caucho",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2899",
    description:
      "Fabricación de otra maquinaria para usos específicos n.c.o.p.",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2910",
    description: "Fabricación de vehículos de motor",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2920",
    description:
      "Fabricación de carrocerías para vehículos de motor, fabricación de remolques y semirremolques",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2931",
    description:
      "Fabricación de equipos eléctricos y electrónicos para vehículos de motor",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "2932",
    description:
      "Fabricación de otros componentes, piezas y accesorios para vehículos de motor",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3011",
    description: "Construcción de barcos y estructuras flotantes",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3012",
    description: "Construcción de embarcaciones de recreo y deporte",
    agents: [
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3020",
    description: "Fabricación de locomotoras y material ferroviario",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3030",
    description: "Construcción aeronáutica y espacial y su maquinaria",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3091",
    description: "Fabricación de motocicletas",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3099",
    description: "Fabricación de otro material de transporte n.c.o.p.",
    agents: [
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3101",
    description:
      "Fabricación de muebles de oficina y de establecimientos comerciales",
    agents: [
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "3102",
    description: "Fabricación de muebles de cocina",
    agents: [
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "3103",
    description: "Fabricación de colchones",
    agents: [
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "3109",
    description: "Fabricación de otros muebles",
    agents: [
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "3211",
    description: "Fabricación de monedas",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "3212",
    description: "Fabricación de artículos de joyería y artículos similares",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "3213",
    description: "Fabricación de artículos de bisutería y artículos similares",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "3230",
    description: "Fabricación de artículos de deporte",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
    ],
  },
  {
    code: "3250",
    description:
      "Fabricación de instrumentos y suministros médicos y odontológicos",
    agents: [
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "3299",
    description: "Otras industrias manufactureras n.c.o.p.",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "3311",
    description: "Reparación de productos metálicos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3312",
    description: "Reparación de maquinaria",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3313",
    description: "Reparación de equipos electrónicos y ópticos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3314",
    description: "Reparación de equipos eléctricos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3315",
    description: "Reparación y mantenimiento naval",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CADMIO",
        context: "[Cancerígeno ] CADMIO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3316",
    description: "Reparación y mantenimiento aeronáutico y espacial",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3317",
    description: "Reparación y mantenimiento de otro material de transporte",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3319",
    description: "Reparación de otros equipos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3320",
    description: "Instalación de máquinas y equipos industriales",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3515",
    description: "Producción de energía hidroeléctrica",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3516",
    description:
      "Producción de energía eléctrica de origen térmico convencional",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3517",
    description: "Producción de energía eléctrica de origen nuclear",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3518",
    description: "Producción de energía eléctrica de origen eólico",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3519",
    description: "Producción de energía eléctrica de otros tipos",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3522",
    description: "Distribución por tubería de combustibles gaseosos",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "3523",
    description: "Comercio de gas por tubería",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "3530",
    description: "Suministro de vapor y aire acondicionado",
    agents: [
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
    ],
  },
  {
    code: "3600",
    description: "Captación, depuración y distribución de agua",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
    ],
  },
  {
    code: "3700",
    description: "Recogida y tratamiento de aguas residuales",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
    ],
  },
  {
    code: "3811",
    description: "Recogida de residuos no peligrosos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3812",
    description: "Recogida de residuos peligrosos",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3821",
    description: "Tratamiento y eliminación de residuos no peligrosos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3822",
    description: "Tratamiento y eliminación de residuos peligrosos",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3831",
    description: "Separación y clasificación de materiales",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3832",
    description: "Valorización de materiales ya clasificados",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "3900",
    description:
      "Actividades de descontaminación y otros servicios de gestión de residuos",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "4122",
    description: "Construcción de edificios no residenciales",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4211",
    description: "Construcción de carreteras y autopistas",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4212",
    description: "Construcción de vías férreas de superficie y subterráneas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4213",
    description: "Construcción de puentes y túneles",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4221",
    description: "Construcción de redes para fluidos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4222",
    description: "Construcción de redes eléctricas y de telecomunicaciones",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4291",
    description: "Obras hidráulicas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4299",
    description: "Construcción de otros proyectos de ingeniería civil n.c.o.p.",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4311",
    description: "Demolición",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4312",
    description: "Preparación de terrenos",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4313",
    description: "Perforaciones y sondeos",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4321",
    description: "Instalaciones eléctricas",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4322",
    description:
      "Fontanería, instalaciones de sistemas de calefacción y aire acondicionado",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4329",
    description: "Otras instalaciones en obras de construcción",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4331",
    description: "Revocamiento",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4333",
    description: "Revestimiento de suelos y paredes",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "MADERA DURA",
        context: "[Cancerígeno ] MADERA DURA",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4334",
    description: "Pintura y acristalamiento",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4339",
    description: "Otro acabado de edificios",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4391",
    description: "Construcción de cubiertas",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4399",
    description: "Otras actividades de construcción especializada n.c.o.p.",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4511",
    description: "Venta de automóviles y vehículos de motor ligeros",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "4519",
    description: "Venta de otros vehículos de motor",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "4520",
    description: "Mantenimiento y reparación de vehículos de motor",
    agents: [
      {
        name: "AMIANTO",
        context: "[Cancerígeno ] AMIANTO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "4672",
    description:
      "Comercio al por mayor de repuestos y accesorios de vehículos de motor",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "4532",
    description:
      "Comercio al por menor de repuestos y accesorios de vehículos de motor",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "4540",
    description:
      "Venta, mantenimiento y reparación de motocicletas y de sus repuestos y accesorios",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "4611",
    description:
      "Intermediarios del comercio de materias primas agrarias, animales vivos, materias primas textiles y productos semielaborados",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4612",
    description:
      "Intermediarios del comercio de combustibles, minerales, metales y productos químicos industriales",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4613",
    description:
      "Intermediarios del comercio de la madera y materiales de construcción",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4616",
    description:
      "Intermediarios del comercio de textiles, prendas de vestir, peletería, calzado y artículos de cuero",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4641",
    description: "Comercio al por mayor de textiles",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4644",
    description:
      "Comercio al por mayor de porcelana, cristalería y artículos de limpieza",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4648",
    description: "Comercio al por mayor de artículos de relojería y joyería",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4652",
    description:
      "Comercio al por mayor de equipos electrónicos y de telecomunicaciones y sus componentes",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4664",
    description:
      "Comercio al por mayor de maquinaria para la industria textil y de máquinas de coser y tricotar",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4777",
    description:
      "Comercio al por menor de artículos de relojería y joyería en establecimientos especializados",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "4941",
    description: "Transporte de mercancías por carretera",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "5223",
    description: "Actividades anexas al transporte aéreo",
    agents: [
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "7120",
    description: "Ensayos y análisis técnicos",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BUTADIENO",
        context: "[Cancerígeno ] BUTADIENO - Carc. 1A, Muta. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "7211",
    description: "Investigación y desarrollo experimental en biotecnología",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "FITOSANITARIO",
        context: "[Cancerígeno ] FITOSANITARIO - Carc. 1A, Muta. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "7219",
    description:
      "Otra investigación y desarrollo experimental en ciencias naturales y técnicas",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "7220",
    description:
      "Investigación y desarrollo experimental en ciencias sociales y humanidades",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "7500",
    description: "Actividades veterinarias",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "BENCENO",
        context: "[Cancerígeno ] BENCENO - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "8121",
    description: "Limpieza general de edificios",
    agents: [
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "8122",
    description: "Otras actividades de limpieza industrial y de edificios",
    agents: [
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "8129",
    description: "Otras actividades de limpieza",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "8130",
    description: "Actividades de jardinería",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "COBALTO",
        context: "[Cancerígeno ] COBALTO - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "POLVO TOTAL",
        context: "[Cancerígeno ] POLVO TOTAL - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (Inhalable)",
        context: "[Cancerígeno ] POLVO TOTAL (Inhalable) - Carc. 1B, Muta. 2",
      },
      {
        name: "POLVO TOTAL (respirable)",
        context: "[Cancerígeno ] POLVO TOTAL (respirable) - Carc. 1B, Muta. 2",
      },
      {
        name: "Sulfato de Dimetilo",
        context: "[Cancerígeno ] Sulfato de Dimetilo - Carc. 1B, Muta. 2",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "8424",
    description: "Orden público y seguridad",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "8425",
    description: "Protección civil",
    agents: [
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "8551",
    description: "Educación deportiva y recreativa",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "8610",
    description: "Actividades hospitalarias",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "FORMALDEHIDO",
        context: "[Cancerígeno ] FORMALDEHIDO - Carc. 1B, Muta. 2",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "8621",
    description: "Actividades de medicina general",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "8622",
    description: "Actividades de medicina especializada",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "8623",
    description: "Actividades odontológicas",
    agents: [
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "BERILIO",
        context: "[Cancerígeno ] BERILIO - Carc. 1B",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "8690",
    description: "Otras actividades sanitarias",
    agents: [
      {
        name: "ARSENICO",
        context: "[Cancerígeno ] ARSENICO - Carc. 1A",
      },
      {
        name: "CROMO VI",
        context: "[Cancerígeno ] CROMO VI - Carc. 1B, Muta. 1B, Repr. 1A",
      },
      {
        name: "EPOXI",
        context: "[Cancerígeno ] EPOXI - Carc. 1B, Muta. 2, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "9511",
    description: "Reparación de ordenadores y equipos periféricos",
    agents: [
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
  {
    code: "9521",
    description:
      "Reparación de aparatos electrónicos de audio y vídeo de uso doméstico",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "9524",
    description: "Reparación de muebles y artículos de menaje",
    agents: [
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
    ],
  },
  {
    code: "9525",
    description: "Reparación de relojes y joyería",
    agents: [
      {
        name: "SILICE",
        context: "[Cancerígeno ] SILICE - Carc. 1A",
      },
    ],
  },
  {
    code: "9601",
    description: "Lavado y limpieza de prendas textiles y de piel",
    agents: [
      {
        name: "TRICLOROETILENO",
        context: "[Cancerígeno ] TRICLOROETILENO - Carc. 1B, Muta. 2",
      },
    ],
  },
  {
    code: "9602",
    description: "Peluquería y otros tratamientos de belleza",
    agents: [
      {
        name: "AMINA",
        context: "[Cancerígeno ] AMINA - Carc. 1A, Muta. 1B, Repr. 1B",
      },
      {
        name: "HIDROC AROMATICOS",
        context:
          "[Cancerígeno ] HIDROC AROMATICOS - Carc. 1B, Muta. 1B, Repr. 1B",
      },
      {
        name: "NIQUEL",
        context: "[Cancerígeno ] NIQUEL - Carc. 1A, Muta. 2, Repr. 1B",
      },
      {
        name: "VAPOR ORGANICO",
        context: "[Cancerígeno ] VAPOR ORGANICO - Carc. 1B, Muta. 1B, Repr. 1B",
      },
    ],
  },
];
