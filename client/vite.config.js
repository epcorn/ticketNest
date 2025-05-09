import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/api/": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
