# 🤝 Guía de Colaboración - Proyecto CMR (ASPY IA LAB)

Este proyecto forma parte de la suite de herramientas **ASPY IA LAB**. Sigue estos pasos para configurar tu entorno local.

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd luminescent-nadir
```

## 2. Instalar dependencias

Este proyecto utiliza **Node.js** y **Vite**. Asegúrate de tener Node instalado (v18+ recomendado).

```bash
npm install
```

## 3. Configurar variables de entorno

La aplicación está protegida por un sistema de **"Token Handshake"** (`Gatekeeper`). Necesitas configurar el secreto compartido.

1.  Copia el archivo de ejemplo:
    ```bash
    cp .env.example .env.local
    ```

2.  Edita `.env.local` y reemplaza el valor de `VITE_SHARED_SECRET`.
    *   👀 **Solicita la clave real al administrador del proyecto o a un compañero.**
    *   _(Valor de desarrollo por defecto: `ASPY-SECRET-HANDSHAKE-2026`)_

## 4. Levantar el entorno de desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`.

> **Nota:** Al abrir la app directamente, verás una pantalla de "Acceso Denegado". Esto es normal porque el Gatekeeper espera una firma en la URL.
> Para probar en local, puedes generar un enlace firmado usando el script auxiliar (si existe) o pedir una URL de prueba al equipo.

---
**Estructura del Proyecto:**
*   `src/components/wizard/`: Lógica principal del asistente paso a paso.
*   `src/utils/engineLogic.ts`: Motor de decisión normativa (RD 665/1997).
*   `src/components/ui/`: Componentes visuales compartidos (ChemicalImage, TrafficLight, etc.).
