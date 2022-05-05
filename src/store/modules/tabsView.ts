import { defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'

// 不需要出现在标签页中的路由
const whiteList = ['login']

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string
  path: string
  name: string
  hash: string
  meta: object
  params: object
  query: object
}

export type TabsViewState = {
  tabsList: RouteItem[] // 标签页
}

//保留固定路由
function retainAffixRoute(list: any[]) {
  return list.filter((item) => item?.meta?.affix ?? false)
}

export const useTabsViewStore = defineStore({
  id: 'app-tabs-view',
  state: (): TabsViewState => ({
    tabsList: []
  }),
  getters: {},
  actions: {
    initTabs(routes: RouteItem[]) {
      // 初始化标签页
      this.tabsList = routes
    },
    addTabs(route: RouteItem): boolean {
      // 添加标签页
      if (whiteList.includes(route.name)) return false
      const isExists = this.tabsList.some((item) => item.fullPath == route.fullPath)
      if (!isExists) {
        this.tabsList.push(route)
      }
      return true
    },
    closeLeftTabs(route: RouteItem) {
      // 关闭左侧
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath)
      this.tabsList.splice(0, index)
    },
    closeRightTabs(route: RouteItem) {
      // 关闭右侧
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath)
      this.tabsList.splice(index + 1)
    },
    closeOtherTabs(route: RouteItem) {
      // 关闭其他
      this.tabsList = this.tabsList.filter((item) => item.fullPath == route.fullPath)
    },
    closeCurrentTab(route: RouteItem) {
      // 关闭当前页
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath)
      this.tabsList.splice(index, 1)
    },
    closeAllTabs() {
      // 关闭全部
      console.log(retainAffixRoute(this.tabsList))
      this.tabsList = retainAffixRoute(this.tabsList)
    }
  }
})
