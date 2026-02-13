import { defineConfig, type PluginOption } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/pages',
      generatedRouteTree: './src/routeTree.gen.ts',
    }) as PluginOption,
    react() as PluginOption,
  ],
  resolve: {
    alias: {
      '@commons': path.resolve(__dirname, '../../packages/commons/src'),
    },
    dedupe: ['react', 'react-dom'],
  },
})
