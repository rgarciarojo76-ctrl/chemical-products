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


            {/* 2. Strategy & Sampling (Planning) */}
            <div className="form-group mb-4">
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#0056b3', borderBottom: '2px solid #0056b3', paddingBottom: '0.25rem' }}>
                    2. Estrategia de Medición (UNE-EN 689)
                </h4>

                {/* Exposure Profile */}
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fff8e1', borderRadius: '8px', border: '1px solid #ffead0' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📉</span> Perfil de Exposición Temporal
                    </div>
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

                    {formData.strategyType && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                            {formData.strategyType === 'continuous' && "ℹ️ Estrategia Recomendada: Muestreo de Larga Duración (VLA-ED, >80% jornada) en Grupo de Exposición Homogéneo (GEH)."}
                            {formData.strategyType === 'peaks' && "ℹ️ Estrategia Recomendada: Muestreo VLA-ED basal + Mediciones de 15 min (VLA-EC) durante picos."}
                            {formData.strategyType === 'variable' && "ℹ️ Estrategia Recomendada: Muestreo aleatorio estratificado (Mínimo 3 mediciones representativas de cada fase)."}
                        </div>
                    )}
                </div>

                {/* Sampling Matrix */}
                <div style={{ padding: '1rem', backgroundColor: '#f0f7ff', borderRadius: '8px', border: '1px solid #d0e7ff' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0056b3' }}>
                        <span>📋</span> Método de Captación y Análisis
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Soporte</label>
                            <input
                                type="text"
                                value={formData.samplingDetails?.support || ''}
                                onChange={(e) => setFormData({ ...formData, samplingDetails: { ...formData.samplingDetails!, support: e.target.value } })}
                                placeholder="Ej. Filtro..."
                                style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Técnica</label>
                            <input
                                type="text"
                                value={formData.samplingDetails?.technique || ''}
                                onChange={(e) => setFormData({ ...formData, samplingDetails: { ...formData.samplingDetails!, technique: e.target.value } })}
                                placeholder="Ej. HPLC..."
                                style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Caudal (l/min)</label>
                            <input
                                type="text"
                                value={formData.samplingDetails?.flowRate || ''}
                                onChange={(e) => setFormData({ ...formData, samplingDetails: { ...formData.samplingDetails!, flowRate: e.target.value } })}
                                placeholder="Ej. 2.0"
                                style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#666' }}>Tiempo Mín.</label>
                            <input
                                type="text"
                                value={formData.samplingDetails?.minTime || ''}
                                onChange={(e) => setFormData({ ...formData, samplingDetails: { ...formData.samplingDetails!, minTime: e.target.value } })}
                                placeholder="Ej. 120 min"
                                style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 1. Basic Characterization & Limits (Moved) */}
            <div className="form-group mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '2px solid #0056b3', paddingBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '1rem', margin: 0, color: '#0056b3' }}>
                        1. Caracterización Básica
                    </h4>
                    <a
                        href="https://www.navarra.gob.es/NR/rdonlyres/C4878B29-DA35-49FB-9845-517AFA7A5D3C/457874/Caracterizacionbasica.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.8rem', color: '#009bdb', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        📚 Guía Oficial Caracterización
                    </a>
                </div>

                {/* Educational Guide for Junior Techs */}
                <div style={{ backgroundColor: '#eef6fc', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', borderLeft: '4px solid #009bdb' }}>
                    <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#0056b3' }}>ℹ️ Guía Rápida para Técnico Junior:</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                        <div>
                            <strong>1. Identificación A.Q.:</strong>
                            <ul style={{ paddingLeft: '1.2rem', margin: '0.2rem 0' }}>
                                <li>Revisar FDS, Etiquetado y VLAs.</li>
                                <li>Identificar A.Q. más peligrosos.</li>
                            </ul>
                        </div>
                        <div>
                            <strong>2. Factores Exposición:</strong>
                            <ul style={{ paddingLeft: '1.2rem', margin: '0.2rem 0' }}>
                                <li>Revisar Tareas, Procesos y Duración.</li>
                                <li>Definir Trabajadores Implicados (GES).</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Agente Químico</label>
                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{substanceName || 'No identificado'}</div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>VLA-ED (Valor Límite Ambiental)</label>
                        <div style={{ fontWeight: 'bold', fontSize: '1rem', color: formData.vla ? '#333' : '#999' }}>
                            {formData.vla ? `${formData.vla} mg/m³` : '---'}
                        </div>
                        {!formData.vla && <small style={{ color: 'orange' }}>No disponible en B.D.</small>}
                    </div>
                </div>
            </div>

            {/* 3. Results (Execution) */}
            <div className="form-group mb-4">
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#0056b3', borderBottom: '2px solid #0056b3', paddingBottom: '0.25rem' }}>
                    3. Resultados de la Medición
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>Concentración Hallada (I)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="number"
                                step="0.001"
                                placeholder="0.000"
                                value={formData.labResult || ''}
                                style={{ width: '100%', padding: '0.5rem', border: '2px solid var(--color-primary)', borderRadius: '4px' }}
                                onChange={e => setFormData({ ...formData, labResult: parseFloat(e.target.value) })}
                            />
                            <span style={{ fontWeight: 600 }}>mg/m³</span>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>Límite Detección (LOD)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="number"
                                step="0.001"
                                placeholder="0.000"
                                value={formData.lod || ''}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                                onChange={e => setFormData({ ...formData, lod: parseFloat(e.target.value) })}
                            />
                            <span style={{ fontWeight: 600 }}>mg/m³</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Actions & Verification */}
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
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        4. Verificar Conformidad (Test Preliminar)
                    </button>
                ) : (
                    <div className={`result-box`} style={{
                        padding: '1rem',
                        backgroundColor: result.isSafe ? '#d4edda' : '#f8d7da',
                        border: `1px solid ${result.isSafe ? '#c3e6cb' : '#f5c6cb'}`,
                        borderRadius: '6px'
                    }}>
                        <h4 style={{ color: result.isSafe ? '#155724' : '#721c24', marginTop: 0 }}>
                            {result.isSafe ? 'CONFORME (Aceptable)' : 'NO CONFORME (Inaceptable)'}
                        </h4>

                        {result.complianceRatio && (
                            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                Índice de Exposición (I/VLA): {result.complianceRatio.toFixed(2)} ({result.complianceRatio * 100}%)
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
                            {result.isSafe ? 'Finalizar Evaluación' : 'Ir a Plan de Medidas'}
                        </button>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                )}
            </div>
        </StepCard>
    );
};
