import { defineStore } from 'pinia'
import projectSetting from '@/settings/projectSetting'
import type { ImenuSetting } from '@typings/config'
import designSetting from '@/settings/designSetting'

const { darkTheme, appTheme, appThemeList } = designSetting

const {
  navMode,
  navTheme,
  menuSetting,
  multiTabsEnabled,
  showCrumbIcon,
  tabAnimationEnabled,
  pageAnimateType,
  showHeaderReload
} = projectSetting

interface AppPreferenceState {
  //深色主题
  darkTheme: boolean
  //系统风格
  appTheme: string
  //系统内置风格
  appThemeList: string[]
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
    appThemeList,
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
    getDarkTheme(): boolean {
      return this.darkTheme
    },
    getAppTheme(): string {
      return this.appTheme
    },
    getAppThemeList(): string[] {
      return this.appThemeList
    },
    getNavMode(): string {
      return this.navMode
    },
    getNavTheme(): string {
      return this.navTheme
    },
    getMenuSetting(): object {
      return this.menuSetting
    },
    isTabAnimationEnabled(): boolean {
      return this.tabAnimationEnabled
    },
    getPageAnimateType(): string {
      if (this.isTabAnimationEnabled) {
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
  }
})
