# Ideario

App personal para capturar todas tus ideas y proyectos: en qué estado están, quién está relacionado, qué tareas quedan por hacer y cuáles son los siguientes pasos.

Es una **PWA** (Progressive Web App): se instala en el iPhone directamente desde Safari, sin pasar por la App Store, sin Mac ni Xcode. Todos los datos se guardan **solo en tu dispositivo** (no hay servidor ni cuentas).

## Funcionalidades

- **Ideas y proyectos**: título, descripción, estado (Idea → Planificando → En marcha → En pausa → Completado / Archivado), prioridad, etiquetas, fechas de inicio y límite.
- **Siguiente paso** destacado en cada proyecto, para saber siempre qué toca hacer a continuación.
- **Tareas** por proyecto, con checklist y progreso.
- **Personas relacionadas** con cada proyecto (rol, contacto), y un listado global de personas.
- **Backup**: exporta e importa todos tus datos en un archivo JSON desde Ajustes.
- **Funciona sin conexión** gracias al service worker.

## Instalar en el iPhone

1. Abre la URL de la app en Safari (ver más abajo).
2. Toca el botón de compartir (el cuadrado con la flecha hacia arriba).
3. Elige **"Añadir a pantalla de inicio"**.
4. Listo: aparece un icono propio y se abre a pantalla completa, como una app nativa.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Despliegue

El workflow en `.github/workflows/deploy.yml` publica automáticamente el contenido de `dist/` en GitHub Pages en cada push a `main`. Para activarlo:

1. En GitHub, ve a **Settings → Pages** de este repositorio y elige **Source: GitHub Actions**.
2. Haz push a `main` (o ejecuta el workflow manualmente desde la pestaña Actions).
3. La app quedará disponible en `https://newdevelop20.github.io/Aplicaciones-IA/`.

## Regenerar los iconos

Los iconos de la app (`public/icons/`) se generan con Playwright a partir de `scripts/gen-icons.mjs`:

```bash
node scripts/gen-icons.mjs
```

## Stack

- React + TypeScript + Vite
- Tailwind CSS 4
- vite-plugin-pwa (manifest + service worker)
- Persistencia en `localStorage`, sin backend
