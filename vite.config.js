import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy routes local calls to the Heroku APIs, bypassing CORS entirely.
// In production you'd configure CORS headers on the FastAPI side instead.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-gnn': {
        target: 'https://blueberry-tiramisu-73294-90d4af1cd778.herokuapp.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api-gnn/, ''),
      },
      '/api-qsar': {
        target: 'https://cherry-tart-93383-f1cbb0ac50b6.herokuapp.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api-qsar/, ''),
      },
    },
  },
})
