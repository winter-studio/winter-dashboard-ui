import { defineStore } from 'pinia'
import preferenceDefault from '@/settings/preference-default'
import LocalStorageType from '@/enums/storage-types'

const {
  darkTheme,
  appTheme,
  navMode,
  navTheme,
  menuSetting,
  multiTabsEnabled,
  showCrumbIcon,
  tabAnimationEnabled,
  pageAnimateType,
  showHeaderReload
} = preferenceDefault

export interface ImenuSetting {
  minMenuWidth: number
  menuWidth: number
  fixed: boolean
  mixMenu: boolean
  collapsed: boolean
}

interface AppPreferenceState {
  //深色主题
  darkTheme: boolean
  //系统风格
  appTheme: string
  navMode: string //导航模式
  navTheme: string //导航风格
  showHeaderReload: boolean //顶部设置
  menuSetting: ImenuSetting //多标签
  multiTabsEnabled: boolean //多标签
  showCrumbIcon: boolean //面包屑图标
  tabAnimationEnabled: boolean //是否开启路由动画
  pageAnimateType: string //路由动画类型
}

export const useAppPreferenceStore = defineStore({
  id: 'app-preference',
  state: (): AppPreferenceState => ({
    darkTheme,
    appTheme,
    navMode,
    navTheme,
    showHeaderReload,
    menuSetting,
    multiTabsEnabled,
    showCrumbIcon,
    tabAnimationEnabled,
    pageAnimateType
  }),
  getters: {
    getPageAnimateType(): string {
      if (this.tabAnimationEnabled) {
        return this.pageAnimateType
      } else {
        return ''
      }
    }
  },
  actions: {
    setNavTheme(value: string): void {
      this.navTheme = value
    }
  },
  persist: {
    key: LocalStorageType.PREFERENCE
  }
})
