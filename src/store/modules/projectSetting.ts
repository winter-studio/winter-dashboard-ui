import { defineStore } from 'pinia'
import projectSetting from '@/settings/projectSetting'
import type {
  IheaderSetting,
  ImenuSetting,
  ImultiTabsSetting,
  IcrumbsSetting
} from '@/types/config'

const {
  navMode,
  navTheme,
  isMobile,
  headerSetting,
  menuSetting,
  multiTabsSetting,
  crumbsSetting,
  permissionMode,
  isPageAnimate,
  pageAnimateType
} = projectSetting

interface ProjectSettingState {
  navMode: string //导航模式
  navTheme: string //导航风格
  headerSetting: IheaderSetting //顶部设置
  menuSetting: ImenuSetting //多标签
  multiTabsSetting: ImultiTabsSetting //多标签
  crumbsSetting: IcrumbsSetting //面包屑
  permissionMode: string //权限模式
  isPageAnimate: boolean //是否开启路由动画
  pageAnimateType: string //路由动画类型
  isMobile: boolean // 是否处于移动端模式
}

export const useProjectSettingStore = defineStore({
  id: 'app-project-setting',
  state: (): ProjectSettingState => ({
    navMode: navMode,
    navTheme,
    isMobile,
    headerSetting,
    menuSetting,
    multiTabsSetting,
    crumbsSetting,
    permissionMode,
    isPageAnimate,
    pageAnimateType
  }),
  getters: {
    getNavMode(): string {
      return this.navMode
    },
    getNavTheme(): string {
      return this.navTheme
    },
    getIsMobile(): boolean {
      return this.isMobile
    },
    getHeaderSetting(): object {
      return this.headerSetting
    },
    getMenuSetting(): object {
      return this.menuSetting
    },
    getMultiTabsSetting(): object {
      return this.multiTabsSetting
    },
    getCrumbsSetting(): object {
      return this.multiTabsSetting
    },
    getPermissionMode(): string {
      return this.permissionMode
    },
    getIsPageAnimate(): boolean {
      return this.isPageAnimate
    },
    getPageAnimateType(): string {
      return this.pageAnimateType
    }
  },
  actions: {
    setNavTheme(value: string): void {
      debugger
      this.navTheme = value
    },
    setIsMobile(value: boolean): void {
      this.isMobile = value
    }
  }
})
