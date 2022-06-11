export interface ProjectSettingState {
  //导航模式
  navMode: string
  //导航风格
  navTheme: string
  //顶部设置
  headerSetting: object
  //菜单设置
  menuSetting: object
  //多标签
  multiTabsSetting: object
  //面包屑
  crumbsSetting: object
}

export interface IheaderSetting {
  isReload: boolean
}

export interface ImenuSetting {
  minMenuWidth: number
  menuWidth: number
  fixed: boolean
  mixMenu: boolean
  collapsed: boolean
}

export interface IcrumbsSetting {
  showIcon: boolean
}

export interface ImultiTabsSetting {
  show: boolean
}

export interface GlobEnvConfig {
  // 标题
  VITE_APP_TITLE: string
  // 接口地址
  VITE_APP_API_URL: string
  // Project abbreviation
  VITE_APP_SHORT_NAME: string
}
