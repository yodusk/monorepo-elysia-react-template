import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type PluginOption } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      generatedRouteTree: './src/routeTree.gen.ts',
      routesDirectory: './src/pages',
      target: 'react',
    }) as PluginOption,
    tailwindcss() as PluginOption,
    react() as PluginOption,
  ],
  resolve: {
    alias: {
      '@commons': path.resolve(__dirname, '../../packages/commons/src'),
      settings: path.resolve(__dirname, 'src/settings.ts'),
    },
    dedupe: ['react', 'react-dom'],
  },
})
