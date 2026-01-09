import React from 'react';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main className="container" style={{
                flex: 1,
                paddingTop: 'var(--spacing-xl)',
                paddingBottom: 'var(--spacing-xl)'
            }}>
                {children}
            </main>
            <footer style={{
                textAlign: 'center',
                padding: 'var(--spacing-md)',
                fontSize: '0.8rem',
                color: 'var(--color-text-light)',
                borderTop: '1px solid var(--color-border)'
            }}>
                © {new Date().getFullYear()} ASPY Prevención - Motor de Decisión CMR (RD 665/1997)
            </footer>
        </div>
    );
};

export default Layout;
