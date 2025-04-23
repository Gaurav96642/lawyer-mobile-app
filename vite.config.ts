import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add proper build configuration for web deployment
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      // External packages that shouldn't be bundled for Vercel deployment
      external: process.env.VERCEL ? [
        '@capacitor/core',
        '@capacitor/ios',
        '@capacitor/android',
        '@capacitor/splash-screen',
        '@capacitor/push-notifications'
      ] : []
    }
  },
  // Define environment variables that should be available in the browser
  define: {
    // Make sure these are properly stringified
    'import.meta.env.VITE_VERCEL': JSON.stringify(process.env.VERCEL || 'true'),
    'import.meta.env.VITE_VERCEL_URL': JSON.stringify(process.env.VERCEL_URL || ''),
    // Keep these for Node.js environment during build
    'process.env.VERCEL': JSON.stringify(process.env.VERCEL || 'true'),
    'process.env.VERCEL_URL': JSON.stringify(process.env.VERCEL_URL || '')
  }
}));
