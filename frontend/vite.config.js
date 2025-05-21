import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/user': 'http://localhost:4000',
      '/nilai': 'http://localhost:4000',
      '/matakuliah': 'http://localhost:4000',
    },
    // historyApiFallback is now properly enabled in server config
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/[^.]+$/, to: '/index.html' } // Any URL without a file extension redirects to index.html
      ]
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Improve SPA routing support
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['axios']
        }
      }
    }
  }
})
