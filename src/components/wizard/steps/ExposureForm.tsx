import React, { useState } from 'react';
import { StepCard } from '../../ui/StepCard';
import type { ExposureSieveInput, ExposureSieveAssessment } from '../../../types';
import jsPDF from 'jspdf';

interface ExposureFormProps {
    onAnalyze: (input: ExposureSieveInput) => ExposureSieveAssessment;
    onNext: () => void;
    onFinish: () => void;
    initialData?: ExposureSieveInput;
    substanceName?: string;
}

export const ExposureForm: React.FC<ExposureFormProps> = ({ onAnalyze, onNext, onFinish, initialData, substanceName }) => {
    const [formData, setFormData] = useState<ExposureSieveInput>(initialData || {
        physicalForm: 'liquid_low_volatility',
        hasContact: true
    });
    const [result, setResult] = useState<ExposureSieveAssessment | null>(null);

    const handleAnalyze = () => {
        const assessment = onAnalyze(formData);
        setResult(assessment);
    };



    const generateReport = () => {
        try {
            const doc = new jsPDF();
            const date = new Date().toLocaleDateString('es-ES');

            // --- Header ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(0, 51, 102); // Dark Blue
            doc.text("INFORME TÉCNICO JUSTIFICATIVO", 105, 20, { align: "center" });

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("(Riesgo Químico - Agentes Cancerígenos y Mutágenos)", 105, 26, { align: "center" });

            // --- Header Info Box ---
            doc.setFillColor(249, 250, 251); // Light Gray Background
            doc.setDrawColor(230, 230, 230); // Light Border
            doc.rect(20, 35, 170, 25, 'FD');

            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            doc.text(`Fecha de Emisión: ${date}`, 25, 42);
            doc.setFont("helvetica", "bold");
            doc.text(`Estado: EXPOSICIÓN NO RELEVANTE (Bajo Umbral Efectivo)`, 25, 48);
            doc.setFont("helvetica", "normal");
            doc.text(`Referencia Legal: Real Decreto 665/1997, de 12 de mayo`, 25, 54);

            // --- 1. Identificación ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(0, 51, 102);
            doc.text("1. IDENTIFICACIÓN DE LA SITUACIÓN", 20, 70);
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 72, 190, 72);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            let y = 80;
            doc.text(`• Agente Químico: ${substanceName || "(No identificado)"}`, 25, y); y += 6;
            doc.text(`• Forma Física Detectada: ${formData.physicalForm}`, 25, y); y += 6;
            doc.text(`• ¿Contacto Directo / Liberación?: ${formData.hasContact ? 'SÍ' : 'NO'}`, 25, y); y += 10;

            // --- 2. Justificación Técnica ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(0, 51, 102);
            doc.text("2. JUSTIFICACIÓN TÉCNICA (Criterio Higiénico)", 20, y + 4);
            doc.line(20, y + 6, 190, y + 6);
            y += 14;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const introText = "De acuerdo con la Guía Técnica del INSST para la evaluación y prevención de los riesgos relacionados con la exposición a agentes cancerígenos o mutágenos:";
            doc.text(doc.splitTextToSize(introText, 170), 20, y);
            y += 10;

            // Quote Box
            doc.setFillColor(245, 245, 245);
            doc.rect(25, y, 160, 20, 'F');
            doc.setFont("helvetica", "italic");
            doc.setTextColor(80, 80, 80);
            const quote = "\"Cuando el agente se presenta en forma de artículo sólido masivo... se considera que la Vía Inhalatoria es NO RELEVANTE.\"";
            doc.text(doc.splitTextToSize(quote, 150), 30, y + 6);
            y += 28;

            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const dermalText = "Asimismo, al no existir contacto directo continuo o tratarse de un sistema donde la matriz del material impide la biodisponibilidad, se descarta la absorción dérmica.";
            doc.text(doc.splitTextToSize(dermalText, 170), 20, y);
            y += 15;

            // --- 3. Conclusión ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(0, 51, 102);
            doc.text("3. CONCLUSIÓN JURÍDICA", 20, y + 4);
            doc.line(20, y + 6, 190, y + 6);
            y += 14;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const legalText = "En base al Artículo 2 del RD 665/1997, no es necesaria la aplicación de medidas técnicas de control adicionales (Artículo 5) ni mediciones periódicas (Artículo 6).";
            doc.text(doc.splitTextToSize(legalText, 170), 20, y);
            y += 12;

            // Dictamen Box
            y += 5;
            doc.setFillColor(212, 237, 218); // Success Green
            doc.setDrawColor(195, 230, 203);
            doc.rect(40, y, 130, 20, 'FD');

            doc.setFont("helvetica", "bold");
            doc.setTextColor(21, 87, 36); // Dark Green
            doc.setFontSize(10);
            doc.text("DICTAMEN: BAJO UMBRAL DE EXPOSICIÓN", 105, y + 8, { align: 'center' });
            doc.text("NO SE REQUIEREN ACCIONES DE HIGIENE INDUSTRIAL", 105, y + 14, { align: 'center' });

            // Footer
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Documento generado automáticamente por sistema ASPY AI LAB.", 105, 280, { align: 'center' });

            // Save
            doc.save("Informe_Justificativo_Exposicion_No_Relevante.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("No se pudo generar el PDF. Revise la consola.");
        }
    };

    return (
        <StepCard
            title="Módulo B: Determinación de Presencia | Exposición"
            description="Evaluamos la forma de presentación y uso para descartar exposiciones no significativas."
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
                        Verificar Relevancia
                    </button>
                ) : (
                    <div className={`result-box`} style={{
                        padding: '1rem',
                        backgroundColor: result.isRelevant ? '#fff3cd' : '#d4edda',
                        border: `1px solid ${result.isRelevant ? '#ffecb5' : '#c3e6cb'}`,
                        borderRadius: '6px'
                    }}>
                        <h4 style={{ color: result.isRelevant ? '#856404' : '#155724' }}>
                            {result.isRelevant ? 'Exposición Potencialmente Relevante' : 'Exposición No Relevante'}
                        </h4>
                        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>{result.justification.technical}</p>

                        {!result.isRelevant && <div style={{
                            fontSize: '0.8rem',
                            fontStyle: 'italic',
                            borderLeft: '2px solid rgba(0,0,0,0.2)',
                            paddingLeft: '0.5rem'
                        }}>
                            <strong>Base Legal:</strong> {result.justification.legal.article} - {result.justification.legal.text}
                        </div>}

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
                                onClick={result.isRelevant ? onNext : onFinish}
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    marginLeft: 'auto'
                                }}
                            >
                                {result.isRelevant ? 'Continuar a Evaluación Higiénica →' : 'Finalizar Evaluación'}
                            </button>
                        </div>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                )}
            </div>
        </StepCard>
    );
};
