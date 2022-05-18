import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { constantRouter } from '@/router/base'
import { setupGuards } from '@/router/guards'

const router = createRouter({
  history: createWebHashHistory(''),
  routes: constantRouter as unknown as RouteRecordRaw[],
  scrollBehavior: () => ({
    left: 0,
    top: 0
  })
})

setupGuards(router)

export default router
