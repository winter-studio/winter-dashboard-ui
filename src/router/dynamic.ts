import { Router, RouteRecordRaw } from 'vue-router'
import { AppRouteRecordRaw, Component, Menu, MenuType } from './types'
import { AppLayout, EmptyLayout, IFrameLayout } from './constant'

export function setupDynamicRoutes(router: Router, menus: Menu[]) {
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
        name: appRoute.name + '-component',
        meta: { ...appRoute.meta },
        path: 'index',
        component
      }
    ]

    appRoute.component = AppLayout
    appRoute.meta.type = MenuType.DIR
    appRoute.meta.virtualDir = true
    appRoute.alias = appRoute.path + '/index'
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
        type: menu.type
      },
      path: level === 1 ? '/' : '' + menu.path
    }

    switch (menu.type) {
      case MenuType.DIR:
        if (level === 1) {
          appRoute.component = AppLayout
        } else {
          appRoute.component = EmptyLayout
        }
        appRoute.redirect = getRedirect(menu)
        break
      case MenuType.VIEW:
        completeFirstLevelComponent(level, appRoute, () => import(`../${menu.data}`))
        break
      case MenuType.IFRAME:
        appRoute.meta.url = menu.data
        completeFirstLevelComponent(level, appRoute, IFrameLayout)
        break
      case MenuType.LINK:
        appRoute.meta.url = menu.data
        break
    }

    if (menu.children?.length ?? 0 > 0) {
      appRoute.children = generatorAppRoutes(menu.children!, level + 1)
    }
    appRoutes.push(appRoute)
  })
  return appRoutes
}

function getRedirect(menu: Menu): string | undefined {
  if (menu.children?.length ?? 0 > 0) {
    const firstChild = menu.children!.find((child) => {
      return child.type === MenuType.VIEW || child.type === MenuType.IFRAME
    })
    if (firstChild) {
      return menu.path + '/' + firstChild.path
    }
    return undefined
  }
}
