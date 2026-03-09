

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    sveltekit(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'pwa-192.png',
        'pwa-512.png',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: 'InterlinearAdri',
        short_name: 'InterlinearAdri',
        description: 'Interactive Greek interlinear New Testament with lexicon.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'any',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // cache des fichiers générés par build (JS/CSS/etc.)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}']
      }
    })
  ]
});