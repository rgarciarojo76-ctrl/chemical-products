import React, { useState, useEffect } from 'react';

interface ChemicalImageProps {
    agentName: string;
    className?: string;
}

// Mapping from Spanish Generic Names to English/Chemical specific names for PubChem Search
const PUBCHEM_MAP: Record<string, string> = {
    'AMINA': 'Aniline', // Representative
    'ARSENICO': 'Arsenic',
    'CADMIO': 'Cadmium',
    'COBALTO': 'Cobalt',
    'CROMO VI': 'Chromium(VI) oxide',
    'NIQUEL': 'Nickel',
    'SILICE': 'Silicon dioxide',
    'AMIANTO': 'Asbestos', // Structure might be complex, but let's try
    'BERILIO': 'Beryllium',
    'HIDROC AROMATICOS': 'Benzene', // Representative
    'VAPOR ORGANICO': 'Toluene', // Representative
    'SULFATO DE DIMETILO': 'Dimethyl sulfate',
    'FORMALDEHIDO': 'Formaldehyde',
    'BENCENO': 'Benzene',
    'PLOMO': 'Lead',
    'MERCURIO': 'Mercury',
    'FITOSANITARIO': 'Glyphosate', // Common example, or leave generic
    'OXIDO DE ETILENO': 'Ethylene oxide',
    'TRICLOROETILENO': 'Trichloroethylene',
    'TETRACLOROETILENO': 'Tetrachloroethylene'
};

export const ChemicalImage: React.FC<ChemicalImageProps> = ({ agentName, className }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // 1. Clean and normalize name
        const cleanName = agentName.toUpperCase().trim()
            .replace(/\(.*\)/, '') // Remove (Inhalable) etc
            .trim();

        // 2. Lookup mapping or use direct name
        const searchName = PUBCHEM_MAP[cleanName] || cleanName;

        // 3. Construct URL
        // Using PubChem PUG REST API: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/.../PNG
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchName)}/PNG?image_size=300x300`;

        setImageUrl(url);
        setHasError(false);
    }, [agentName]);

    if (hasError || !imageUrl) {
        return (
            <div className={`chemical-placeholder ${className}`} style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '1px solid #eee',
                color: '#ccc',
                fontSize: '2rem'
            }}>
                🧪
            </div>
        );
    }

    return (
        <div className={className} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '6px', backgroundColor: 'white', padding: '2px' }}>
            <img
                src={imageUrl}
                alt={`Estructura de ${agentName}`}
                onError={() => setHasError(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    mixBlendMode: 'multiply' // Helps blend white background if needed
                }}
            />
        </div>

    );
};
