// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://eksportfiske.no',
  base: '',

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap({
    filter: (page) => !page.includes('/registrer/takk') && !page.includes('/qr')
  })]
});