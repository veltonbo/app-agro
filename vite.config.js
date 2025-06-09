import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base path para produção (útil para GitHub Pages)
  base: './',
    // Configuração para pré-bundling de módulos para desenvolvimento
  optimizeDeps: {
    include: [
      'bootstrap',
      'bootstrap-icons',
      '@tensorflow/tfjs',
      '@tensorflow-models/mobilenet',
      'chart.js/auto'
    ]
  },
  
  // Config de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  
  // Config de servidor de desenvolvimento
  server: {
    port: 3000,
    open: true,
    cors: true
  },  // Configuração adicional para o build
});
