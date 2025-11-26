import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  // IMPORTANT: this matches your GitHub Pages URL:
  // https://rbeget.github.io/barcelona-wine-club/
  base: '/barcelona-wine-club/',
  plugins: [react()],
  resolve: {
    alias: {
      // So imports like "@/components/..." work
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build', // This is what deploy.yml uploads
  },
  server: {
    port: 3000,
    open: true,
  },
});
