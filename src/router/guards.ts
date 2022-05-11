import { PageEnum } from '@/enums/pageEnum'
import { isNavigationFailure, Router } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/application'

const whitePathList = [PageEnum.BASE_LOGIN] // no redirect whitelist

export function setupGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    window.$loading?.start()
    if (from.path === PageEnum.BASE_LOGIN && to.name === 'errorPage') {
      next(PageEnum.BASE_HOME)
      return
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      next()
      return
    }
    const userStore = useUserStore()
    const appStore = useAppStore()
    const token = userStore.getToken

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
    } else {
      //may need to fetch menu data
      if (appStore.menus === undefined) {
        await userStore.afterLogin()
        next({
          path: to.path,
          replace: true
        })
        return
      }
    }

    window.$loading?.finish()
    next()
    return
  })

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title
    if (isNavigationFailure(failure)) {
      //console.log('failed navigation', failure)
    }
    const appStore = useAppStore()
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = appStore.keepAliveComponents
    const currentComName: any = to.matched.find((item) => item.name == to.name)?.components.default
      ?.name
    debugger
    if (
      currentComName &&
      !keepAliveComponents.find((item) => item === currentComName) &&
      to.meta?.keepAlive
    ) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName)
    }
    appStore.keepAliveComponents = keepAliveComponents
    window.$loading?.finish()
  })

  router.onError((error) => {
    console.log(error, '路由错误')
  })
}
