import { defineConfig } from 'vite';

export default defineConfig({
  // Base path para produção (útil para GitHub Pages)
  base: './',
  
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
  },
  
  // Otimizações
  optimizeDeps: {
    include: [
      '@tensorflow/tfjs',
      '@tensorflow-models/mobilenet'
    ]
  }
});
