import { RouteRecordRaw } from 'vue-router'
import { AppRouteRecordRaw, Component, MenuTree, MenuType } from './types'
import { AppLayout, EmptyLayout, IFrameLayout } from './constant'
import router from '@/router'

const modules = import.meta.glob('../views/**/*')

const getComponent = (path: string) => {
  return modules[`../views/${path}`]
}

export function setupDynamicRoutes(menus?: MenuTree[]) {
  if (!menus) {
    return
  }
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
    appRoute.name = String(appRoute.name) + '-layout'
    appRoute.component = AppLayout
    appRoute.meta.type = MenuType.DIR
    appRoute.meta.virtual = true
  } else {
    appRoute.component = component
  }
}

function generatorAppRoutes(menus: MenuTree[], level: number): AppRouteRecordRaw[] {
  const appRoutes: AppRouteRecordRaw[] = []
  menus.forEach((menu) => {
    const appRoute: AppRouteRecordRaw = {
      name: String(menu.id),
      meta: {
        title: menu.title,
        type: menu.type,
        keepAlive: menu.keepAlive
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
        completeFirstLevelComponent(
          level,
          appRoute,
          getComponent(menu.data ?? 'basic/exception/404.vue')
        )
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

function setupRedirect(appRoute: AppRouteRecordRaw, menu: MenuTree): string | undefined {
  if (menu.children?.length ?? 0 > 0) {
    const firstChild = menu.children!.find((child) => {
      return child.type === MenuType.VIEW || child.type === MenuType.IFRAME
    })
    if (firstChild) {
      appRoute.redirect = (_) => {
        return { name: String(firstChild.id) }
      }
      return
    }
    return undefined
  }
}
