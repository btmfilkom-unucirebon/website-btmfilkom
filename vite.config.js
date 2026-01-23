import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        departemen: resolve(__dirname, 'page/departemen.html'),
        publikasi: resolve(__dirname, 'page/publikasi.html'),
        layanan: resolve(__dirname, 'page/layanan.html'),
      },
    },
  },
});