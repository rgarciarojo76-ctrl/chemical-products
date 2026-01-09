import React, { useState } from 'react';
import { StepCard } from '../../ui/StepCard';
import type { HygienicEvalInput, HygienicAssessment } from '../../../types';

interface HygienicEvalFormProps {
    onAnalyze: (input: HygienicEvalInput) => HygienicAssessment;
    onNext: () => void;
    initialData?: HygienicEvalInput;
    vlaReference?: number; // Passed from prev state
    substanceName?: string;
}

export const HygienicEvalForm: React.FC<HygienicEvalFormProps> = ({ onAnalyze, onNext, initialData, vlaReference, substanceName }) => {
    const [formData, setFormData] = useState<HygienicEvalInput>(initialData || {
        vla: vlaReference ? vlaReference : undefined
    });
    const [result, setResult] = useState<HygienicAssessment | null>(null);

    const handleAnalyze = () => {
        const assessment = onAnalyze(formData);
        setResult(assessment);
    };

    return (
        <StepCard
            title="Módulo C: Evaluación Higiénica Cuantitativa"
            description={`Definición de estrategia y conformidad para: ${substanceName || 'Agente'}`}
            icon="🧠"
        >
            {/* Strategy Helper Section */}
            <div className="form-group mb-4" style={{ backgroundColor: '#fff8e1', padding: '1rem', borderRadius: '8px', border: '1px solid #ffead0' }}>
                <h4 style={{ color: '#856404', marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🧪</span> Asistente de Estrategia de Muestreo
                </h4>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>¿Cómo es el perfil de exposición temporal?</label>
                    <select
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        value={formData.strategyType || ''}
                        onChange={(e) => setFormData({ ...formData, strategyType: e.target.value as any })}
                    >
                        <option value="">Seleccione tipo de proceso...</option>
                        <option value="continuous">Continuo y Homogéneo (Estable)</option>
                        <option value="peaks">Variable con Picos (Tareas puntuales)</option>
                        <option value="variable">Cíclico / Muy Variable</option>
                    </select>
                </div>

                {formData.strategyType && (
                    <div style={{ fontSize: '0.9rem', color: '#555', backgroundColor: 'rgba(255,255,255,0.5)', padding: '0.5rem', borderRadius: '4px' }}>
                        <strong>Recomendación: </strong>
                        {formData.strategyType === 'continuous' && "Muestreo de Larga Duración (VLA-ED). Mínimo representativo del 80% de la jornada."}
                        {formData.strategyType === 'peaks' && "Combinación de Muestreo de Corta Duración (VLA-EC) en picos + VLA-ED TWA basal."}
                        {formData.strategyType === 'variable' && "Estrategia de Muestreos Consecutivos para cubrir variabilidad cíclica."}
                    </div>
                )}
            </div>

            {/* Sampling Data Sheet */}
            <div className="form-group mb-4" style={{ backgroundColor: '#f0f7ff', padding: '1rem', borderRadius: '8px', border: '1px solid #d0e7ff' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#0056b3', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📋</span> Ficha de Muestreo (Método Recomendado)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Soporte de Captación</label>
                        <input
                            type="text"
                            value={formData.samplingDetails?.support || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                samplingDetails: { ...formData.samplingDetails!, support: e.target.value }
                            })}
                            placeholder="Ej. Filtro de membrana..."
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Técnica Analítica</label>
                        <input
                            type="text"
                            value={formData.samplingDetails?.technique || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                samplingDetails: { ...formData.samplingDetails!, technique: e.target.value }
                            })}
                            placeholder="Ej. Cromatografía..."
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Caudal de Muestreo (l/min)</label>
                        <input
                            type="text"
                            value={formData.samplingDetails?.flowRate || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                samplingDetails: { ...formData.samplingDetails!, flowRate: e.target.value }
                            })}
                            placeholder="Ej. 2 l/min"
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>Tiempo Mínimo (Vol. Mín)</label>
                        <input
                            type="text"
                            value={formData.samplingDetails?.minTime || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                samplingDetails: { ...formData.samplingDetails!, minTime: e.target.value }
                            })}
                            placeholder="Ej. 60 min"
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>
            </div>

            <div className="form-group mb-4" style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Validación de Resultados Analíticos</h4>
                <div className="inputs-grid">
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>1. VLA-ED (Límite)</label>
                        <input
                            type="text"
                            value={formData.vla ? `${formData.vla} mg/m³` : '---'}
                            disabled
                            style={{ width: '100%', padding: '0.25rem', backgroundColor: '#eee', border: '1px solid #ccc', color: '#555' }}
                        />
                        {!formData.vla && <small style={{ color: 'orange' }}>No detectado en B.D.</small>}
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>2. Resultado (mg/m³)</label>
                        <input
                            type="number"
                            step="0.001"
                            placeholder="Introducir..."
                            value={formData.labResult || ''}
                            style={{ width: '100%', padding: '0.25rem', border: '2px solid var(--color-primary)', borderRadius: '4px' }}
                            onChange={e => setFormData({ ...formData, labResult: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>3. LOD (Opcional)</label>
                        <input
                            type="number"
                            step="0.001"
                            placeholder="---"
                            value={formData.lod || ''}
                            style={{ width: '100%', padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            onChange={e => setFormData({ ...formData, lod: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>
            </div>

            <div className="actions" style={{ marginTop: 'var(--spacing-lg)', borderTop: '1px solid #eee', paddingTop: 'var(--spacing-md)' }}>
                {!result ? (
                    <button
                        onClick={handleAnalyze}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        Comprobar Conformidad
                    </button>
                ) : (
                    <div className={`result-box`} style={{
                        padding: '1rem',
                        backgroundColor: result.isSafe ? '#d4edda' : '#f8d7da',
                        border: `1px solid ${result.isSafe ? '#c3e6cb' : '#f5c6cb'}`,
                        borderRadius: '6px'
                    }}>
                        <h4 style={{ color: result.isSafe ? '#155724' : '#721c24' }}>
                            {result.isSafe ? 'Situación Controlada (Conforme)' : 'Situación de RIESGO (No Conforme)'}
                        </h4>

                        {result.complianceRatio && (
                            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Índice de Exposición: {result.complianceRatio.toFixed(2)} ({result.complianceRatio * 100}%)
                            </div>
                        )}

                        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>{result.justification.technical}</p>
                        <div style={{
                            fontSize: '0.8rem',
                            fontStyle: 'italic',
                            borderLeft: `2px solid ${result.isSafe ? 'green' : 'red'}`,
                            paddingLeft: '0.5rem'
                        }}>
                            <strong>Base Legal:</strong> {result.justification.legal.article} - {result.justification.legal.text}
                        </div>

                        <button
                            onClick={onNext}
                            style={{
                                marginTop: '1rem',
                                backgroundColor: result.isSafe ? 'var(--color-safe)' : 'var(--color-danger)',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                float: 'right'
                            }}
                        >
                            {result.isSafe ? 'Finalizar Evaluación' : 'Ir a Plan de Medidas (Obligatorio)'}
                        </button>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                )}
            </div>
        </StepCard>
    );
};
