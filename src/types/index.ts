export type TrafficLightStatus = "safe" | "warning" | "danger";

export interface LegalReference {
  article: string; // e.g., "Art. 4.1 RD 665/1997"
  text: string;
}

export interface Justification {
  technical: string;
  legal: LegalReference;
}

// Module A: Hazard ID
export type HPhrase =
  | "H340"
  | "H350"
  | "H350i"
  | "H360"
  | "H360D"
  | "H360F"
  | "H360FD"
  | "H360Fd"
  | "H360Df";

export interface HazardInput {
  substanceName: string;
  casNumber?: string;
  ecNumber?: string; // European Community number
  vapourPressure?: number; // Pa
  boilingPoint?: number; // Celsius
  density?: number; // g/cm3 or relative
  ppeText?: string; // Extracted text about PPE
  hPhrases: HPhrase[];
  isMixture: boolean;
  concentration?: number; // percentage
  extraDetails?: string; // For listing multiple components found
  detectedPhysicalForm?:
    | "solid_massive"
    | "solid_dust"
    | "liquid_high_volatility"
    | "liquid_low_volatility"
    | "gas";
  origin?: "raw_material" | "byproduct" | "external" | "storage";
  vlaInfo?: {
    // From INSST
    vlaVal: number;
    suggestedLod: number;
    unit: string;
    sampling?: {
      method: string;
      support: string;
      technique: string;
      flowRate: string;
      minTime: string;
      methodUrl?: string;
      videoUrl?: string;
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
  physicalForm:
    | "solid_massive"
    | "solid_dust"
    | "liquid_high_volatility"
    | "liquid_low_volatility"
    | "gas";
  hasContact: boolean;
}

export interface ExposureSieveAssessment {
  isRelevant: boolean;
  justification: Justification;
}

// Module C: Hygienic Evaluation (Quantitative)

export interface StoffenmanagerInput {
  // Phase 1: Identification
  productName: string;
  manufacturer: string;
  casNumber?: string;
  hasFDS: boolean;
  physicalState: "liquid" | "solid";

  // Phase 2: Hazard
  hPhrases: string[];
  isDiluted: boolean;
  dilutionPercent?: number;

  // Phase 3: Emission
  vapourPressure?: number; // Pa (Liquids)
  dustiness?:
    | "solid_objects"
    | "granules_firm"
    | "granules_friable"
    | "dust_coarse"
    | "dust_fine"
    | "dust_extreme"; // (Solids)

  // Phase 4: Handling (Task)
  handlingType: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

  // Phase 5: Control
  localControl:
    | "containment_extraction"
    | "containment_no_extract"
    | "local_extraction"
    | "suppression"
    | "none";
  roomVolume: "lt_100" | "100_1000" | "gt_1000" | "outdoor";
  ventilationType: "none" | "natural" | "mechanical" | "booth";
  dailyCleaning: boolean;
  equipmentMaintenance: boolean;

  // Phase 6: Immission & Time
  workerSegregation: "isolated" | "cabin" | "none";
  ppeUsed: boolean;
  ppeType?: string;
  exposureDuration: "min_15" | "min_30" | "hour_2" | "hour_4" | "hour_8";
  exposureFrequency:
    | "year_1"
    | "month_1"
    | "week_bi"
    | "week_1"
    | "week_2_3"
    | "week_4_5"
    | "day_1";

  // Optional: for Quantitative flow
  measurementStrategy?: MeasurementStrategy;
  measurementResult?: MeasurementResult;
}

export interface MeasurementStrategy {
  vlaType: "ED" | "EC";
  vlaValue: number; // mg/m3 or ppm
  samplingSupport: "personal" | "static";
  technique: string; // e.g. "UNE-EN 689"
  labAnalysis: string;
  flowRate?: number;
  minVolume?: number;
}

export interface MeasurementResult {
  concentration: number;
  complianceIndex: number; // I = C/VLA
  isCompliant: boolean;
  nextCheckDate: string;
}

export interface StoffenmanagerResult {
  hazardBand: "A" | "B" | "C" | "D" | "E";
  exposureScore: number; // Bt
  exposureBand: 1 | 2 | 3 | 4;
  riskPriority: "I" | "II" | "III";

  // New Fields for Quantitative Flow
  measurementStrategy?: MeasurementStrategy;
  measurementResult?: MeasurementResult;
}

export interface BasicCharacterizationInput {
  // A. Process
  processDescription: string;
  isOpenProcess: boolean;

  // B. Measures (Hierarchy)
  technicalMeasure:
    | "closed_system"
    | "containment_extraction"
    | "local_extraction"
    | "suppression"
    | "general_ventilation"
    | "none";
  measureJustification?: string; // If < Closed System for Cancer 1A/1B

  // C. Environment
  cleaningMethod: "hepa_wet" | "sweeping" | "none";

  // D. Organization
  accessRestricted: boolean;
  signageGHS08: boolean;

  // E. Personal
  respiratoryPPE: string; // Free text or enum later
  dermalPPE: string;
  hygieneRights: boolean; // 10 min

  // F. Time
  frequency: "daily" | "weekly" | "sporadic";
  duration: "lt_15m" | "15m_2h" | "2h_4h" | "gt_4h";

  // Narrative
  autoNarrative?: string;
  complianceResult?: "green" | "red" | "unknown";

  // Observations (Issue #1 & #2: editable field for technician notes)
  observations?: string;
}

// Module 3.1.2: GES
export interface GesData {
  gesId: string;
  workerCount: number;
  samplingStrategy: {
    minSamples: number;
    rule: string;
  };
  justification: string;
}

export interface HygienicEvalInput {
  evaluationMethod?: "simplified" | "advanced";
  basicCharacterization?: BasicCharacterizationInput;
  ges?: GesData;
  labResult?: number; // mg/m3
  lod?: number; // Limit of Detection
  vla?: number; // Reference Limit (VLA-ED)
  samplingDetails?: {
    // Auto-filled strategy
    support: string;
    technique: string;
    flowRate: string;
    minTime: string;
    methodUrl?: string;
    videoUrl?: string;
  };
  strategyType?: "continuous" | "peaks" | "variable";
  stoffenmanager?: StoffenmanagerInput;
  en689Result?: En689Result; // Final results from Module 4
  closedSystem?: ClosedSystemAnalysis; // Module 5.2
}

export interface HygienicAssessment {
  isSafe: boolean; // True if Result < VLA or Result < LOD
  complianceRatio?: number; // Result / VLA
  strategyRecommendation?: string;
  justification: Justification;
  stoffenmanagerResult?: StoffenmanagerResult;
}

// Module C: Hierarchy
// Module C: Hierarchy
export type HierarchyLevel =
  | "substitution" // Art 4
  | "closed_system" // Art 5.2
  | "technical_reduction" // Art 5.3 (a, c, d, e)
  | "organizational" // Art 5.3 (b, g, h, i, j, k, l)
  | "ppe"; // Art 5.3 (f) - LAST RESORT

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
export type SCOELGroup = "A" | "B" | "C" | "D";

// The Global State
// Module 4: Measurement Results (UNE-EN 689)
export interface Sample {
  id: string;
  type: "direct" | "lab_calc";
  value: number; // Final concentration (mg/m3 or ppm)
  raw?: {
    mass: number; // ug
    flow: number; // l/min
    time: number; // min
  };
  isBelowLod: boolean;
  lodMultiplier?: 0.5 | 1; // Factor for calculating value if < LOD
  date?: string;
  comments?: string;
}

export interface En689Result {
  decision: "compliant" | "non_compliant" | "need_more_samples";
  ruleApplied: "screening" | "statistical_utl" | "statistical_fail";
  stats?: {
    gm: number; // Geometric Mean
    gsd: number; // Geometric Standard Deviation
    p95: number; // 95th Percentile
    ur: number; // Upper Range (UCL of P95, 70% Confidence)
    complianceIndex: number; // ur / vla
  };
  nextCheck: string; // "12 months", "36 months" or specific date
  samples: Sample[];
  vlaApplied: number;
  qualityAlerts: string[]; // e.g. "GSD > 3: Variabilidad excesiva"
}

// Module 5 (Hierarchy): Closed System (Art 5.2)
export interface PhaseAnalysis {
  id: "A" | "B" | "C" | "D";
  name: string;
  isViable: boolean; // YES = Can effect change (show calc) / NO = Impossible (show reasons)
  reasons?: string[]; // If NO
  comments?: string;
  // Cost Inputs (If YES)
  costInputs?: {
    units?: number; // Points or Lines
    volume?: number; // m3
  };
}

export interface SystemCostEstimate {
  totalCost: number;
  currency: "EUR";
  materialFactor: 1.0 | 1.4;
  breakdown: {
    loadingCost: number; // Phase A
    processCost: number; // Phase B
    emptyingCost: number; // Phase C
  };
}

export interface ClosedSystemAnalysis {
  isClosedSystem: boolean; // D.2 Answer
  phases: {
    loading: PhaseAnalysis;
    process: PhaseAnalysis;
    emptying: PhaseAnalysis;
    maintenance: PhaseAnalysis;
  };
  financials?: SystemCostEstimate;
  outputDoc: "exemption_justification" | "investment_plan";
}

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
    en689Result?: En689Result; // New field for Module 4
  };
  measures: MeasureStatus[];
  hygieneRights: {
    eligible: boolean;
    timeAllowance: number; // minutes
  };
}
