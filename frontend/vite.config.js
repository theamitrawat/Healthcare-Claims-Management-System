import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the React frontend.
// The react() plugin is required so Vite can compile JSX files.
export default defineConfig({
  plugins: [react()],
});
