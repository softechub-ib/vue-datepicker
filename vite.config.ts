import * as path from 'path';
import type { ViteUserConfig as VitestUserConfigInterface } from 'vitest/config';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';

const vitestConfig: VitestUserConfigInterface = {
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      include: ['**/src/components', '**/src/composables', '**/src/helpers'],
    },
  },
};

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      exclude: ['./src/main.ts', './src/App.vue'],
    }),
  ],
  test: vitestConfig.test,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueDatePicker',
      fileName: 'vue-datepicker',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
