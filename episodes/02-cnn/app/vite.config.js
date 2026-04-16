import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path: in production, the app is deployed under the monorepo's
// subpath on GitHub Pages. In dev, base is '/'.
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
})
