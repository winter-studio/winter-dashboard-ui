import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import { resolve } from 'path'
import { createVitePlugins } from './build/vite/plugin'
import { OUTPUT_DIR } from './build/constant'
import { createProxy } from './build/vite/proxy'
import pkg from './package.json'
import { format } from 'date-fns'
const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const viteEnv = loadViteEnv(mode)
  const { VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_GLOB_PROD_MOCK, VITE_PROXY } = viteEnv
  const prodMock = VITE_GLOB_PROD_MOCK
  const isBuild = command === 'build'
  return {
    base: VITE_PUBLIC_PATH,
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
      proxy: createProxy(VITE_PROXY)
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
          drop_console: VITE_DROP_CONSOLE
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
    let envValue = envConf[envName].replace(/\\n/g, '\n')
    let viteEnvValue :      string|boolean|number|undefined

    if (envName === 'VITE_PROXY') {
      try {
        viteEnvValue = JSON.parse(envValue)
      } catch (error) {}
    }else{
      viteEnvValue = envValue === 'true' ? true : envValue === 'false' ? false : envValue
    }
    ret[envName] = viteEnvValue
    // process.env[envName] = viteEnvValue
  }
  return ret
}

function pathResolve(dir: string) {
  return resolve(process.cwd(),    '.', dir)
}
