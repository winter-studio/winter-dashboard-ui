import type { GlobConfig } from '@/types/config'

import { getAppEnvConfig } from '@/utils/env'

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_APP_SHORT_NAME,
    VITE_APP_API_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_APP_PROD_MOCK,
    VITE_APP_IMG_URL
  } = getAppEnvConfig()

  if (!/[a-zA-Z\_]*/.test(VITE_APP_SHORT_NAME)) {
    console.warn(
      `VITE_APP_SHORT_NAME Variables can only be characters/underscores,
      please modify in the environment variables and re-running.`
    )
  }

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_APP_SHORT_NAME,
    urlPrefix: VITE_APP_API_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    prodMock: VITE_APP_PROD_MOCK,
    imgUrl: VITE_APP_IMG_URL
  }
  return glob as Readonly<GlobConfig>
}
