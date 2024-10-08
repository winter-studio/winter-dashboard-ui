import { RouteNames } from './base'
import { isNavigationFailure, RouteLocationRaw, Router } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/application'

const whitePathList = [RouteNames.BASE_LOGIN_NAME] // no redirect whitelist

export function setupGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    window.$loading?.start()
    if (from.name === RouteNames.BASE_LOGIN_NAME && to.name === 'errorPage') {
      next(RouteNames.BASE_HOME)
      return
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.name as RouteNames)) {
      next()
      return
    }
    const userStore = useUserStore()
    const appStore = useAppStore()
    const token = userStore.accessToken
    if (!token) {
      // You can access without permissions. You need to set the routing meta.permitAll to true
      if (to.meta.permitAll) {
        next()
        return
      }
      // redirect login page
      const redirectData: RouteLocationRaw = {
        name: RouteNames.BASE_LOGIN_NAME,
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
      if (!userStore.userInfo) {
        try {
          await userStore.updateUserInfo()
        } catch (e) {
          console.error(e)
          // 异常时，如果存在缓存，清空信息再次尝试
          const appStore = useAppStore()
          if (appStore.shouldRetryLogin) {
            await userStore.logout()
          }
        }
      }
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
    document.title = window.$i18n.t(to?.meta?.title) || document.title
    if (isNavigationFailure(failure)) {
      //console.log('failed navigation', failure)
    }
    const appStore = useAppStore()
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = appStore.keepAliveComponents
    if (to.meta?.keepAlive) {
      const defaultComponent = to.matched.find((r) => r.name === to.name)?.components?.default
      if (defaultComponent) {
        // @ts-ignore
        const value = defaultComponent.name || defaultComponent['__name']
        keepAliveComponents.add(value)
      }
    }
    appStore.keepAliveComponents = keepAliveComponents
    window.$loading?.finish()
  })
}
