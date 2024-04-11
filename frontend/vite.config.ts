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
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), //the api route is just 'http:localhost:3000/'
      },
      "/postdata": {
        target: "http://localhost:3000/api/",
        changeOrigin: true, 
      },
      "/getdata": {
        target: "http://localhost:3000/api/",
        changeOrigin: true, 
      },
      "/updatedata": {
        target: "http://localhost:3000/api/",
        changeOrigin: true, 
      },
      "/favorites": {
        target: "http://localhost:3000/api/",
        changeOrigin: true, 
      },
      "/archive": {
        target: "http://localhost:3000/api/",
        changeOrigin: true,
      },
      "/ascending": {
        target: "http://localhost:3000/api/",
        changeOrigin: true,
      },
      "/descending": {
        target: "http://localhost:3000/api/",
        changeOrigin: true,
      }
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
