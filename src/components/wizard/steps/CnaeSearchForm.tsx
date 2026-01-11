import React, { useState, useMemo } from 'react';
import { StepCard } from '../../ui/StepCard';
import { ChemicalImage } from '../../ui/ChemicalImage';
import { CNAE_DATA } from '../../../data/cnaeData';
import type { CnaeEntry } from '../../../data/cnaeData';

interface CnaeSearchFormProps {
    onNext: () => void;
    onSelectAgent?: (agentName: string) => void;
}

export const CnaeSearchForm: React.FC<CnaeSearchFormProps> = ({ onNext, onSelectAgent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCnae, setSelectedCnae] = useState<CnaeEntry | null>(null);

    const filteredCnae = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2) return [];
        const lowerTerm = searchTerm.toLowerCase();
        return CNAE_DATA.filter(entry =>
            entry.code.includes(lowerTerm) ||
            entry.description.toLowerCase().includes(lowerTerm)
        ).slice(0, 10); // Limit results
    }, [searchTerm]);

    const handleSelectCnae = (entry: CnaeEntry) => {
        setSelectedCnae(entry);
    };

    const handleSelectAgent = (agentName: string) => {
        if (onSelectAgent) {
            onSelectAgent(agentName);
        }
    };

    return (
        <StepCard
            title={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>Buscador de Productos Químicos Cancerígenos por Actividad</span>
                    <a
                        href="https://www.insst.es/agentes-quimicos-infocarquim"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: '0.85rem',
                            fontWeight: 'normal',
                            color: '#666',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            alignSelf: 'flex-start'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                        <span>ℹ️ Fuente: Base Datos INSST InfoCarquim</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                </div>
            }
            description="Identifica posibles agentes cancerígenos asociados a la actividad del cliente antes de la visita. Una vez allí, confirma su presencia y solicita las Fichas de Datos de Seguridad (FDS) para proceder con la evaluación"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Search Input */}
                <div className="form-group">
                    <label style={{ fontWeight: 600, color: '#003366', display: 'block', marginBottom: '0.5rem' }}>
                        Buscar por Código CNAE o Descripción de la Actividad:
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedCnae(null); // Reset selection on new search
                        }}
                        placeholder="Ej: 4332 o Carpintería"
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            fontSize: '1rem'
                        }}
                    />
                    <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                        Introduce al menos 2 caracteres para buscar.
                    </small>
                </div>

                {/* Results List */}
                {searchTerm.length >= 2 && !selectedCnae && (
                    <div style={{ border: '1px solid #eee', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                        {filteredCnae.length === 0 ? (
                            <div style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>
                                No se encontraron actividades.
                            </div>
                        ) : (
                            filteredCnae.map(entry => (
                                <div
                                    key={entry.code}
                                    onClick={() => handleSelectCnae(entry)}
                                    style={{
                                        padding: '12px',
                                        borderBottom: '1px solid #eee',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        backgroundColor: '#fff'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                >
                                    <span style={{ fontWeight: 'bold', color: '#0056b3' }}>{entry.code}</span>
                                    <span style={{ marginLeft: '10px', color: '#333' }}>{entry.description}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Selected CNAE Details */}
                {selectedCnae && (
                    <div className="fade-in" style={{ backgroundColor: '#f0f7ff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #cce5ff' }}>
                        <h3 style={{ marginTop: 0, color: '#003366', fontSize: '1.1rem' }}>
                            {selectedCnae.code} - {selectedCnae.description}
                        </h3>

                        <h4 style={{ color: '#555', marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                            Agentes Cancerígenos/Mutágenos Potenciales (Base de Datos INSST):
                        </h4>

                        <div style={{ display: 'grid', gap: '0.5rem' }}>

                            {/* ... (inside the map loop) */}

                            {selectedCnae.agents.map((agent, idx) => (
                                <div key={idx} style={{
                                    backgroundColor: '#fff',
                                    padding: '0.75rem 1rem', // Reduced padding
                                    borderRadius: '6px',
                                    border: '1px solid #e0e0e0',
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}>

                                    {/* New Image Column - Compact */}
                                    <div style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                                        <ChemicalImage agentName={agent.name} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <strong style={{ fontSize: '1rem', color: '#333' }}>{agent.name}</strong>

                                                {/* Compact Badges */}
                                                {/* Educational Badges (Junior Techs) */}
                                                {agent.context.includes('Carc. 1A') && (
                                                    <span style={{ backgroundColor: '#dc3545', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        ☢️ Cancerígeno 1A (Probado en Humanos)
                                                    </span>
                                                )}
                                                {agent.context.includes('Carc. 1B') && (
                                                    <span style={{ backgroundColor: '#fd7e14', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        ☣️ Cancerígeno 1B (Supuesto en Humanos)
                                                    </span>
                                                )}
                                                {agent.context.includes('Muta. 1') && (
                                                    <span style={{ backgroundColor: '#6f42c1', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        🧬 Mutágeno (Daño Genético Hereditario)
                                                    </span>
                                                )}
                                                {agent.context.includes('Repr. 1') && (
                                                    <span style={{ backgroundColor: '#e83e8c', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        👶 Tóxico para la Reproducción
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSelectAgent(agent.name)}
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: '0.85rem',
                                            backgroundColor: 'var(--color-primary)', // Use brand color
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Evaluar →
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                            <button
                                onClick={() => setSelectedCnae(null)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #999',
                                    color: '#666',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginRight: '1rem'
                                }}
                            >
                                Volver a buscar
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                        ¿No encuentras tu actividad o ya conoces el agente?
                    </p>
                    <button
                        onClick={onNext}
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Saltar este paso e ir a Identificación Manual
                    </button>
                </div>
            </div>
        </StepCard >
    );
};
