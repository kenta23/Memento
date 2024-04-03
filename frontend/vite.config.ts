import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    external: true,
  },

  server: {
    cors: true,
    origin: "http://localhost:3000",
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), //the api route is just 'http:localhost:3000/'
      },
      "/users": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      // Wildcard path matching
      "/(.*)": {
        target: "http://localhost:3000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/(.*?)(\/|$)/, "$1"),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/backend": path.resolve(__dirname, "../backend/*"),
    },
  },
});
