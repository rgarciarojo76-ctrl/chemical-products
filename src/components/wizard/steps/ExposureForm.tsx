import React, { useState } from 'react';
import { StepCard } from '../../ui/StepCard';
import type { ExposureInput, ExposureAssessment } from '../../../types';

interface ExposureFormProps {
    onAnalyze: (input: ExposureInput) => ExposureAssessment;
    onNext: () => void;
    initialData?: ExposureInput;
    substanceName?: string;
}

export const ExposureForm: React.FC<ExposureFormProps> = ({ onAnalyze, onNext, initialData, substanceName }) => {
    const [formData, setFormData] = useState<ExposureInput>(initialData || {
        physicalForm: 'liquid_low_volatility',
        hasContact: true,
        labResult: undefined,
        lod: undefined
    });
    const [result, setResult] = useState<ExposureAssessment | null>(null);

    const handleAnalyze = () => {
        const assessment = onAnalyze(formData);
        setResult(assessment);
    };

    const generateReport = () => {
        const date = new Date().toLocaleDateString('es-ES');
        // Construct HTML Report for better formatting (Arial 10) and Google Docs compatibility
        const content = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.5; color: #000; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 20px; color: #003366; }
                    h2 { font-size: 11pt; font-weight: bold; margin-top: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px; color: #003366; }
                    .header-info { margin-bottom: 20px; border: 1px solid #eee; padding: 10px; background-color: #f9f9f9; }
                    .legal-quote { font-style: italic; background-color: #f0f0f0; padding: 10px; border-left: 3px solid #666; margin: 10px 0; }
                    .dictamen { font-weight: bold; color: #155724; background-color: #d4edda; padding: 10px; border: 1px solid #c3e6cb; text-align: center; margin-top: 10px; }
                    .footer { margin-top: 30px; font-size: 8pt; color: #666; text-align: center; border-top: 1px solid #eee; pt: 10px; }
                    ul { margin-top: 5px; margin-bottom: 10px; }
                    li { margin-bottom: 3px; }
                </style>
            </head>
            <body>
                <h1>INFORME TÉCNICO JUSTIFICATIVO DE EXPOSICIÓN NO RELEVANTE<br><span style="font-size: 10pt; font-weight: normal;">(Riesgo Químico - Agentes Cancerígenos y Mutágenos)</span></h1>
                
                <div class="header-info">
                    <p><strong>Fecha de Emisión:</strong> ${date}</p>
                    <p><strong>Estado:</strong> EXPOSICIÓN NO RELEVANTE (Bajo Umbral Efectivo)</p>
                    <p><strong>Referencia Legal:</strong> Real Decreto 665/1997, de 12 de mayo</p>
                </div>

                <h2>1. IDENTIFICACIÓN DE LA SITUACIÓN</h2>
                <ul>
                    <li><strong>Agente Químico Evaluado:</strong> ${substanceName || "(No identificado)"}</li>
                    <li><strong>Forma Física Detectada:</strong> ${formData.physicalForm === 'solid_massive' ? 'Sólido Masivo / Aleación (Pieza Compacta) - Artículo' : formData.physicalForm}</li>
                    <li><strong>¿Contacto Directo / Liberación Intencional?:</strong> ${formData.hasContact ? 'SÍ' : 'NO'}</li>
                </ul>

                <h2>2. JUSTIFICACIÓN TÉCNICA (Criterio Higiénico)</h2>
                <p>De acuerdo con la <strong>Guía Técnica del INSST</strong> para la evaluación y prevención de los riesgos relacionados con la exposición a agentes cancerígenos o mutágenos:</p>
                
                <div class="legal-quote">
                    "Cuando el agente se presenta en forma de artículo sólido masivo (no pulvurulento) y no se realizan operaciones mecánicas agresivas (corte, lijado, soldadura) que pudieran liberar polvo, humos o aerosoles, se considera que la Vía Inhalatoria es <strong>NO RELEVANTE</strong>."
                </div>

                <p>Asimismo, al no existir contacto directo continuo o tratarse de un sistema donde la matriz del material impide la biodisponibilidad del agente, se descarta la absorción por vía dérmica en condiciones normales de uso.</p>

                <h2>3. CONCLUSIÓN JURÍDICA</h2>
                <p>En base al <strong>Artículo 2 del RD 665/1997</strong>, no es necesaria la aplicación de medidas técnicas de control adicionales (Artículo 5) ni mediciones periódicas (Artículo 6), siempre que se mantengan las condiciones de trabajo actuales.</p>

                <div class="dictamen">
                    DICTAMEN: BAJO UMBRAL DE EXPOSICIÓN<br>
                    NO SE REQUIEREN ACCIONES DE HIGIENE INDUSTRIAL
                </div>

                <div class="footer">
                    Este documento ha sido generado automáticamente por el sistema ASPY AI LAB para garantizar la trazabilidad de la evaluación.
                </div>
            </body>
            </html>
        `;

        // Create Blob and Download as HTML (best for Google Docs import vs .doc which assumes Word)
        const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Informe_Justificativo_Exposicion_No_Relevante.html');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <StepCard
            title="Módulo B: Tamiz de Exposición Relevante"
            description="Evaluamos si existe una exposición efectiva basada en la forma física y datos analíticos."
            icon="🛡️"
        >
            <div className="form-group mb-2">
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Forma Física del Agente</label>
                <select
                    value={formData.physicalForm}
                    onChange={e => setFormData({ ...formData, physicalForm: e.target.value as any })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="solid_massive">Sólido Masivo / Aleación (Pieza compacta)</option>
                    <option value="solid_dust">Sólido Pulvurulento / Polvo</option>
                    <option value="liquid_low_volatility">Líquido (Baja volatilidad)</option>
                    <option value="liquid_high_volatility">Líquido (Alta volatilidad / Aerosol)</option>
                    <option value="gas">Gas / Vapor</option>
                </select>
            </div>

            <div className="form-group mb-2">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={formData.hasContact}
                        onChange={e => setFormData({ ...formData, hasContact: e.target.checked })}
                    />
                    <span style={{ fontWeight: 600 }}>¿Existe contacto directo o liberación intencional?</span>
                </label>
                <p style={{ fontSize: '0.8rem', color: '#666', marginLeft: '1.5rem' }}>
                    Para sólidos masivos, desmarque si no hay tareas de corte, soldadura o calentamiento.
                </p>
            </div>

            {formData.samplingDetails && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#e6f4ea',
                    border: '1px solid #cce5d4',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                }}>
                    <h4 style={{ color: '#155724', marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📋</span> Datos de Referencia (Base de Datos)
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div><strong>Soporte:</strong> {formData.samplingDetails.support}</div>
                        <div><strong>Técnica:</strong> {formData.samplingDetails.technique}</div>
                        <div><strong>Caudal:</strong> {formData.samplingDetails.flowRate}</div>
                        <div><strong>Tiempo Mín:</strong> {formData.samplingDetails.minTime}</div>
                    </div>
                </div>
            )}

            {/* Strategy Helper Section */}
            <div className="form-group mb-4" style={{ backgroundColor: '#fff8e1', padding: '1rem', borderRadius: '8px', border: '1px solid #ffead0' }}>
                <h4 style={{ color: '#856404', marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🧠</span> Asistente de Estrategia (Criterio INSST)
                </h4>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>¿Cómo es la exposición durante la jornada?</label>
                    <select
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        onChange={(e) => {
                            // Simple logic to suggest strategy
                            const val = e.target.value;
                            let recommendation = "";
                            if (val === 'continuous') recommendation = "Muestreo de Larga Duración (VLA-ED) - Mínimo 80% de la jornada o representativo.";
                            if (val === 'peaks') recommendation = "Muestreo de Corta Duración (VLA-EC/STEL) en los momentos de pico + VLA-ED basal.";
                            if (val === 'variable') recommendation = "Muestreo Consecutivo de Larga Duración (Varios periodos representativos).";

                            // We can store this in a local state or just show it dynamically. 
                            // For simplicity, let's look at the result below or update specific instructions if needed.
                            // Ideally, we'd update formData to save this decision, but for UI guidance only:
                            const output = document.getElementById('strategy-output');
                            if (output) output.innerText = recommendation;
                        }}
                    >
                        <option value="">Seleccione tipo de proceso...</option>
                        <option value="continuous">Continuo y Homogéneo (Sin cambios bruscos)</option>
                        <option value="peaks">Variable con Picos de Exposición (Tareas puntuales)</option>
                        <option value="variable">Cíclico / Muy Variable (Ciclos repetitivos)</option>
                    </select>
                </div>

                <div id="strategy-output" style={{ fontWeight: 'bold', color: '#d39e00', minHeight: '1.5em' }}>
                    {/* Recommendation appears here */}
                </div>
            </div>

            <div className="form-group mb-4" style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Validación Analítica (Opcional)</h4>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 0.8, display: 'none' }}></div> {/* Spacer hack if needed, but flex handles it */}
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>1. VLA-ED (Referencia)</label>
                        <input
                            type="text"
                            value={formData.vla ? `${formData.vla} mg/m³` : '---'}
                            disabled
                            style={{ width: '100%', padding: '0.25rem', backgroundColor: '#eee', border: '1px solid #ccc', color: '#555' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>2. LOD Sugerido</label>
                        <input
                            type="number"
                            step="0.001"
                            placeholder="---"
                            value={formData.lod || ''}
                            style={{ width: '100%', padding: '0.25rem', backgroundColor: formData.lod ? '#f0fff4' : 'white' }}
                            onChange={e => setFormData({ ...formData, lod: e.target.value ? parseFloat(e.target.value) : undefined })}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>3. Resultado (mg/m³)</label>
                        <input
                            type="number"
                            step="0.001"
                            placeholder="Introducir dato..."
                            style={{ width: '100%', padding: '0.25rem', border: '2px solid var(--color-primary)', fontWeight: 'bold' }}
                            onChange={e => setFormData({ ...formData, labResult: e.target.value ? parseFloat(e.target.value) : undefined })}
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
                        Evaluar Exposición
                    </button>
                ) : (
                    <div className={`result-box`} style={{
                        padding: '1rem',
                        backgroundColor: result.isRelevant ? '#fff3cd' : '#d4edda',
                        border: `1px solid ${result.isRelevant ? '#ffecb5' : '#c3e6cb'}`,
                        borderRadius: '6px'
                    }}>
                        <h4 style={{ color: result.isRelevant ? '#856404' : '#155724' }}>
                            {result.isRelevant ? 'Exposición Relevante: Requiere Medidas (Art. 4-5)' : 'Exposición No Relevante (Bajo Umbral Efectivo)'}
                        </h4>
                        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>{result.justification.technical}</p>
                        <div style={{
                            fontSize: '0.8rem',
                            fontStyle: 'italic',
                            borderLeft: '2px solid rgba(0,0,0,0.2)',
                            paddingLeft: '0.5rem'
                        }}>
                            <strong>Base Legal:</strong> {result.justification.legal.article} - {result.justification.legal.text}
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* DOWNLOAD JUSTIFICATION REPORT BUTTON (Only for Non-Relevant) */}
                            {!result.isRelevant && (
                                <button
                                    onClick={generateReport}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <span>📄</span> Informe Justificativo
                                </button>
                            )}

                            <button
                                onClick={onNext}
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    marginLeft: 'auto' // Push to right
                                }}
                            >
                                {result.isRelevant ? 'Ir a Plan de Medidas' : 'Finalizar Evaluación'}
                            </button>
                        </div>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                )}
            </div>
        </StepCard>
    );
};
