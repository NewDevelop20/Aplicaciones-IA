import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/Aplicaciones-IA/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        id: '/Aplicaciones-IA/',
        name: 'Ideario',
        short_name: 'Ideario',
        description: 'Tus ideas y proyectos personales: estado, personas, tareas y próximos pasos.',
        start_url: '/Aplicaciones-IA/',
        scope: '/Aplicaciones-IA/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0a0a0c',
        theme_color: '#0a0a0c',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },
    }),
  ],
});
