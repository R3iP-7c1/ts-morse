import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { rename } from 'fs';

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
      include: [resolve(__dirname, './src/ts-morse.ts')],
      outDir: 'dist',
      afterBuild: () => {
        rename(resolve(__dirname, './dist/ts-morse.d.ts'), resolve(__dirname, './dist/index.d.ts'), () => {})
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, './src/ts-morse.ts'),
      name: 'ts-morse',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: './dist'
  },
})