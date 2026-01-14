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
    // Initialize state with all measures, merging with initialData if present
    const initializeMeasures = () => {
        return RD_MEASURES.map(m => {
            const existing = initialData.find(d => d.measureId === m.id);
            if (existing) return existing;

            return {
                measureId: m.id,
                implemented: false,
                justificationIfNo: ''
            };
        });
    };

    const [measures, setMeasures] = useState<MeasureStatus[]>(initializeMeasures);
    const [activeStep, setActiveStep] = useState(0);
    const currentMeasure = RD_MEASURES[activeStep];
    const currentStatus = measures.find(m => m.measureId === currentMeasure.id) || { implemented: false, justificationIfNo: '' };

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

    const handleNextStep = () => {
        if (activeStep < RD_MEASURES.length - 1) {
            setActiveStep(prev => prev + 1);
        } else {
            onNext();
        }
    };

    const handlePrevStep = () => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    };

    const isCurrentValid = currentStatus.implemented || (!currentStatus.implemented && currentStatus.justificationIfNo.trim().length > 5);
    const isLastStep = activeStep === RD_MEASURES.length - 1;

    return (
        <StepCard
            title="Módulo D: Jerarquía de Medidas (RD 665/1997)"
            description={`Paso ${activeStep + 1} de ${RD_MEASURES.length}: Verifique la implantación de las medidas obligatorias.`}
            icon="📋"
        >
            {/* Progress Indicator */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                {RD_MEASURES.map((_, idx) => {
                    const status = measures.find(m => m.measureId === RD_MEASURES[idx].id);
                    const isCompleted = status?.implemented || (status && !status.implemented && status.justificationIfNo.length > 5);

                    return (
                        <div
                            key={idx}
                            style={{
                                flex: 1,
                                height: '4px',
                                borderRadius: '2px',
                                backgroundColor: idx === activeStep ? 'var(--color-primary)' : (isCompleted ? '#28a745' : '#e2e8f0'),
                                opacity: idx === activeStep ? 1 : 0.6
                            }}
                        />
                    );
                })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div key={currentMeasure.id} style={{
                    padding: '1.5rem',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    backgroundColor: currentStatus.implemented ? '#f0fff4' : '#fff5f5',
                    borderLeft: currentStatus.implemented ? '4px solid #28a745' : '4px solid #dc3545',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                            <span style={{
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                color: '#666',
                                backgroundColor: '#eee',
                                padding: '4px 8px',
                                borderRadius: '4px'
                            }}>
                                {currentMeasure.article}
                            </span>
                            <h4 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.25rem', color: '#1e293b', lineHeight: 1.4 }}>
                                {activeStep + 1}. {currentMeasure.text}
                            </h4>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => handleToggle(currentMeasure.id, true)}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    border: '1px solid #28a745',
                                    backgroundColor: currentStatus.implemented ? '#28a745' : 'white',
                                    color: currentStatus.implemented ? 'white' : '#28a745',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                }}
                            >
                                SÍ
                            </button>
                            <button
                                onClick={() => handleToggle(currentMeasure.id, false)}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    border: '1px solid #dc3545',
                                    backgroundColor: !currentStatus.implemented ? '#dc3545' : 'white',
                                    color: !currentStatus.implemented ? 'white' : '#dc3545',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                }}
                            >
                                NO
                            </button>
                        </div>
                    </div>

                    {currentMeasure.id === 'substitution' && (
                        <div style={{ marginTop: '1.5rem', borderTop: '2px dashed #e2e8f0', paddingTop: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.25rem' }}>💡</span>
                                <h5 style={{ margin: 0, fontSize: '1rem', color: '#0056b3', fontWeight: 700 }}>
                                    Alternativas Técnicas Recomendadas (AI Suggestions)
                                </h5>
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {/* Alternative 1 */}
                                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                        <strong style={{ color: '#0f172a', fontSize: '1rem' }}>1. Plasma de Peróxido de Hidrógeno</strong>
                                        <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Esterilización</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                                        Elimina el uso de formaldehído gas cancerígeno. Tecnología limpia (subproductos: agua y oxígeno) con eficacia esporicida validada. Baja temperatura (47-56°C).
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                                        <a href="https://www.cdc.gov/infectioncontrol/guidelines/disinfection/index.html" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            📖 Fuente: CDC "Guideline for Disinfection..." 🔗
                                        </a>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <a href="https://www.asp.com/es-es" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                                                🏢 ASP (Web Oficial) &rarr;
                                            </a>
                                            <a href="https://www.asp.com/es-es/biblioteca-tecnica" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                                📄 Buscar FDS (Biblioteca)
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Alternative 2 */}
                                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                        <strong style={{ color: '#0f172a', fontSize: '1rem' }}>2. Fijadores Base Etanol/Metanol (FineFIX)</strong>
                                        <span style={{ fontSize: '0.75rem', backgroundColor: '#e0f2fe', color: '#075985', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Histopatología</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                                        Sustituye el cross-linking de aldehídos. Permite mayor recuperación de ADN/ARN para biología molecular sin la toxicidad/carcinogenicidad del formol.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                                        <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3927343/" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            📖 Fuente: NIH "Formalin-free fixatives review" 🔗
                                        </a>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <a href="https://www.milestonemedsrl.com/pathology/reagents-and-consumables/finefix/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                                                🏢 Milestone Medical &rarr;
                                            </a>
                                            <a href="https://www.milestonemedsrl.com/resources/" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                                📄 Descargas / FDS
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Alternative 3 */}
                                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                        <strong style={{ color: '#0f172a', fontSize: '1rem' }}>3. Resinas MDI / Poliuretano (NAF)</strong>
                                        <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Industria Madera</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                                        Aglomerantes "No Added Formaldehyde" (NAF). Eliminan totalmente la emisión en tableros. Mayor resistencia a humedad que la urea-formol.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                                        <a href="https://www.sonaearauco.com/es/productos" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            📖 Fuente: Fichas Técnicas (Sonae Arauco) 🔗
                                        </a>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <a href="https://www.sonaearauco.com/es/productos" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                                                🏢 Sonae Arauco (Web) &rarr;
                                            </a>
                                            <a href="https://www.sonaearauco.com/es/areadescargas" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                                📄 Área de Descargas
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Alternative 4 */}
                                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                        <strong style={{ color: '#0f172a', fontSize: '1rem' }}>4. Ácido Peracético (PAA)</strong>
                                        <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Desinfección</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                                        Biocida oxidante biodegradable (se descompone en acético, agua, O2). No fija proteínas ni crea biofilms, a diferencia de los aldehídos.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                                        <a href="https://www.iso.org/standard/53385.html" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            📖 Fuente: ISO 15883-4 (Endoscopios) 🔗
                                        </a>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <a href="https://www.sterislifesciences.com/products/surface-disinfectants" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                                                🏢 STERIS (Desinfectantes) &rarr;
                                            </a>
                                            <a href="https://www.sterislifesciences.com/resources/safety-data-sheets" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                                                📄 Buscar FDS (Oficial)
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Alternative 5 */}
                                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                        <strong style={{ color: '#0f172a', fontSize: '1rem' }}>5. Miel / Jaggery (Soluciones Naturales)</strong>
                                        <span style={{ fontSize: '0.75rem', backgroundColor: '#fae8ff', color: '#86198f', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Histología Docente</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                                        Alternativas no tóxicas para conservación de muestras en entornos de bajo riesgo. Preservación morfológica adecuada para H&E rutinaria.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                                        <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6996362/" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            📖 Fuente: Journal of Oral and Maxillofacial Pathology (JOMFP) 🔗
                                        </a>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#999', cursor: 'help' }} title="Solución natural no comercializada específicamente">
                                                🏢 (Producto Genérico)
                                            </span>
                                            <span style={{ color: '#28a745', fontSize: '0.7rem', border: '1px solid #28a745', padding: '1px 4px', borderRadius: '4px' }}>
                                                🌿 Grado Alimentario
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!currentStatus.implemented && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#dc3545', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>⚠️</span> Justificación Técnica / Legal Obligatoria
                            </label>
                            <textarea
                                value={currentStatus.justificationIfNo}
                                onChange={(e) => handleJustification(currentMeasure.id, e.target.value)}
                                placeholder="Describa por qué NO es posible aplicar esta medida en su proceso (ej. limitaciones técnicas, inviabilidad económica validada, etc.)..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #dc3545',
                                    borderRadius: '6px',
                                    minHeight: '100px',
                                    fontSize: '0.95rem',
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="actions" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={handlePrevStep}
                    disabled={activeStep === 0}
                    style={{
                        backgroundColor: 'white',
                        color: '#64748b',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '1rem',
                        cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                        opacity: activeStep === 0 ? 0.5 : 1
                    }}
                >
                    &larr; Anterior
                </button>

                <button
                    onClick={handleNextStep}
                    disabled={!isCurrentValid}
                    style={{
                        backgroundColor: isCurrentValid ? 'var(--color-primary)' : '#ccc',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '1rem',
                        cursor: isCurrentValid ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {isLastStep ? 'Validar Final y Continuar ✨' : 'Siguiente Medida &rarr;'}
                </button>
            </div>
        </StepCard>
    );
};
