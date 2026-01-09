import React from 'react';

interface WizardContainerProps {
    currentStep: number;
    totalSteps: number;
    title: string;
    children: React.ReactNode;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
    currentStep,
    totalSteps,
    title,
    children
}) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--spacing-xs)',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-light)',
                    fontWeight: 500
                }}>
                    <span>Paso {currentStep} de {totalSteps}</span>
                    <span>{title}</span>
                </div>
                <div style={{
                    height: '8px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'var(--color-primary)',
                        transition: 'width 0.5s ease-in-out'
                    }} />
                </div>
            </div>

            {/* Content */}
            <div className="wizard-content">
                {children}
            </div>
        </div>
    );
};
