// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Optional: Add aliases if needed
    },
  },
  optimizeDeps: {
    include: ['qrcode.react'], // Ensure Vite pre-bundles qrcode.react
  },
});