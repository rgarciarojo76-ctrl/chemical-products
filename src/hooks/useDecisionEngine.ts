import { useState } from 'react';
import type { AssessmentState, HazardInput, ExposureSieveInput, HygienicEvalInput } from '../types';
import { evaluateHazard, evaluateExposureSieve, evaluateHygienicExposure } from '../utils/engineLogic';

const INITIAL_STATE: AssessmentState = {
    step: 1,
    hazard: {
        input: {
            substanceName: '',
            hPhrases: [],
            isMixture: false
        }, result: null
    },
    exposureSieve: {
        input: {
            physicalForm: 'liquid_low_volatility',
            hasContact: false,
        }, result: null
    },
    hygienicEval: {
        input: {
            vla: undefined,
            labResult: undefined,
            lod: undefined
        }, result: null
    },
    measures: [],
    hygieneRights: { eligible: false, timeAllowance: 0 }
};

export function useDecisionEngine() {
    const [state, setState] = useState<AssessmentState>(INITIAL_STATE);

    const runHazardAssessment = (input: HazardInput) => {
        const result = evaluateHazard(input);

        // Auto-propagate to NEXT modules (Exposure Sieve & Hygienic)
        // 1. Physical Form -> Exposure Sieve
        // 2. VLA/LOD -> Hygienic Eval

        let exposureUpdate = {};
        if (input.detectedPhysicalForm) {
            exposureUpdate = {
                exposureSieve: {
                    ...state.exposureSieve,
                    input: { ...state.exposureSieve.input, physicalForm: input.detectedPhysicalForm }
                }
            };
        }

        let hygienicUpdate = {};
        if (input.vlaInfo) {
            hygienicUpdate = {
                hygienicEval: {
                    ...state.hygienicEval,
                    input: {
                        ...state.hygienicEval.input,
                        vla: input.vlaInfo.vlaVal,
                        lod: input.vlaInfo.suggestedLod,
                        samplingDetails: input.vlaInfo.sampling ? {
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
            ...exposureUpdate,
            ...hygienicUpdate
        }));
        return result;
    };

    const runExposureSieveAssessment = (input: ExposureSieveInput) => {
        const result = evaluateExposureSieve(input);
        setState(prev => ({
            ...prev,
            exposureSieve: { input, result }
        }));
        return result;
    };

    const runHygienicAssessment = (input: HygienicEvalInput) => {
        const result = evaluateHygienicExposure(input);
        setState(prev => ({
            ...prev,
            hygienicEval: { input, result }
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
    const goToStep = (step: number) => setState(prev => ({ ...prev, step }));

    const reset = () => setState(INITIAL_STATE);

    return {
        state,
        runHazardAssessment,
        runExposureSieveAssessment,
        runHygienicAssessment,
        updateMeasures,
        nextStep,
        goToStep,
        reset
    };
}
