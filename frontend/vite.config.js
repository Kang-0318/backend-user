import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',  // IPv6(::1) 대신 IPv4만 사용
    port: 3001,         // 5173 대신 3001
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 백엔드 포트
        changeOrigin: true,
      },
    },
  },
})
