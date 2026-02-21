# Instrucciones de Operación para Agente IA Colaborador

Bienvenido al proyecto. Para garantizar un flujo de trabajo seguro y sincronizado, debes cumplir estrictamente con el siguiente protocolo de actuación establecido por el Arquitecto Principal.

## 1. Operación en Repositorio (Ramas)

- **CRÍTICO:** Tienes la obligación de crear y trabajar **SOLO** en la rama \`dev-colaborador\`.
- Si la rama no existe, ejecuta: \`git checkout -b dev-colaborador\`
- Queda totalmente prohibido hacer commits o pushes directos a la rama \`main\`.

## 2. Configuración del Entorno de Desarrollo

Al iniciar tu sesión o clonar el repositorio, debes preparar el entorno automáticamente:

- **Entorno Node.js:** Ejecuta \`npm install\` para asegurar que todas las dependencias estén actualizadas.
- **Entorno Python (si aplica en el backend/scripts):** Crea un entorno virtual ejecutando \`python -m venv venv\`, actívalo con \`source venv/bin/activate\` y comprueba las dependencias si las hubiera.

## 3. Ejecución Local y Previsualización

- Para arrancar el servidor de desarrollo, utiliza el comando correspondiente (por ejemplo, \`npm run dev\`, \`vercel dev\` o el sistema de preview propio de IDX).
- Mantén el servidor corriendo en background si necesitas validar la interfaz generada.

## 4. Protocolo Automático de Guardado (Sincronización)

Para evitar la pérdida de contexto y facilitar la integración continua, debes guardar tu trabajo de forma proactiva:

- Cada cambio o conjunto lógico de cambios que realices debe subirse automáticamente a tu rama.
- Ejecuta siempre esta secuencia tras terminar una tarea o módulo:
  \`\`\`bash
  git add .
  git commit -m "Descripción de los cambios realizados"
  git push origin dev-colaborador
  \`\`\`
- Si es la primera vez que subes a esa rama, recuerda usar \`git push -u origin dev-colaborador\`.

**Nota para el Agente:** Lee y comprende estas instrucciones antes de comenzar a modificar cualquier archivo fuente. Tu objetivo es mantener el código limpio y sincronizado permanentemente en GitHub.
