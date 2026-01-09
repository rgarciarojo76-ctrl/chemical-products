import React, { useRef } from 'react';
import { StepCard } from '../../ui/StepCard';
import type { AssessmentState, MeasureStatus } from '../../../types';
import { RD_MEASURES } from '../../../utils/engineLogic';

interface FinalReportProps {
    state: AssessmentState;
    onReset: () => void;
}

export const FinalReport: React.FC<FinalReportProps> = ({ state, onReset }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const hazardResult = state.hazard.result;
    const exposureResult = state.exposure.result;

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
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                backgroundColor: hazardResult?.isHazardous ? '#fff3cd' : '#d4edda',
                                color: hazardResult?.isHazardous ? '#856404' : '#155724',
                                borderRadius: '4px',
                                fontWeight: 600
                            }}>
                                {hazardResult?.isHazardous ? 'APLICA RD 665/1997 (Agente Cancerígeno/Mutágeno/Reprotóxico)' : 'No clasificado como CMR Cat 1A/1B'}
                            </div>
                            {hazardResult?.justifications.map((j, i) => (
                                <p key={i} style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                                    • {j.technical} ({j.legal.article})
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 2: Exposure Analysis */}
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h3 style={{ color: 'var(--color-primary)', borderBottom: '2px solid var(--color-secondary)', display: 'inline-block', marginBottom: '1rem' }}>
                        2. Análisis de Exposición
                    </h3>
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, auto) 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <strong>Forma Física:</strong>
                            <span>{state.exposure.input.physicalForm}</span>

                            <strong>Contacto Directo:</strong>
                            <span>{state.exposure.input.hasContact ? 'SÍ' : 'NO'}</span>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <strong>Conclusión de Exposición:</strong>
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                backgroundColor: exposureResult?.isRelevant ? '#d1ecf1' : '#d4edda',
                                color: exposureResult?.isRelevant ? '#0c5460' : '#155724',
                                borderRadius: '4px',
                                fontWeight: 600
                            }}>
                                {exposureResult?.isRelevant ? 'Exposición Relevante (Requiere Medidas)' : 'Exposición No Significativa'}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                                • {exposureResult?.justification.technical}
                            </p>
                        </div>
                    </div>
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
                                <th style={{ padding: '0.5rem', textAlign: 'center', width: '80px' }}>Estado</th>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Justificación / Comentario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.measures.map((m) => (
                                <tr key={m.measureId} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{getMeasureText(m.measureId)}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{getArticle(m.measureId)}</div>
                                    </td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                        {m.implemented ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>SÍ</span>
                                        ) : (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>NO</span>
                                        )}
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
