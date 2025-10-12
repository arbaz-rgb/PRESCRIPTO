import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import scrollbarHide from "tailwind-scrollbar-hide";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      plugins: [scrollbarHide], // ✅ this is the correct modern syntax
    }),
  ],
  server: { port: 5174 },
});
