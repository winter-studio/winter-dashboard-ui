import { defineStore } from 'pinia'
import { Menu } from '@/router/types'

export interface AppState {
  menus?: Menu[]
  keepAliveComponents: Set<string>
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    menus: undefined,
    keepAliveComponents: new Set()
  }),
  getters: {},
  actions: {}
})
