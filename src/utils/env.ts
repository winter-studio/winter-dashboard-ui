import type { GlobEnvConfig } from '@typings/config'

import pkg from '../../package.json'

export function getCommonStoragePrefix() {
  const { VITE_APP_SHORT_NAME } = getAppEnvConfig()
  return `${VITE_APP_SHORT_NAME}__${getEnv()}`.toUpperCase()
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase()
}

export const getConfigFileName = (env: Record<string, any>) => {
  return `__PRODUCTION__${env.VITE_APP_SHORT_NAME || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '')
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env)

  // Get the global configuration
  // (the configuration will be extracted independently when packaging)

  const ENV = (import.meta.env.DEV
    ? (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig

  const { VITE_APP_TITLE, VITE_APP_API_URL, VITE_APP_SHORT_NAME } = ENV

  if (!/^[a-zA-Z\_]*$/.test(VITE_APP_SHORT_NAME)) {
    console.warn(
      `VITE_APP_SHORT_NAME Variables can only be characters/underscores,
      please modify in the environment variables and re-running.`
    )
  }

  return {
    VITE_APP_TITLE,
    VITE_APP_API_URL,
    VITE_APP_SHORT_NAME
  }
}

/**
 * @description: Development model
 */
export const devMode = 'development'

/**
 * @description: Production mode
 */
export const prodMode = 'production'

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD
}
