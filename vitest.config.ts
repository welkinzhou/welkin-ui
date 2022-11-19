import { defineConfig } from "vitest/config";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [Vue(), vueJsx()],
  test: {
    environment: "jsdom",
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
});
