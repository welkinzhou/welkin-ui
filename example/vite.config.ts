import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Markdown from "vite-plugin-md";

import path from "path";

function resolve(relativePath: string) {
  return path.resolve(__dirname, relativePath);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // <--
    }),
    Markdown(),
  ],
  // 配置 path alias
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  server: {
    host: "0.0.0.0",
  },
});
