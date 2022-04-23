import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

declare interface ViteEnv {
  VITE_USE_MOCK: boolean
  VITE_PUBLIC_PATH: string
  VITE_USE_PROXY: boolean
}

function createVitePlugins(VITE_USE_MOCK: boolean, isBuild: boolean) {
  const plugins = [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]

  VITE_USE_MOCK &&
    plugins.push(
      viteMockServe({
        mockPath: './mock',
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
         import { setupProdMockServer } from './mockProdServer';
         setupProdMockServer();
      `,
        logger: true,
        supportTs: true
      })
    )
  return plugins
}

function createProxy(VITE_UES_PROXY: boolean) {
  return VITE_UES_PROXY
    ? {}
    : {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
}

function loadAndConvertEnv(mode: string, root: string): ViteEnv {
  const { VITE_USE_MOCK, VITE_UES_PROXY, VITE_PUBLIC_PATH } = loadEnv(mode, root)

  return {
    VITE_PUBLIC_PATH: VITE_PUBLIC_PATH,
    VITE_USE_MOCK: VITE_USE_MOCK === 'true',
    VITE_USE_PROXY: VITE_UES_PROXY === 'true'
  }
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const { VITE_USE_MOCK, VITE_USE_PROXY } = loadAndConvertEnv(mode, root)
  const isBuild = command === 'build'

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: createVitePlugins(VITE_USE_MOCK, isBuild),
    server: {
      proxy: createProxy(VITE_USE_PROXY)
    }
  }
}
