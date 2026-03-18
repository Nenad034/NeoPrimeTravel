import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api/solvex': {
        target: 'https://evaluation.solvex.bg',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/solvex/, '/iservice/integrationservice.asmx'),
      }
    }
  }
})
