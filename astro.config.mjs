// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://eik-it.github.io',
  base: '/export.fish-site',
  vite: {
    plugins: [tailwindcss()]
  }
});