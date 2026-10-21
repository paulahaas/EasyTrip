import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@easytrip/shared': path.resolve(import.meta.dirname, '../../packages/shared/src/index.ts'),
    },
  },
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        // Bibliotecas base em arquivos próprios: ficam em cache entre deploys
        // e são baixadas em paralelo com o código do site.
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\/](react|react-dom|scheduler)[\/]/ },
            { name: 'tanstack', test: /node_modules[\/]@tanstack[\/]/ },
          ],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
