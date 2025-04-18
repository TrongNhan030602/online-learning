import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000, // Đổi cổng từ 5173 -> 3000
    host: "0.0.0.0", // Đảm bảo container có thể truy cập
  },
});
