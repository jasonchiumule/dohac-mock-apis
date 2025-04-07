# Solidjs Vite Bun
- bun create vite, choose solid-ts
- remove the css files that comes with the installation
- get node-types `bun add -D @types/node`
- tilde alias in 3 places, vite.config.ts, tsconfig.json and tsconfig.app.json
- solidrouter install

- get unocss, wind3, fonts and icons - a faster tailwind
- https://unocss.dev/integrations/vite#solid
- bun add -D unocss @unocss/preset-wind3 @unocss/preset-web-fonts @iconify/json
- https://unocss.dev/presets/icons
- https://unocss.dev/presets/web-fonts

- using zag for components https://zagjs.com/overview/installation

zag seemed lighter and a bit more fun than kobalte


## Tilde alias
```ts
// vite.config.ts
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
```

```json
// tsconfig.json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": [
        "./src/*"
      ]
    }
  }
}
```

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": [
      "ES2020",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "~/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "src"
  ]
}

```
