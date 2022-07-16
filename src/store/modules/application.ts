import { defineStore } from 'pinia'
import { MenuTree } from '@/router/types'
import { MenuTreeOptions } from '@/types/view/menu'
import { getMenuList } from '@/api/basis/menu'
import { buildTreeOptions } from '@/utils/menu'

export interface AppState {
  menus?: MenuTree[]
  keepAliveComponents: Set<string>
  menuTreeOptions?: MenuTreeOptions[]
  retryLogin: boolean
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
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
