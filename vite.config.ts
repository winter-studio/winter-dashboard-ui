import type { ConfigEnv, Plugin, PluginOption, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import { resolve } from 'path'
import pkg from './package.json'
import { format } from 'date-fns'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

export default ({ mode }: ConfigEnv): UserConfig => {
  const viteEnv = loadViteEnv(mode)
  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    esbuild: {},
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, './src') },
        { find: '@typings', replacement: resolve(__dirname, './typings') }
      ],
      dedupe: ['vue']
    },
    plugins: createVitePlugins(viteEnv),
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          modifyVars: {},
          javascriptEnabled: true,
          additionalData: `@import "src/styles/var.scss";`
        }
      }
    },
    server: {
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    optimizeDeps: {
      include: [],
      exclude: []
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome86',
      outDir: 'dist-app',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000
    }
  }
}

// Read all environment variable configuration files to process.env
function loadViteEnv(mode: string): ViteEnv {
  const root = process.cwd()
  const envConf = loadEnv(mode, root)

  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    const envValue = envConf[envName].replace(/\\n/g, '\n')
    ret[envName] = envValue === 'true' ? true : envValue === 'false' ? false : envValue
    // process.env[envName] = viteEnvValue
  }
  return ret
}

export function createVitePlugins(viteEnv: ViteEnv) {
  const vitePlugins: (Plugin | Plugin[] | PluginOption | PluginOption[])[] = [
    // have to
    vue(),
    vueJsx(),
    // 按需引入NaiveUi且自动创建组件声明
    Components({
      dts: true,
      resolvers: [NaiveUiResolver()]
    })
  ]

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv))

  return vitePlugins
}

export function configHtmlPlugin(env: ViteEnv) {
  const { VITE_APP_TITLE } = env

  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    inject: {
      // Inject data into ejs template
      data: {
        title: VITE_APP_TITLE
      }
    }
  })

  return htmlPlugin
}
