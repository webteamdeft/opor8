import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  loadEnv(mode, '.', '');

  return {
    server: {
      host: '192.168.0.60',   // bind to your local IP
      port: 3012,             // Vite default port
      strictPort: true,       // fail if port is busy (recommended)
      hmr: {
        host: '192.168.0.60',
        port: 3012,
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
