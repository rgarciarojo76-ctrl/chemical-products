import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="layout">
            <main className="container" style={{
                flex: 1,
                paddingTop: 'var(--spacing-xl)',
                paddingBottom: 'var(--spacing-xl)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
