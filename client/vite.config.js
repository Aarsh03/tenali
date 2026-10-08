/**
 * VITE BUILD CONFIGURATION - MAIN CLIENT
 *
 * Configuration file for Vite (build tool and development server) for the main Tenali client.
 * Defines how React components are built and how the development server proxies API requests.
 *
 * This is the unified entry point for the Tenali platform that aggregates multiple quiz modules.
 *
 * Build Configuration:
 * - React plugin: Enables JSX/React syntax support
 * - Base path: '/' (serves from root, no subdirectory)
 * - Outputs to dist directory after build
 *
 * Development Server:
 * - Host: 0.0.0.0 (accessible from any IP)
 * - Port: 5173 (standard Vite default port)
 * - Proxying: Redirects API calls to backend services on port 4000
 *
 * API Proxy Routes:
 * All API requests are proxied to a central backend at http://127.0.0.1:4000
 * This allows the dev server and different modules to be served from a single origin
 * without CORS issues during development.
 */

import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Base path is read from the VITE_BASE_PATH env var so deployments under a
  // subpath (e.g. /summership/) no longer need the `--base=/summership/` CLI flag.
  // Falls back to '/' for root deployments and local dev.
  base: '/',
  // Enable React support for JSX compilation
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['face-api.js'],
  },
  server: {
    host: 'localhost',
    port: 5173,
    // API proxy configuration: Forward API requests to backend services
    proxy: {
      '/api': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      '^/.*-api/?.*': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      '/riddles': { target: 'http://127.0.0.1:4000', changeOrigin: true },
      '/socket.io': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
