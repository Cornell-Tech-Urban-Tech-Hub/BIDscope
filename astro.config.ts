import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  site: 'https://bidspec.mfranchi.net',  // Repository name as base path
  base: '/', // Explicitly define base path for all site URLs
  trailingSlash: 'ignore',
  integrations: [sitemap(), react(), UnoCSS()],
  vite: {
    plugins: [],
    ssr: {
      noExternal: ['maplibre-gl', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/mapbox']
    },
    build: {
      dynamicImportVarsOptions: {
        warnOnError: true,
      },
      commonjsOptions: {
        include: [/node_modules/]
      }
    },
    optimizeDeps: {
      include: ['maplibre-gl', '@deck.gl/core', '@deck.gl/layers', '@deck.gl/mapbox'],
    }
  },
});