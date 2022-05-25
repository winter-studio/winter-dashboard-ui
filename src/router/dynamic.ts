import { RouteRecordRaw } from 'vue-router'
import { AppRouteRecordRaw, Component, Menu, MenuType } from './types'
import { AppLayout, EmptyLayout, IFrameLayout } from './constant'
import router from '@/router'

export function setupDynamicRoutes(menus: Menu[]) {
  const appRoutes: AppRouteRecordRaw[] = generatorAppRoutes(menus, 1)
  appRoutes.forEach((route) => {
    router.addRoute(route as unknown as RouteRecordRaw)
  })
}

function completeFirstLevelComponent(
  level: number,
  appRoute: AppRouteRecordRaw,
  component: Component
) {
  if (level === 1) {
    appRoute.children = [
      {
        name: appRoute.name,
        meta: { ...appRoute.meta },
        path: appRoute.path,
        alias: appRoute.path,
        component
      }
    ]
    appRoute.name = appRoute.name + '-layout'
    appRoute.component = AppLayout
    appRoute.meta.type = MenuType.DIR
    appRoute.meta.virtual = true
  } else {
    appRoute.component = component
  }
}

function generatorAppRoutes(menus: Menu[], level: number): AppRouteRecordRaw[] {
  const appRoutes: AppRouteRecordRaw[] = []
  menus.forEach((menu) => {
    const appRoute: AppRouteRecordRaw = {
      name: menu.id,
      meta: {
        title: menu.title,
        type: menu.type,
        keepAlive: menu.keepAlive,
        permitAll: menu.permitAll
      },
      path: (level === 1 ? '/' : '') + menu.path
    }

    switch (menu.type) {
      case MenuType.DIR:
        if (level === 1) {
          appRoute.component = AppLayout
        } else {
          appRoute.component = EmptyLayout
        }
        setupRedirect(appRoute, menu)
        break
      case MenuType.VIEW:
        completeFirstLevelComponent(level, appRoute, () => import(`../${menu.data}`))
        break
      case MenuType.IFRAME:
        appRoute.meta.url = menu.data
        completeFirstLevelComponent(level, appRoute, IFrameLayout)
        break
      /*case MenuType.LINK:
        appRoute.meta.url = menu.data
        break*/
    }

    if (menu.children?.length ?? 0 > 0) {
      appRoute.children = generatorAppRoutes(menu.children!, level + 1)
    }

    appRoutes.push(appRoute)
  })
  return appRoutes
}

function setupRedirect(appRoute: AppRouteRecordRaw, menu: Menu): string | undefined {
  if (menu.children?.length ?? 0 > 0) {
    const firstChild = menu.children!.find((child) => {
      return child.type === MenuType.VIEW || child.type === MenuType.IFRAME
    })
    if (firstChild) {
      appRoute.redirect = (_) => {
        return { name: firstChild.id }
      }
      return
    }
    return undefined
  }
}
