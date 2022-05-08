import { PageEnum } from '@/enums/pageEnum'
import { storage } from '@/utils/storage'
import StorageType from '@/enums/storageType'
import { isNavigationFailure, Router } from 'vue-router'

const whitePathList = [PageEnum.BASE_LOGIN] // no redirect whitelist

export function setupGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const Loading = (window as { [key: string]: any })['$loading'] || null
    Loading && Loading.start()
    if (from.path === PageEnum.BASE_LOGIN && to.name === 'errorPage') {
      next(PageEnum.BASE_HOME)
      return
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      next()
      return
    }

    const token = storage.get(StorageType.ACCESS_TOKEN)

    if (!token) {
      // You can access without permissions. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next()
        return
      }
      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: PageEnum.BASE_LOGIN,
        replace: true
      }
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path
        }
      }
      next(redirectData)
      return
    }

    Loading && Loading.finish()
    next()
    return
  })

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title
    if (isNavigationFailure(failure)) {
      //console.log('failed navigation', failure)
    }
    /* const asyncRouteStore = useAsyncRouteStore()
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = asyncRouteStore.keepAliveComponents
    const currentComName: any = to.matched.find((item) => item.name == to.name)?.name
    if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName)
    } else if (!to.meta?.keepAlive) {
      // 不需要缓存的组件
      const index = asyncRouteStore.keepAliveComponents.findIndex((name) => name == currentComName)
      if (index != -1) {
        keepAliveComponents.splice(index, 1)
      }
    }
    asyncRouteStore.setKeepAliveComponents(keepAliveComponents)
    const Loading = (window as { [key: string]: any })['$loading'] || null
    Loading && Loading.finish() */
  })

  router.onError((error) => {
    console.log(error, '路由错误')
  })
}
