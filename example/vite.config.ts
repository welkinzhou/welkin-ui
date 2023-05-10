import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mdPlugin from './src/plugins/rollup-plugin-md/index'

import path from 'path'

function resolve(relativePath: string) {
  return path.resolve(__dirname, relativePath)
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    mdPlugin(),
    vue({
      include: [/\.vue$/, /\.md$/] // <--
    })
  ],
  // 配置 path alias
  resolve: {
    alias: {
      '@': resolve('src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    host: '0.0.0.0'
  }
})
