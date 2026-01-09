import React, { useState, useEffect } from 'react';
import { StepCard } from '../../ui/StepCard';
import type { MeasureStatus, MeasureDefinition } from '../../../types';
import { RD_MEASURES } from '../../../utils/engineLogic';

interface MeasuresFormProps {
    initialData: MeasureStatus[];
    onUpdate: (measures: MeasureStatus[]) => void;
    onNext: () => void;
}

export const MeasuresForm: React.FC<MeasuresFormProps> = ({ initialData, onUpdate, onNext }) => {
    // Initialize state with all measures if empty
    const initializeMeasures = () => {
        if (initialData.length > 0) return initialData;
        return RD_MEASURES.map(m => ({
            measureId: m.id,
            implemented: false,
            justificationIfNo: ''
        }));
    };

    const [measures, setMeasures] = useState<MeasureStatus[]>(initializeMeasures);

    // Sync with parent when changed
    const handleToggle = (id: string, implemented: boolean) => {
        const updated = measures.map(m =>
            m.measureId === id ? { ...m, implemented, justificationIfNo: implemented ? '' : m.justificationIfNo } : m
        );
        setMeasures(updated);
        onUpdate(updated);
    };

    const handleJustification = (id: string, text: string) => {
        const updated = measures.map(m =>
            m.measureId === id ? { ...m, justificationIfNo: text } : m
        );
        setMeasures(updated);
        onUpdate(updated);
    };

    const isValid = measures.every(m => m.implemented || (!m.implemented && m.justificationIfNo.trim().length > 5));

    return (
        <StepCard
            title="Módulo C: Jerarquía de Medidas (RD 665/1997)"
            description="Verifique la implantación de las medidas obligatorias. Si no se aplican, DEBE justificar técnica o legalmente la causa."
            icon="📋"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {RD_MEASURES.map((def, index) => {
                    const status = measures.find(m => m.measureId === def.id) || { implemented: false, justificationIfNo: '' };
                    const isCritical = def.level === 'substitution' || def.level === 'closed_system';

                    return (
                        <div key={def.id} style={{
                            padding: '1rem',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            backgroundColor: status.implemented ? '#f0fff4' : '#fff5f5',
                            borderLeft: status.implemented ? '4px solid #28a745' : '4px solid #dc3545'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        fontWeight: 'bold',
                                        color: '#666',
                                        backgroundColor: '#eee',
                                        padding: '2px 6px',
                                        borderRadius: '4px'
                                    }}>
                                        {def.article}
                                    </span>
                                    <h4 style={{ margin: '0.5rem 0', fontSize: '1rem', color: '#333' }}>
                                        {index + 1}. {def.text}
                                    </h4>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleToggle(def.id, true)}
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #28a745',
                                            backgroundColor: status.implemented ? '#28a745' : 'white',
                                            color: status.implemented ? 'white' : '#28a745',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        SÍ
                                    </button>
                                    <button
                                        onClick={() => handleToggle(def.id, false)}
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '4px',
                                            border: '1px solid #dc3545',
                                            backgroundColor: !status.implemented ? '#dc3545' : 'white',
                                            color: !status.implemented ? 'white' : '#dc3545',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        NO
                                    </button>
                                </div>
                            </div>

                            {!status.implemented && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#dc3545', marginBottom: '0.25rem' }}>
                                        ⚠️ Obligatorio: Justificación Técnica / Legal
                                    </label>
                                    <textarea
                                        value={status.justificationIfNo}
                                        onChange={(e) => handleJustification(def.id, e.target.value)}
                                        placeholder={`Explique por qué no es técnicamente posible la ${def.level === 'substitution' ? 'sustitución' : 'medida'}...`}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            border: '1px solid #dc3545',
                                            borderRadius: '4px',
                                            minHeight: '60px',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="actions" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem', textAlign: 'right' }}>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    style={{
                        backgroundColor: isValid ? 'var(--color-primary)' : '#ccc',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '1rem',
                        cursor: isValid ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s'
                    }}
                >
                    Validar y Continuar
                </button>
            </div>
        </StepCard>
    );
};
