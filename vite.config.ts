import { defineConfig } from 'vite';

// Static front end only: no backend, no server-side rendering. Built output
// is a plain dist/ folder deployable to GitHub Pages or any static host.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
