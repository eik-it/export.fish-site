// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://yourusername.github.io',
  // Uncomment and set if using a project repo (not username.github.io):
  // base: '/your-repo-name',
  vite: {
    plugins: [tailwindcss()]
  }
});