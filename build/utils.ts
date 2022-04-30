import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

export function isDevFn(mode: string): boolean {
  return mode === 'development'
}

export function isProdFn(mode: string): boolean {
  return mode === 'production'
}

/**
 * Whether to generate package preview
 */
export function isReportMode(): boolean {
  return process.env.REPORT === 'true'
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export function getEnvConfig(match = 'VITE_GLOB_', confFiles = ['.env', '.env.production']) {
  let envConfig = {}
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)))
      envConfig = { ...envConfig, ...env }
    } catch (error) {}
  })

  Object.keys(envConfig).forEach((key) => {
    const reg = new RegExp(`^(${match})`)
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key)
    }
  })
  return envConfig
}

/**
 * Get user root directory
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir)
}
