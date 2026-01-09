import { useState } from 'react';
import type { AssessmentState, HazardInput, ExposureInput } from '../types';
import { evaluateHazard, evaluateExposure } from '../utils/engineLogic';

const INITIAL_STATE: AssessmentState = {
    step: 1,
    hazard: {
        input: {
            substanceName: '',
            hPhrases: [],
            isMixture: false
        }, result: null
    },
    exposure: {
        input: {
            physicalForm: 'liquid_low_volatility',
            hasContact: false,
        }, result: null
    },
    measures: [],
    hygieneRights: { eligible: false, timeAllowance: 0 }
};

export function useDecisionEngine() {
    const [state, setState] = useState<AssessmentState>(INITIAL_STATE);

    const runHazardAssessment = (input: HazardInput) => {
        const result = evaluateHazard(input);

        // Auto-propagate detected physical form AND VLA/LOD to Exposure Module if found
        let exposureUpdate = {};
        if (input.detectedPhysicalForm || input.vlaInfo) {
            exposureUpdate = {
                exposure: {
                    ...state.exposure,
                    input: {
                        ...state.exposure.input,
                        physicalForm: input.detectedPhysicalForm || state.exposure.input.physicalForm,
                        lod: input.vlaInfo?.suggestedLod || state.exposure.input.lod,
                        vla: input.vlaInfo?.vlaVal || state.exposure.input.vla,
                        samplingDetails: input.vlaInfo?.sampling ? {
                            support: input.vlaInfo.sampling.support,
                            technique: input.vlaInfo.sampling.technique,
                            flowRate: input.vlaInfo.sampling.flowRate,
                            minTime: input.vlaInfo.sampling.minTime
                        } : undefined
                    }
                }
            };
        }

        setState(prev => ({
            ...prev,
            hazard: { input, result },
            ...exposureUpdate
        }));
        return result;
    };

    const runExposureAssessment = (input: ExposureInput) => {
        const result = evaluateExposure(input);
        setState(prev => ({
            ...prev,
            exposure: { input, result }
        }));
        return result;
    };

    const updateMeasures = (measures: import('../types').MeasureStatus[]) => {
        setState(prev => ({
            ...prev,
            measures
        }));
    };

    const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));


    const reset = () => setState(INITIAL_STATE);

    return {
        state,
        runHazardAssessment,
        runExposureAssessment,
        updateMeasures,
        nextStep,
        reset
    };
}
