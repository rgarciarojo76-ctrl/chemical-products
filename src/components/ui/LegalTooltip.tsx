import React from 'react';

interface LegalTooltipProps {
    reference: string;
    tooltip?: string;
    className?: string;
}

export const LegalTooltip: React.FC<LegalTooltipProps> = ({ reference, tooltip, className = '' }) => {
    return (
        <span
            className={className}
            title={tooltip || reference}
            style={{
                cursor: 'help',
                color: '#64748b',
                borderBottom: '1px dashed #94a3b8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.85em',
                fontStyle: 'italic'
            }}
        >
            <span style={{ fontSize: '1.1em' }}>⚖️</span>
            <span>{reference}</span>
        </span>
    );
};
