# HenkanCX Synk v2.0

> Build: 2025-11-12T05:08:25.683424Z

## Requisitos
- Node 18+

## Desarrollo
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## GitHub Pages
El repositorio incluye `.github/workflows/deploy.yml`. Crea el repo, sube el proyecto a `main` y habilita **Pages → GitHub Actions**.

## Notas
- Login: ingresa cualquier código de técnico.
- Fecha ejecutada: se fija automáticamente al iniciar la inspección (no editable).
- Ubicación: se extrae automáticamente (GPS) sin botón.
- Formularios: un formulario por archivo. Los nombres de campos pueden ajustarse editando los JSON en `src/schemas/*` para que coincidan exactamente con tus plantillas.
