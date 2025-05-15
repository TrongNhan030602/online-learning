import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url"; // <- thêm
import { dirname } from "path"; // <- thêm

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // <- tạo thủ công

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
