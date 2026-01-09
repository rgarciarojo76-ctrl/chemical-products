export type TrafficLightStatus = 'safe' | 'warning' | 'danger';

export interface LegalReference {
    article: string; // e.g., "Art. 4.1 RD 665/1997"
    text: string;
}

export interface Justification {
    technical: string;
    legal: LegalReference;
}

// Module A: Hazard ID
export type HPhrase = 'H340' | 'H350' | 'H350i' | 'H360' | 'H360D' | 'H360F' | 'H360FD' | 'H360Fd' | 'H360Df';

export interface HazardInput {
    substanceName: string;
    casNumber?: string;
    hPhrases: HPhrase[];
    isMixture: boolean;
    concentration?: number; // percentage
    extraDetails?: string; // For listing multiple components found
    detectedPhysicalForm?: 'solid_massive' | 'solid_dust' | 'liquid_high_volatility' | 'liquid_low_volatility' | 'gas';
    origin?: 'raw_material' | 'byproduct' | 'external' | 'storage';
    vlaInfo?: { // From INSST
        vlaVal: number;
        suggestedLod: number;
        unit: string;
        sampling?: {
            method: string;
            support: string;
            technique: string;
            flowRate: string;
            minTime: string;
        };
    };
}

export interface HazardAssessment {
    isHazardous: boolean;
    requiresZeroExposure: boolean; // Precautionary principle for low concentrations
    justifications: Justification[];
}

// Module B: Exposure Sieve (Qualitative)
export interface ExposureSieveInput {
    physicalForm: 'solid_massive' | 'solid_dust' | 'liquid_high_volatility' | 'liquid_low_volatility' | 'gas';
    hasContact: boolean;
}

export interface ExposureSieveAssessment {
    isRelevant: boolean;
    justification: Justification;
}

// Module C: Hygienic Evaluation (Quantitative)
export interface HygienicEvalInput {
    labResult?: number; // mg/m3
    lod?: number; // Limit of Detection
    vla?: number; // Reference Limit (VLA-ED)
    samplingDetails?: { // Auto-filled strategy
        support: string;
        technique: string;
        flowRate: string;
        minTime: string;
    };
    strategyType?: 'continuous' | 'peaks' | 'variable';
}

export interface HygienicAssessment {
    isSafe: boolean; // True if Result < VLA or Result < LOD
    complianceRatio?: number; // Result / VLA
    strategyRecommendation?: string;
    justification: Justification;
}

// Module C: Hierarchy
// Module C: Hierarchy
export type HierarchyLevel =
    | 'substitution' // Art 4
    | 'closed_system' // Art 5.2
    | 'technical_reduction' // Art 5.3 (a, c, d, e)
    | 'organizational' // Art 5.3 (b, g, h, i, j, k, l)
    | 'ppe'; // Art 5.3 (f) - LAST RESORT

export interface MeasureDefinition {
    id: string;
    level: HierarchyLevel;
    text: string;
    article: string;
}

export interface MeasureStatus {
    measureId: string;
    implemented: boolean;
    justificationIfNo: string; // Mandatory if implemented === false
}

// Module D: Toxicology
export type SCOELGroup = 'A' | 'B' | 'C' | 'D';

// The Global State
export interface AssessmentState {
    step: number;
    hazard: {
        input: HazardInput;
        result: HazardAssessment | null;
    };
    exposureSieve: {
        input: ExposureSieveInput;
        result: ExposureSieveAssessment | null;
    };
    hygienicEval: {
        input: HygienicEvalInput;
        result: HygienicAssessment | null;
    };
    measures: MeasureStatus[];
    hygieneRights: {
        eligible: boolean;
        timeAllowance: number; // minutes
    };
}
