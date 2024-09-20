import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      }
    }
  },
  plugins: [
    dts({
      include: [resolve(__dirname, './src/index.ts')],
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'ts-morse',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: './dist'
  },
})