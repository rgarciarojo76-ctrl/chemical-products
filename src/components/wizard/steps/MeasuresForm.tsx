import React, { useState } from 'react';
import { StepCard } from '../../ui/StepCard';
import type { MeasureStatus } from '../../../types';
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
            title="Módulo D: Jerarquía de Medidas (RD 665/1997)"
            description="Verifique la implantación de las medidas obligatorias. Si no se aplican, DEBE justificar técnica o legalmente la causa."
            icon="📋"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {RD_MEASURES.map((def, index) => {
                    const status = measures.find(m => m.measureId === def.id) || { implemented: false, justificationIfNo: '' };


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

                            {def.id === 'substitution' && (
                                <div style={{ marginTop: '1rem', borderTop: '1px dashed #ddd', paddingTop: '1rem' }}>
                                    <details style={{ backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                        <summary style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#0056b3', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>💡</span> Ver 5 Alternativas Técnicas (Sugerencias AI)
                                        </summary>

                                        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                                            {/* Alternative 1 */}
                                            <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                                    <strong style={{ color: '#0f172a' }}>1. Plasma de Peróxido de Hidrógeno</strong>
                                                    <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Esterilización</span>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>
                                                    Elimina el uso de formaldehído gas cancerígeno. Tecnología limpia (subproductos: agua y oxígeno) con eficacia esporicida validada. Baja temperatura (47-56°C).
                                                </p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                                    <span style={{ color: '#64748b', fontStyle: 'italic', borderLeft: '2px solid #94a3b8', paddingLeft: '0.5rem' }}>
                                                        Fuente: CDC "Guideline for Disinfection and Sterilization in Healthcare Facilities"
                                                    </span>
                                                    <a href="https://www.asp.com/es-es/productos/sistemas-de-esterilizacion-sterrad" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                                                        🏢 ASP (STERRAD) &rarr;
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Alternative 2 */}
                                            <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                                    <strong style={{ color: '#0f172a' }}>2. Fijadores Base Etanol/Metanol (FineFIX)</strong>
                                                    <span style={{ fontSize: '0.75rem', backgroundColor: '#e0f2fe', color: '#075985', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Histopatología</span>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>
                                                    Sustituye el cross-linking de aldehídos. Permite mayor recuperación de ADN/ARN para biología molecular sin la toxicidad/carcinogenicidad del formol.
                                                </p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                                    <span style={{ color: '#64748b', fontStyle: 'italic', borderLeft: '2px solid #94a3b8', paddingLeft: '0.5rem' }}>
                                                        Fuente: NIH (National Institutes of Health) "Formalin-free fixatives review"
                                                    </span>
                                                    <a href="https://www.milestonemedsrl.com/product/finefix-formalin-free-fixative/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                                                        🏢 Milestone Medical &rarr;
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Alternative 3 */}
                                            <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                                    <strong style={{ color: '#0f172a' }}>3. Resinas MDI / Poliuretano (NAF)</strong>
                                                    <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Industria Madera</span>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>
                                                    Aglomerantes "No Added Formaldehyde" (NAF). Eliminan totalmente la emisión en tableros. Mayor resistencia a humedad que la urea-formol.
                                                </p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                                    <span style={{ color: '#64748b', fontStyle: 'italic', borderLeft: '2px solid #94a3b8', paddingLeft: '0.5rem' }}>
                                                        Fuente: Fichas Técnicas Industriales (Weinberger Holz / Sonae Arauco)
                                                    </span>
                                                    <a href="https://www.sonaearauco.com/es/productos/ecoboard/detalles" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                                                        🏢 Sonae Arauco (Ecoboard) &rarr;
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Alternative 4 */}
                                            <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                                    <strong style={{ color: '#0f172a' }}>4. Ácido Peracético (PAA)</strong>
                                                    <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Desinfección</span>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>
                                                    Biocida oxidante biodegradable (se descompone en acético, agua, O2). No fija proteínas ni crea biofilms, a diferencia de los aldehídos.
                                                </p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                                    <span style={{ color: '#64748b', fontStyle: 'italic', borderLeft: '2px solid #94a3b8', paddingLeft: '0.5rem' }}>
                                                        Fuente: UNE-EN ISO 15883 (Lavadoras desinfectadoras)
                                                    </span>
                                                    <a href="https://www.sterislifesciences.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                                                        🏢 STERIS / Solvay &rarr;
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Alternative 5 */}
                                            <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                                    <strong style={{ color: '#0f172a' }}>5. Miel / Jaggery (Soluciones Naturales)</strong>
                                                    <span style={{ fontSize: '0.75rem', backgroundColor: '#fae8ff', color: '#86198f', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Histología Docente</span>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>
                                                    Alternativas no tóxicas para conservación de muestras en entornos de bajo riesgo. Preservación morfológica adecuada para H&E rutinaria.
                                                </p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                                    <span style={{ color: '#64748b', fontStyle: 'italic', borderLeft: '2px solid #94a3b8', paddingLeft: '0.5rem' }}>
                                                        Fuente: Journal of Oral and Maxillofacial Pathology (JOMFP, 2020)
                                                    </span>
                                                    <span style={{ color: '#999', cursor: 'help' }} title="Solución natural no comercializada específicamente">
                                                        🏢 (Producto Genérico)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            )}

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
