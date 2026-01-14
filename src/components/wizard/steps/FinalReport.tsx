import React, { useRef } from 'react';
import { StepCard, TrafficLight, LegalTooltip } from '../../ui';
import type { AssessmentState } from '../../../types';
import { RD_MEASURES } from '../../../utils/engineLogic';

interface FinalReportProps {
    state: AssessmentState;
    onReset: () => void;
    onBack?: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({ state, onReset, onBack }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const hazardResult = state.hazard.result;


    // Helper to find measure text
    const getMeasureText = (id: string) => RD_MEASURES.find(m => m.id === id)?.text || id;
    const getArticle = (id: string) => RD_MEASURES.find(m => m.id === id)?.article || '';

    return (
        <StepCard
            title="Informe Técnico de Identificación y Evaluación"
            description="Resumen final de la actuación preventiva según RD 665/1997."
            icon="✅"
        >
            <div ref={reportRef} className="report-content" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>

                {/* Section 1: Hazard Identification */}
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h3 style={{ color: 'var(--color-primary)', borderBottom: '2px solid var(--color-secondary)', display: 'inline-block', marginBottom: '1rem' }}>
                        1. Identificación del Agente
                    </h3>
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, auto) 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <strong>Agente:</strong>
                            <span>{state.hazard.input.substanceName || 'No identificado'}</span>

                            <strong>Frases H:</strong>
                            <span>{state.hazard.input.hPhrases.length > 0 ? state.hazard.input.hPhrases.join(', ') : 'Ninguna'}</span>

                            <strong>Uso/Origen:</strong>
                            <span>{state.hazard.input.isMixture ? 'Mezcla' : 'Sustancia Pura'} {state.hazard.input.concentration ? `(${state.hazard.input.concentration}%)` : ''}</span>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <strong>Conclusión de Peligrosidad:</strong>
                            <div style={{ marginTop: '0.5rem' }}>
                                <TrafficLight
                                    status={hazardResult?.isHazardous ? 'warning' : 'safe'}
                                    text={hazardResult?.isHazardous ? 'APLICA RD 665/1997 (Agente Cancerígeno/Mutágeno/Reprotóxico)' : 'No clasificado como CMR Cat 1A/1B'}
                                    icon={hazardResult?.isHazardous ? '☢️' : '✅'}
                                />
                            </div>
                            {hazardResult?.justifications.map((j, i) => (
                                <p key={i} style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    • {j.technical} <LegalTooltip reference={j.legal.article} />
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 2: Exposure Analysis */}
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h3 style={{ color: 'var(--color-primary)', borderBottom: '2px solid var(--color-secondary)', display: 'inline-block', marginBottom: '1rem' }}>
                        2. Análisis de Exposición y Riesgo Higiénico
                    </h3>

                    {/* 2.1 Sieve */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h4 style={{ marginTop: 0, fontSize: '1rem', color: '#555' }}>2.1. Tamiz Cualitativo (Sieve)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, auto) 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <strong>Forma Física:</strong>
                            <span>{state.exposureSieve.input.physicalForm}</span>

                            <strong>Contacto Directo:</strong>
                            <span>{state.exposureSieve.input.hasContact ? 'SÍ' : 'NO'}</span>
                        </div>

                        <div style={{ marginTop: '0.5rem' }}>
                            <TrafficLight
                                status={state.exposureSieve.result?.isRelevant ? 'info' : 'safe'}
                                text={state.exposureSieve.result?.isRelevant ? 'Exposición Potencialmente Relevante' : 'Exposición No Significativa'}
                                icon={state.exposureSieve.result?.isRelevant ? 'ℹ️' : '✅'}
                            />
                        </div>
                    </div>

                    {/* 2.2 Hygienic Eval (If exists) */}
                    {state.hygienicEval.result && (
                        <div style={{ padding: '1rem', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
                            <h4 style={{ marginTop: 0, fontSize: '1rem', color: '#555' }}>2.2. Valoración Higiénica Cuantitativa</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, auto) 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <strong>VLA-ED Referencia:</strong>
                                <span>{state.hygienicEval.input.vla ? `${state.hygienicEval.input.vla} mg/m³` : 'N/A'}</span>

                                <strong>Resultado Muestreo:</strong>
                                <span>{state.hygienicEval.input.labResult} mg/m³</span>
                            </div>

                            <div style={{ marginTop: '0.5rem' }}>
                                <TrafficLight
                                    status={state.hygienicEval.result.isSafe ? 'safe' : 'danger'}
                                    text={state.hygienicEval.result.isSafe ? 'Situación CONFORME (Riesgo Controlado)' : 'Situación NO CONFORME (Riesgo Higiénico)'}
                                    icon={state.hygienicEval.result.isSafe ? '✅' : '🛑'}
                                />
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                                    {state.hygienicEval.result.justification.technical}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3: Action Plan */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--color-primary)', borderBottom: '2px solid var(--color-secondary)', display: 'inline-block', marginBottom: '1rem' }}>
                        3. Plan de Medidas (Jerarquía RD 665/1997)
                    </h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Medida</th>
                                <th style={{ padding: '0.5rem', textAlign: 'center', width: '120px' }}>Estado</th>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Justificación / Comentario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.measures.map((m) => (
                                <tr key={m.measureId} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{getMeasureText(m.measureId)}</div>
                                        <div style={{ marginTop: '4px' }}>
                                            <LegalTooltip reference={getArticle(m.measureId)} />
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                        <TrafficLight
                                            status={m.implemented ? 'safe' : 'danger'}
                                            text={m.implemented ? 'SÍ' : 'NO'}
                                            size="sm"
                                        />
                                    </td>
                                    <td style={{ padding: '0.5rem', fontStyle: 'italic', color: '#555' }}>
                                        {m.implemented ? 'Implantada' : m.justificationIfNo}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="signatures" style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                    <div style={{ textAlign: 'center', width: '40%' }}>
                        <p style={{ marginBottom: '3rem' }}>Fdo. Técnico PRL</p>
                        <hr style={{ border: 'none', borderTop: '1px dashed #ccc' }} />
                    </div>
                    <div style={{ textAlign: 'center', width: '40%' }}>
                        <p style={{ marginBottom: '3rem' }}>Fdo. Representante Empresa</p>
                        <hr style={{ border: 'none', borderTop: '1px dashed #ccc' }} />
                    </div>
                </div>

            </div>

            <div className="actions" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                {onBack && (
                    <button
                        onClick={onBack}
                        style={{
                            backgroundColor: 'white',
                            color: '#666',
                            border: '1px solid #ccc',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        &larr; Volver a Editar
                    </button>
                )}
                <button
                    onClick={onReset}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-light)',
                        border: '1px solid #ccc',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px'
                    }}
                >
                    Nueva Evaluación
                </button>
                <button
                    onClick={handlePrint}
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    🖨️ Imprimir Informe
                </button>
            </div>
        </StepCard>
    );
};
