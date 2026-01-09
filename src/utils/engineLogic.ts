import type { HazardInput, HazardAssessment, HPhrase, ExposureSieveInput, ExposureSieveAssessment, HygienicEvalInput, HygienicAssessment, MeasureDefinition } from '../types';

export const RD_MEASURES: MeasureDefinition[] = [
    {
        id: 'substitution',
        level: 'substitution',
        text: '¿Se ha sustituido técnicamente el agente por otro no peligroso o de menor riesgo?',
        article: 'Art. 4.1 RD 665/1997'
    },
    {
        id: 'closed_system',
        level: 'closed_system',
        text: '¿Se utiliza el agente en un sistema cerrado?',
        article: 'Art. 5.2 RD 665/1997'
    },
    {
        id: 'reduction_quantity',
        level: 'technical_reduction',
        text: '¿Se ha limitado la cantidad del agente al mínimo necesario?',
        article: 'Art. 5.3.a RD 665/1997'
    },
    {
        id: 'reduction_workers',
        level: 'organizational',
        text: '¿Se ha limitado al mínimo posible el número de trabajadores expuestos?',
        article: 'Art. 5.3.b RD 665/1997'
    },
    {
        id: 'extraction',
        level: 'technical_reduction',
        text: '¿Se ha diseñado el proceso para evitar la liberación (extracción localizada)?',
        article: 'Art. 5.3.c RD 665/1997'
    },
    {
        id: 'monitoring',
        level: 'organizational',
        text: '¿Se utilizan métodos de medición adecuados para detectar anomalías?',
        article: 'Art. 5.3.d RD 665/1997'
    },
    {
        id: 'hygiene',
        level: 'organizational',
        text: '¿Se aplican medidas de higiene (limpieza regular de suelos, paredes, etc.)?',
        article: 'Art. 5.3.g RD 665/1997'
    },
    {
        id: 'demarcation',
        level: 'organizational',
        text: '¿Están delimitadas y señalizadas las zonas de riesgo (Prohibido paso, No fumar)?',
        article: 'Art. 5.3.h RD 665/1997'
    },
    {
        id: 'emergency',
        level: 'organizational',
        text: '¿Existen planes para casos de emergencia o exposición anormal?',
        article: 'Art. 5.3.i RD 665/1997'
    },
    {
        id: 'ppe',
        level: 'ppe',
        text: '¿Se utilizan equipos de protección individual (EPI) adecuados?',
        article: 'Art. 5.3.f RD 665/1997'
    }
];

export const CMR_PHRASES: HPhrase[] = [
    'H340', 'H350', 'H350i', 'H360', 'H360D', 'H360F', 'H360FD', 'H360Fd', 'H360Df'
];

export function evaluateHazard(input: HazardInput): HazardAssessment {
    const justifications: import('../types').Justification[] = [];
    let isHazardous = false;
    let requiresZeroExposure = false;

    // 1. Check for CMR Phrases
    const hasCMRPhrase = input.hPhrases.some(h => CMR_PHRASES.includes(h));

    if (hasCMRPhrase) {
        isHazardous = true;
        requiresZeroExposure = true;
        justifications.push({
            technical: `Frase de riesgo identificada ${input.hPhrases.join(', ')}.`,
            legal: {
                article: "Art. 2 del RD 665/1997",
                text: "Es de aplicación obligatoria el Real Decreto sobre agentes cancerígenos."
            }
        });
    } else {
        // If NO phrases, we might usually stop, but let's check concentration/mixture too just in case 
        // (though usually if you have no phrases, you are safe unless we want to catch "hidden" risks)
        // For this logic, if no phrase, we generally say it's not hazardous UNLESS precuationary.
    }

    // 2. Check Mixtures and Concentration (Independent check as requested)
    if (input.isMixture && input.concentration !== undefined) {
        const threshold = 0.1; // Strict 0.1% for C/M

        if (input.concentration >= threshold) {
            // Only add this specific justification if we haven't already said it's hazardous OR if we want to add EXTRA detail
            // User asked: "si se supera... mostrarse las dos conclusiones"
            // So if it has phrases AND conc > 0.1, show THIS TOO.

            // If we already marked as hazardous (due to phrase), we just add to array.
            // If we didn't (e.g. user submitted mixture WITHOUT selecting phrases manually but entered concentration?), 
            // well, usually checking phrases is the source of truth, but maybe they manually entered a conc?
            // Let's assume this adds to the evidence.

            isHazardous = true;
            requiresZeroExposure = true;
            justifications.push({
                technical: `La concentración (${input.concentration}%) supera o iguala el límite genérico del ${threshold}% para mezclas.`,
                legal: {
                    article: "Reglamento (CE) 1272/2008 (CLP)",
                    text: "Clasificación obligatoria como mezcla peligrosa CMR Cat 1."
                }
            });

        } else if (input.concentration < threshold) {
            // Below threshold
            if (!isHazardous) {
                // Only relevant if not already hazardous by direct phrase assignment
                requiresZeroExposure = true; // Precautionary
                justifications.push({
                    technical: `La concentración (${input.concentration}%) es inferior al límite legal (${threshold}%), pero se detectan trazas.`,
                    legal: {
                        article: "Principio de Precaución (Art. 15 LPRL)",
                        text: "Se recomienda evaluar bajo el principio de 'Exposición Cero' por medidas preventivas."
                    }
                });
            }
        }
    }

    // Fallback if nothing found
    if (justifications.length === 0) {
        return {
            isHazardous: false,
            requiresZeroExposure: false,
            justifications: [{
                technical: "El agente no presenta frases H relacionadas con carcinogenicidad, mutagenicidad o toxicidad para la reproducción.",
                legal: {
                    article: "Reglamento (CE) 1272/2008 (CLP)",
                    text: "No clasificado como CMR Cat 1A o 1B."
                }
            }]
        };
    }

    return {
        isHazardous,
        requiresZeroExposure,
        justifications
    };
}

export function evaluateExposureSieve(input: ExposureSieveInput): ExposureSieveAssessment {
    // 1. Physical Form Sieve
    if (input.physicalForm === 'solid_massive' && !input.hasContact) {
        return {
            isRelevant: false,
            justification: {
                technical: "El agente se presenta como sólido masivo/aleación sin tareas de corte o soldadura (sin emisión de humo/polvo).",
                legal: {
                    article: "Art. 2 RD 665/1997 (Interpretación técnica)",
                    text: "No existe vía de entrada respiratoria ni dérmica sin transferencia efectiva."
                }
            }
        };
    }

    // Default: Exposure is Relevant (Proceed to Mod C)
    return {
        isRelevant: true,
        justification: {
            technical: "Existe presencia del agente y vía de transmisión posible (sólido pulvurulento, líquido o gas).",
            legal: {
                article: "Art. 3 RD 665/1997",
                text: "Se requiere evaluación higiénica detallada para determinar el riesgo."
            }
        }
    };
}

export function evaluateHygienicExposure(input: HygienicEvalInput): HygienicAssessment {
    // 1. Check absence (Result < LOD)
    if (input.labResult !== undefined && input.lod !== undefined) {
        if (input.labResult < input.lod) {
            return {
                isSafe: true,
                justification: {
                    technical: `Resultado analítico (${input.labResult}) inferior al Límite de Detección (${input.lod}).`,
                    legal: {
                        article: "Guía Técnica INSST",
                        text: "Se considera ausencia de exposición efectiva al no detectarse el agente."
                    }
                }
            };
        }
    }

    // 2. Check VLA Compliance
    if (input.labResult !== undefined && input.vla !== undefined) {
        const ratio = input.labResult / input.vla;
        if (ratio <= 1) {
            return {
                isSafe: true,
                complianceRatio: ratio,
                justification: {
                    technical: `El nivel detectado (${input.labResult}) es inferior al VLA-ED (${input.vla}). Indice: ${ratio.toFixed(2)}.`,
                    legal: {
                        article: "Art. 6 RD 665/1997",
                        text: "Situación controlada higiénicamente. Mantener condiciones."
                    }
                }
            };
        } else {
            return {
                isSafe: false,
                complianceRatio: ratio,
                justification: {
                    technical: `¡ATENCIÓN! El nivel detectado (${input.labResult}) SUPERA el VLA-ED (${input.vla}). Indice: ${ratio.toFixed(2)}.`,
                    legal: {
                        article: "Art. 5 RD 665/1997",
                        text: "Situación inaceptable. Se requieren medidas inmediatas de reducción."
                    }
                }
            };
        }
    }

    // If no data provided yet
    return {
        isSafe: false,
        justification: {
            technical: "Pendiente de datos analíticos.",
            legal: { article: "", text: "" }
        }
    };
}
