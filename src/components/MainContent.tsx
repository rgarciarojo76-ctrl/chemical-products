import { useState } from "react";
import { useDecisionEngine } from "../hooks/useDecisionEngine";
import { WizardContainer } from "./wizard/WizardContainer";
import { HazardForm } from "./wizard/steps/HazardForm";
import { ExposureForm } from "./wizard/steps/ExposureForm";
import { HygienicEvalForm } from "./wizard/steps/HygienicEvalForm";
import { MeasuresForm } from "./wizard/steps/MeasuresForm";
import { FinalReport } from "./wizard/steps/FinalReport";
import { CnaeSearchForm } from "./wizard/steps/CnaeSearchForm";
import type { CnaeEntry } from "../data/cnaeData";
import { ReportPreviewModal } from "./modals/ReportPreviewModal";
import { generateReportData, type ReportData } from "../utils/reportGenerator";
import type { HygienicEvalInput } from "../types";

const MainContent = () => {
  const [started, setStarted] = useState(false);
  const engine = useDecisionEngine();
  const [selectedCnae, setSelectedCnae] = useState<CnaeEntry | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Helper to generate report from any step
  const handleShowReport = (partialHygienicData?: HygienicEvalInput) => {
    // Create a temporary state merging current engine state with the partial data from the active form
    const tempState = { ...engine.state };

    if (partialHygienicData) {
      tempState.hygienicEval = {
        ...tempState.hygienicEval,
        input: {
          ...tempState.hygienicEval.input,
          ...partialHygienicData,
        },
      };
    }

    const data = generateReportData(tempState);
    setReportData(data);
    setShowReportModal(true);
  };

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
        className="container"
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "4rem",
            borderRadius: "16px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            maxWidth: "900px",
            width: "100%",
            textAlign: "center",
            border: "1px solid #f3f4f6",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            {/* Optional: Add an icon or illustration here if available, otherwise just text */}
          </div>

          <h1
            style={{
              fontSize: "3rem",
              background: "linear-gradient(to right, #009bdb, #0077a8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.025em",
            }}
          >
            Identificación de productos químicos cancerígenos
          </h1>

          <h2
            style={{
              fontSize: "1.25rem",
              color: "#4b5563",
              fontWeight: 500,
              marginBottom: "2rem",
              lineHeight: 1.6,
              maxWidth: "800px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Asistente virtual para la identificación y valoración de Agentes
            Cancerígenos, Mutágenos y Reprotóxicos según los RD 665/1997 y RD
            612/2024
          </h2>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "1rem",
              maxWidth: "600px",
              margin: "0 auto 3rem auto",
            }}
          >
            Este sistema le guiará paso a paso en la identificación y valoración
            de factores de riesgo vinculados a productos químicos Cancerígenos,
            Mutágenos y Reprotóxicos.
          </p>

          <button
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: "none",
              padding: "1rem 2.5rem",
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow:
                "0 4px 6px -1px rgba(0, 155, 219, 0.3), 0 2px 4px -1px rgba(0, 155, 219, 0.1)",
              transition: "all 0.2s ease",
            }}
            onClick={() => setStarted(true)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 155, 219, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 6px -1px rgba(0, 155, 219, 0.3)";
            }}
          >
            Iniciar Nueva Evaluación
          </button>

          <div
            style={{
              marginTop: "4rem",
              paddingTop: "2rem",
              borderTop: "1px solid #f3f4f6",
              color: "#d1d5db",
              fontSize: "0.8rem",
            }}
          >
            © 2026 Dirección Técnica - Motor de Decisión CMR (RD 665/1997)
          </div>
        </div>
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
          onSelectCnae={setSelectedCnae}
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
          detectedPhysicalState={engine.state.hazard.input.detectedPhysicalForm}
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
          selectedCnae={selectedCnae}
          onShowReport={handleShowReport}
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

      {/* Global Report Modal */}
      {reportData && (
        <ReportPreviewModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          data={reportData}
        />
      )}
    </WizardContainer>
  );
};

export default MainContent;
