import { defineStore } from 'pinia'
import { Menu } from '@/router/types'

export interface AppState {
  menus?: Menu[]
  keepAliveComponents: string[]
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    menus: undefined,
    keepAliveComponents: []
  }),
  getters: {},
  actions: {
    setMenus(menus: Menu[]) {
      this.menus = menus
    }
  }
})
