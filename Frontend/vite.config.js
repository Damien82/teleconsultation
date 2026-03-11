import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
    define: {
    global: "window",
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://teleconsultation-m2ii.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});