import { useState } from "react";
import { useDecisionEngine } from "../hooks/useDecisionEngine";
import { WizardContainer } from "./wizard/WizardContainer";
import { HazardForm } from "./wizard/steps/HazardForm";
import { ExposureForm } from "./wizard/steps/ExposureForm";
import { HygienicEvalForm } from "./wizard/steps/HygienicEvalForm";
import { MeasuresForm } from "./wizard/steps/MeasuresForm";
import { FinalReport } from "./wizard/steps/FinalReport";
import { CnaeSearchForm } from "./wizard/steps/CnaeSearchForm";

const MainContent = () => {
  const [started, setStarted] = useState(false);
  const engine = useDecisionEngine();

  const handleAgentSelect = (agentName: string) => {
    // Pre-fill Hazard Input with the selected name
    engine.runHazardAssessment({
      ...engine.state.hazard.input,
      substanceName: agentName,
    });
    engine.nextStep();
  };

  if (!started) {
    return (
      <div
        className="card text-center"
        style={{
          padding: "var(--spacing-2xl)",
          marginTop: "var(--spacing-2xl)",
        }}
      >
        <h1 className="mb-2" style={{ fontSize: "2.5rem" }}>
          Identificación de productos químicos cancerígenos
        </h1>
        <h2
          className="mb-4"
          style={{
            fontSize: "1.2rem",
            color: "var(--color-primary-dark)",
            fontWeight: 400,
          }}
        >
          Asistente virtual para la identificación y valoración e Agentes
          Cancerígenos, Mutágenos y Reprotóxicos según los RD 665/1997 y RD
          612/2024
        </h2>
        <p
          className="mb-4"
          style={{
            color: "var(--color-text-light)",
            maxWidth: "600px",
            margin: "0 auto var(--spacing-xl)",
          }}
        >
          Este sistema le guiará paso a paso en la identificación y valoración
          de factores riesgos vinculados a productos químicos Cancerígenos,
          Mutágenos y Reprotóxicos
        </p>
        <button
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            padding: "var(--spacing-md) var(--spacing-xl)",
            fontSize: "1.2rem",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            transition: "transform 0.1s",
          }}
          onClick={() => setStarted(true)}
        >
          Iniciar Nueva Evaluación
        </button>
      </div>
    );
  }

  return (
    <WizardContainer
      key={engine.state.step}
      currentStep={engine.state.step + 1}
      totalSteps={6}
      title="Evaluación en curso"
    >
      {engine.state.step === 0 && (
        <CnaeSearchForm
          onNext={engine.nextStep}
          onSelectAgent={handleAgentSelect}
        />
      )}

      {engine.state.step === 1 && (
        <HazardForm
          onAnalyze={engine.runHazardAssessment}
          onNext={engine.nextStep}
          onBack={() => engine.goToStep(0)}
          initialData={engine.state.hazard.input}
        />
      )}

      {engine.state.step === 2 && (
        <ExposureForm
          onAnalyze={engine.runExposureSieveAssessment}
          onNext={engine.nextStep}
          onBack={() => engine.goToStep(1)}
          onFinish={() => engine.goToStep(5)}
          initialData={engine.state.exposureSieve.input}
          substanceName={engine.state.hazard.input.substanceName}
        />
      )}

      {engine.state.step === 3 && (
        <HygienicEvalForm
          onAnalyze={engine.runHygienicAssessment}
          onNext={engine.nextStep}
          onBack={() => engine.goToStep(2)}
          initialData={engine.state.hygienicEval.input}
          vlaReference={engine.state.hygienicEval.input.vla}
          substanceName={engine.state.hazard.input.substanceName}
          hazardData={engine.state.hazard.input}
        />
      )}

      {engine.state.step === 4 && (
        <MeasuresForm
          initialData={engine.state.measures}
          onUpdate={engine.updateMeasures}
          onNext={engine.nextStep}
          onBack={() => engine.goToStep(3)}
        />
      )}

      {engine.state.step === 5 && (
        <FinalReport
          state={engine.state}
          onReset={() => {
            setStarted(false);
            engine.reset();
          }}
          onBack={() => engine.goToStep(4)}
        />
      )}
    </WizardContainer>
  );
};

export default MainContent;
