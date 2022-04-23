import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

const mockEnabled = process.env.MOCK_ENABLED === 'true'

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
      localEnabled: mockEnabled,
      prodEnabled: false,
      injectCode: `
         import { setupProdMockServer } from './mockProdServer';
         setupProdMockServer();
      `,
      logger: true,
      supportTs: true,
    }),
  ],
  server: {
    proxy: mockEnabled
      ? {}
      : {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
  },
})
