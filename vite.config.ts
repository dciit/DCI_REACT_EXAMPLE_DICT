import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
  plugins: [react()],
  base: `aps/`,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
