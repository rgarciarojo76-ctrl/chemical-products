import React, { useState, useMemo } from 'react';
import { StepCard } from '../../ui/StepCard';
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
            title="Buscador de Agentes por Actividad (INSST)"
            description="Identifica posibles agentes cancerígenos asociados a tu actividad (CNAE) antes de comenzar."
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
                            {selectedCnae.agents.map((agent, idx) => (
                                <div key={idx} style={{
                                    backgroundColor: '#fff',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #e0e0e0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <strong>{agent.name}</strong>
                                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                                            {agent.context}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSelectAgent(agent.name)}
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: '0.8rem',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Evaluar este Agente →
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
        </StepCard>
    );
};
