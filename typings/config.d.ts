export interface ImenuSetting {
  minMenuWidth: number
  menuWidth: number
  fixed: boolean
  mixMenu: boolean
  collapsed: boolean
}

export interface GlobEnvConfig {
  // 标题
  VITE_APP_TITLE: string
  // 接口地址
  VITE_APP_API_URL: string
  // Project abbreviation
  VITE_APP_SHORT_NAME: string
}
