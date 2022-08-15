import { defineStore } from 'pinia'
import { MenuTree } from '@/types/component/menu'
import { MenuTreeOptions } from '@/types/view/menu'
import { getMenuList } from '@/api/menu'
import { buildTreeOptions } from '@/utils/menu'

export interface AppState {
  locale: string
  menus?: MenuTree[]
  keepAliveComponents: Set<string>
  menuTreeOptions?: MenuTreeOptions[]
  retryLogin: boolean
}

const supportedLocales = [
  { test: /^en\b/, locale: 'en-US' },
  { test: 'zh-CN', locale: 'zh-CN' }
]

function getCurrentLocale() {
  if (navigator.languages) {
    const locale = navigator.language
    for (const supportedLocale of supportedLocales) {
      if (typeof supportedLocale.test === 'string' && supportedLocale.test === locale) {
        return supportedLocale.locale
      } else if (supportedLocale.test instanceof RegExp && supportedLocale.test.test(locale)) {
        return supportedLocale.locale
      }
    }
  }
  return 'en-US'
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    locale: getCurrentLocale(),
    menus: undefined,
    keepAliveComponents: new Set<string>(),
    menuTreeOptions: undefined,
    retryLogin: true
  }),
  getters: {
    getKeepAliveComponents(state) {
      if (import.meta.env.VITE_APP_VUE_KEEPALIVE_ENABLED === 'false') {
        return []
      }
      return Array.from(state.keepAliveComponents.values())
    },
    async getMenuTreeOptions(state) {
      if (state.menuTreeOptions === undefined) {
        const { data: menuTrees } = await getMenuList()
        state.menuTreeOptions = buildTreeOptions(menuTrees!)
      }
      return state.menuTreeOptions
    },
    shouldRetryLogin(state) {
      if (state.retryLogin) {
        state.retryLogin = false
        return true
      }
      return false
    }
  },
  actions: {}
})
