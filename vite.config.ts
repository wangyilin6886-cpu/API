import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // dev-only proxy to dodge browser CORS when calling DeepSeek
      '/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/deepseek/, ''),
      },
    },
  },
})
