import type { UserConfig, ConfigEnv, ProxyOptions } from 'vite'
import { loadEnv } from 'vite'
import { resolve } from 'path'
import pkg from './package.json'
import { format } from 'date-fns'
const { dependencies, devDependencies, name, version } = pkg
import type { Plugin, PluginOption } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
import compressPlugin from 'vite-plugin-compression'

export const GLOB_CONFIG_FILE_NAME = 'app.config.js'
export const OUTPUT_DIR = 'dist'

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const viteEnv = loadViteEnv(mode)
  const prodMock = viteEnv.VITE_GLOB_PROD_MOCK
  const isBuild = command === 'build'
  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    esbuild: {},
    resolve: {
      alias: [
        {
          find: '@',
          replacement: pathResolve('src') + '/'
        }
      ],
      dedupe: ['vue']
    },
    plugins: createVitePlugins(viteEnv, isBuild, prodMock),
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        scss: {
          modifyVars: {},
          javascriptEnabled: true,
          additionalData: `@import "src/styles/var.scss";`
        }
      }
    },
    server: {
      host: true,
      proxy: createProxy(viteEnv.VITE_PROXY)
      // proxy: {
      //     '/api': {
      //         target: '',
      //         changeOrigin: true,
      //         rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      //     }
      // }
    },
    optimizeDeps: {
      include: [],
      exclude: ['vue-demi']
    },
    build: {
      target: 'es2015',
      outDir: OUTPUT_DIR,
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: viteEnv.VITE_DROP_CONSOLE
        }
      },
      brotliSize: false,
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
    let viteEnvValue: string | boolean | number | undefined

    if (envName === 'VITE_PROXY') {
      try {
        viteEnvValue = JSON.parse(envValue)
      } catch (error) {}
    } else {
      viteEnvValue = envValue === 'true' ? true : envValue === 'false' ? false : envValue
    }
    ret[envName] = viteEnvValue
    // process.env[envName] = viteEnvValue
  }
  return ret
}

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean, prodMock: boolean) {
  const vitePlugins: (Plugin | Plugin[] | PluginOption | PluginOption[])[] = [
    // have to
    vue(),
    // 按需引入NaiveUi且自动创建组件声明
    Components({
      dts: true,
      resolvers: [NaiveUiResolver()]
    })
  ]

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  // vite-plugin-mock
  viteEnv.VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild, prodMock))

  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(
        viteEnv.VITE_BUILD_COMPRESS,
        viteEnv.VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      )
    )
  }

  return vitePlugins
}

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env

  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`

  const getAppConfigSrc = () => {
    return `${path || '/'}${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`
  }

  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      data: {
        title: VITE_GLOB_APP_TITLE
      },
      // Embed the generated app.config.js file
      tags: isBuild
        ? [
            {
              tag: 'script',
              attrs: {
                src: getAppConfigSrc()
              }
            }
          ]
        : []
    }
  })

  return htmlPlugin
}

export function configMockPlugin(isBuild: boolean, prodMock: boolean) {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild && prodMock,
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `
  })
}

/**
 * Generate proxy
 * @param list
 */
export function createProxy(list: [string, string][] = []) {
  const ret: Record<string, ProxyOptions & { rewrite: (path: string) => string }> = {}

  const httpsRE = /^https:\/\//

  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target)

    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {})
    }
  }
  return ret
}

export function configCompressPlugin(
  compress: 'gzip' | 'brotli' | 'none',
  deleteOriginFile = false
): Plugin | Plugin[] {
  const compressList = compress.split(',')

  const plugins: Plugin[] = []

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile
      })
    )
  }
  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile
      })
    )
  }
  return plugins
}

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
