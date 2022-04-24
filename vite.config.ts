import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import { createHtmlPlugin } from 'vite-plugin-html'
import vuetify from '@vuetify/vite-plugin'

declare interface ViteEnv {
  VITE_USE_MOCK: boolean
  VITE_PUBLIC_PATH: string
  VITE_USE_PROXY: boolean
  VITE_APP_TITLE: string
}

function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const plugins = [
    vue(),
    vuetify({
      autoImport: true
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    createHtmlPlugin({
      minify: true,
      template: 'index.html',
      inject: {
        data: {
          title: viteEnv.VITE_APP_TITLE
        }
      }
    })
  ]

  viteEnv.VITE_USE_MOCK &&
    plugins.push(
      viteMockServe({
        mockPath: './mock',
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
         import { setupProdMockServer } from '../mock/mockProdServer';
         setupProdMockServer();
      `,
        logger: true,
        supportTs: true
      })
    )
  return plugins
}

function createProxy(viteEnv) {
  return viteEnv.VITE_UES_PROXY
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
  const env = loadEnv(mode, root)

  return {
    VITE_PUBLIC_PATH: env.VITE_PUBLIC_PATH,
    VITE_USE_MOCK: env.VITE_USE_MOCK === 'true',
    VITE_USE_PROXY: env.VITE_UES_PROXY === 'true',
    VITE_APP_TITLE: env.VITE_APP_TITLE
  }
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const viteEnv = loadAndConvertEnv(mode, root)
  const isBuild = command === 'build'

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    server: {
      open: true,
      proxy: createProxy(viteEnv)
    }
  }
}
