// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    cors: true
  },
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'FritzboxCallCard',
      fileName: 'fritzbox-call-card',
      formats: ['es']
    },
    rollupOptions: {
      external: ["lit"]
    }
  }
});