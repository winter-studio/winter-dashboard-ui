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
      return Array.from(state.keepAliveComponents.values())
    }
  },
  actions: {}
})
