import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Using jsdom for React components and general browser-like environment
    globals: true,
    // setupFiles: './vitest.setup.ts', // Optional: No setup file created for now
  },
  resolve: {
    alias: {
      '@': '/src', // Ensure this matches your tsconfig.json and Next.js setup
    },
  },
});
