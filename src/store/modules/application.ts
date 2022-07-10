import { defineStore } from 'pinia'
import { MenuTree } from '@/router/types'

export interface AppState {
  menus?: MenuTree[]
  keepAliveComponents: Set<string>
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    menus: undefined,
    keepAliveComponents: new Set<string>()
  }),
  getters: {
    getKeepAliveComponents(state) {
      debugger
      if (import.meta.env.VITE_APP_VUE_KEEPALIVE_ENABLED === 'false') {
        return []
      }
      return Array.from(state.keepAliveComponents.values())
    }
  },
  actions: {}
})
