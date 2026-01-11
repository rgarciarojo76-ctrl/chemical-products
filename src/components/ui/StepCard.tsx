import React from 'react';

interface StepCardProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    children: React.ReactNode;
    status?: 'default' | 'success' | 'warning' | 'error';
}

export const StepCard: React.FC<StepCardProps> = ({
    title,
    description,
    icon,
    children,
    status = 'default'
}) => {
    const getBorderColor = () => {
        switch (status) {
            case 'success': return 'var(--color-safe)';
            case 'warning': return 'var(--color-warning)';
            case 'error': return 'var(--color-danger)';
            default: return 'var(--color-border)';
        }
    };

    return (
        <div className="card" style={{
            borderTop: `4px solid ${getBorderColor()}`,
            transition: 'all 0.3s ease'
        }}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="flex-center" style={{
                    justifyContent: 'flex-start',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-sm)'
                }}>
                    {icon && <span style={{ fontSize: '1.5rem' }}>{icon}</span>}
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{title}</h2>
                </div>
                {description && (
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
                        {description}
                    </p>
                )}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};
