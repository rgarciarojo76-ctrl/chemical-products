import React from 'react';

export type TrafficStatus = 'safe' | 'warning' | 'danger' | 'neutral' | 'info';

interface TrafficLightProps {
    status: TrafficStatus;
    text: string;
    icon?: string;
    className?: string;
    size?: 'sm' | 'md';
}

const STYLES = {
    safe: { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' }, // Green
    warning: { bg: '#fef9c3', color: '#854d0e', border: '#fde047' }, // Yellow
    danger: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' }, // Red
    neutral: { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' }, // Gray
    info: { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' }     // Blue
};

export const TrafficLight: React.FC<TrafficLightProps> = ({
    status,
    text,
    icon,
    className = '',
    size = 'md'
}) => {
    const style = STYLES[status];
    const padding = size === 'sm' ? '0.25rem 0.75rem' : '0.5rem 1rem';
    const fontSize = size === 'sm' ? '0.75rem' : '0.875rem';

    return (
        <div className={className} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding,
            backgroundColor: style.bg,
            color: style.color,
            border: `1px solid ${style.border}`,
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize,
            lineHeight: 1
        }}>
            {icon && <span>{icon}</span>}
            <span>{text}</span>
        </div>
    );
};
