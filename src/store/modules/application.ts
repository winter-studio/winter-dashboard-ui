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
  getters: {},
  actions: {}
})
