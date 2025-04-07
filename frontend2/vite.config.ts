import path from "path"
import UnoCSS from 'unocss/vite';

import solid from 'vite-plugin-solid';
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [solid(), UnoCSS()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src")
    }
  }
})
