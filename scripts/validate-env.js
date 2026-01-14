import fs from 'fs';
import path from 'path';

const envExamplePath = path.resolve(process.cwd(), '.env.example');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

// If no example file exists, nothing to validate against
if (!fs.existsSync(envExamplePath)) process.exit(0);

const parseEnv = (content) => content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => l.split('=')[0]);

// Parse keys from .env.example
const exampleKeys = parseEnv(fs.readFileSync(envExamplePath, 'utf-8'));

// If .env.local doesn't exist, force creation (coping manually is safer, but user script requested Copy instruction error)
// The user provided script exits with error if .env.local missing.
if (!fs.existsSync(envLocalPath)) {
    console.error('\x1b[31m⛔ ERROR: Falta el archivo .env.local.\x1b[0m');
    console.error('👉 Por favor, ejecuta: \x1b[36mcp .env.example .env.local\x1b[0m y rellena las claves.');
    process.exit(1);
}

const localKeys = parseEnv(fs.readFileSync(envLocalPath, 'utf-8'));
const missingKeys = exampleKeys.filter(key => !localKeys.includes(key));

if (missingKeys.length > 0) {
    console.log('\x1b[33m⚠️  Nuevas variables detectadas en .env.example. Sincronizando...\x1b[0m');

    const exampleLines = fs.readFileSync(envExamplePath, 'utf-8').split('\n');
    const linesToAdd = [];

    missingKeys.forEach(key => {
        // Find the line in example that starts with this key
        const line = exampleLines.find(l => l.trim().startsWith(`${key}=`));
        if (line) linesToAdd.push(line);
    });

    if (linesToAdd.length > 0) {
        fs.appendFileSync(envLocalPath, '\n# --- Auto-merged from .env.example ---\n' + linesToAdd.join('\n') + '\n');
        console.log(`\x1b[32m✅ Se han añadido ${missingKeys.length} variables nuevas a .env.local.\x1b[0m`);
        console.log('👉 \x1b[36mIMPORTANTE: Edita .env.local y configura sus valores antes de continuar.\x1b[0m');
        process.exit(1); // Exit to force user to check the values
    }
}

// All good
console.log('\x1b[32m✅ Validación de entorno correcta.\x1b[0m');
