import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), TanStackRouterVite(), tailwindcss()],
  base: '/',
  server: {
    port: 5000
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
}))
