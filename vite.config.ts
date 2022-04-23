import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

const localEnabled = process.env.USE_MOCK === 'true'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    viteMockServe({
      mockPath: './mock',
      localEnabled: localEnabled,
      prodEnabled: false,
      injectCode: `
         import { setupProdMockServer } from './mockProdServer';
         setupProdMockServer();
      `,
      logger: true,
      supportTs: true,
    }),
  ],
})
