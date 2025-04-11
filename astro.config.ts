import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  site: 'https://cornell-tech-urban-tech-hub.github.io',
  base: '/BIDspec',  // Repository name as base path
  trailingSlash: 'ignore',
  integrations: [sitemap(), react(), UnoCSS()],
  vite: {
    plugins: [],
    ssr: {
      noExternal: ['maplibre-gl', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/mapbox']
    },
    optimizeDeps: {
      include: ['maplibre-gl', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/mapbox'],
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/]
      }
    }
  },
});