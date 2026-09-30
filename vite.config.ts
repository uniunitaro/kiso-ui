import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // The preview launcher passes a free port in PORT; plain `pnpm dev` keeps Vite's default.
    ...(process.env.PORT && { port: Number(process.env.PORT), strictPort: true }),
    watch: { ignored: ['**/.test-workspaces/**', '**/artifacts/**'] },
  },
})
