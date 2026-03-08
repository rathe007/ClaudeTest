import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// BASE_PATH wird im GitHub-Actions-Workflow für GitHub Pages gesetzt (z. B. /ClaudeTest/)
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/',
})
