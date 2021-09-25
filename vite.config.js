import dotenv from 'dotenv';
dotenv.config();

import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import ssr from 'vite-plugin-ssr/plugin';

const { PORT = 3001 } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), ssr()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist/app',
  },
});
