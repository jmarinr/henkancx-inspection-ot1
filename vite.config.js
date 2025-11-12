import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Configuración correcta para build y GitHub Pages
export default defineConfig({
  plugins: [react()],
  root: '.',               // asegúrate que el index.html está en la raíz
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  base: './'               // ruta relativa para GitHub Pages
})
