import { defineStore } from 'pinia'
import { MenuTree } from '@/router/types'

export interface AppState {
  menus?: MenuTree[]
  keepAliveComponents: string[]
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    menus: undefined,
    keepAliveComponents: []
  }),
  getters: {
    getKeepAliveComponents: (state) => {
      if (import.meta.env.MODE === 'development') {
        return []
      } else {
        return state.keepAliveComponents
      }
    }
  },
  actions: {}
})
