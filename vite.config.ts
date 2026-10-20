import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    css: {
      postcss: {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            const norm = id.split('\\').join('/');
            if (norm.includes('/three/') || norm.includes('@react-three/') || norm.includes('/three-stdlib/')) {
              return 'three';
            }
            if (norm.includes('/motion/') || norm.includes('/motion-dom/') || norm.includes('/motion-utils/') || norm.includes('/framer-motion/')) return 'motion';
            if (norm.includes('/lucide-react/')) return 'icons';
            if (norm.includes('/react-dom/') || norm.includes('/react/') || norm.includes('/scheduler/')) {
              return 'react';
            }
            return 'vendor';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
