import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/barcelona-wine-club/',  
  plugins: [react()],
  build: { outDir: 'build' },
  server: { port: 3000 }
});
