export interface ChemicalData {
    name: string;
    cas: string;
    vla: {
        ed_mg: number; // Exposición Diaria mg/m3
        ed_ppm?: number;
        ec_mg?: number; // Corta Exposición mg/m3
        ec_ppm?: number;
    };
    suggestedLod: number; // Typically 10% of VLA-ED
    sampling: {
        method: string; // e.g., MTA/MA-062/A16
        support: string; // e.g., Silica Gel DNPH
        technique: string; // e.g., HPLC-UV
        flowRate: string; // e.g., 0.2 L/min
        minTime: string; // e.g., 120 min
        methodUrl?: string; // Link to INSST PDF
        videoUrl?: string; // Link to APA Video
    };
    notes: string;
}

export const INSST_DATABASE: Record<string, ChemicalData> = {
    'Formaldehído': {
        name: 'Formaldehído',
        cas: '50-00-0',
        vla: {
            ed_mg: 0.37,
            ed_ppm: 0.3,
            ec_mg: 0.74,
            ec_ppm: 0.6
        },
        suggestedLod: 0.037, // 10% of 0.37
        sampling: {
            method: 'MTA/MA-062/A23',
            support: 'Tubo Silica Gel + 2,4-DNPH',
            technique: 'HPLC-UV',
            flowRate: '0.2 L/min',
            minTime: '15 min (Corta) - 120 min (Diaria)',
            methodUrl: 'https://www.insst.es/documents/94886/359043/MA_062_A23.pdf',
            videoUrl: 'https://youtu.be/ulD_fwpP2YU'
        },
        notes: 'Sen, C1B. VLA-EC aplicable.'
    },
    'Benceno': {
        name: 'Benceno',
        cas: '71-43-2',
        vla: {
            ed_mg: 0.66,
            ed_ppm: 0.2
        },
        suggestedLod: 0.066,
        sampling: {
            method: 'MTA/MA-030/A92',
            support: 'Tubo Carbón Activo (100/50 mg)',
            technique: 'Cromatografía de Gases (GC-FID)',
            flowRate: '0.2 L/min',
            minTime: '120 min',
            videoUrl: 'https://youtu.be/ulD_fwpP2YU'
        },
        notes: 'Vía dérmica, C1A, M1B.'
    },
    'Sílice Cristalina': {
        name: 'Sílice Cristalina (Fracción Respirable)',
        cas: '14808-60-7',
        vla: {
            ed_mg: 0.05
        },
        suggestedLod: 0.005,
        sampling: {
            method: 'MTA/MA-057/A04',
            support: 'Bomba + Ciclón + Filtro PVC 5µm',
            technique: 'Difracción Rayos X (DRX) o IR',
            flowRate: '2.5 L/min (según ciclón)',
            minTime: 'Jornada Completa (>80%)',
            videoUrl: 'https://youtu.be/RH2Nl4Yfhvg'
        },
        notes: 'Cancerígeno (C1A). Norma UNE EN 481.'
    },
    'Dicromato de Potasio': {
        name: 'Dicromato de Potasio',
        cas: '7778-50-9',
        vla: {
            ed_mg: 0.01
        },
        suggestedLod: 0.001,
        sampling: {
            method: 'MTA/MA-032/A95 (Cr VI)',
            support: 'Filtro PVC (5µm) o MCE',
            technique: 'Espectrofotometría UV-Vis (colorimetría)',
            flowRate: '1 - 2 L/min',
            minTime: '60 - 120 min'
        },
        notes: 'C1B, M1B, R1B'
    },
    'Óxido de Etileno': {
        name: 'Óxido de Etileno',
        cas: '75-21-8',
        vla: {
            ed_mg: 1.8,
            ed_ppm: 1
        },
        suggestedLod: 0.18,
        sampling: {
            method: 'MTA/MA-038/A96',
            support: 'Tubo Carbón Activo',
            technique: 'Cromatografía Gases (GC)',
            flowRate: '0.1 - 0.2 L/min',
            minTime: '120 min',
            videoUrl: 'https://youtu.be/ulD_fwpP2YU'
        },
        notes: 'C1B, M1B'
    }
};

export function lookupChemical(nameRaw: string): ChemicalData | null {
    // Fuzzy search or simple normalize
    const target = nameRaw.toLowerCase();

    if (target.includes('formaldeh')) return INSST_DATABASE['Formaldehído'];
    if (target.includes('benceno')) return INSST_DATABASE['Benceno'];
    if (target.includes('silice') || target.includes('sílice')) return INSST_DATABASE['Sílice Cristalina'];
    if (target.includes('dicromato')) return INSST_DATABASE['Dicromato de Potasio'];
    if (target.includes('etilen') || target.includes('oxido')) return INSST_DATABASE['Óxido de Etileno'];

    return null;
}
