import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'client',
  plugins: [
    react({
      jsxRuntime: 'classic'
    })
  ],
  base: process.env.NODE_ENV === 'production' ? '/sapien-wars/' : '/',
  publicDir: '../public',
  build: {
    outDir: '../build',
    emptyOutDir: true
  },
  esbuild: {
    loader: 'jsx',
    include: /\.[jt]sx?$/,
  },
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
      MAPBOX_TOKEN: process.env.MAPBOX_TOKEN
    }
  }
})
