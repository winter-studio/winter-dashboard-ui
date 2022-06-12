import { RouteRecordRaw } from 'vue-router'
import { Component, MenuTree, MenuType } from './types'
import { AppLayout, EmptyLayout, IFrameLayout } from './constant'
import router from '@/router'

const modules: Record<string, () => Promise<Recordable>> = import.meta.glob('../views/**/*.vue')

const getComponent = (path: string) => {
  return modules[`../views/${path}`]
}

export function setupDynamicRoutes(menus?: MenuTree[]) {
  if (!menus) {
    return
  }
  const appRoutes: RouteRecordRaw[] = generatorAppRoutes(menus, 1)
  appRoutes.forEach((route) => {
    router.addRoute(route as unknown as RouteRecordRaw)
  })
}

function completeFirstLevelComponent(
  level: number,
  appRoute: RouteRecordRaw,
  component: Component
) {
  if (level === 1) {
    appRoute.children = [
      {
        name: appRoute.name,
        meta: { ...appRoute.meta! },
        path: appRoute.path,
        alias: appRoute.path,
        component
      }
    ]
    appRoute.name = String(appRoute.name) + '-layout'
    appRoute.component = AppLayout
    if (appRoute.meta) {
      appRoute.meta.type = MenuType.DIR
      appRoute.meta.virtual = true
    }
  } else {
    appRoute.component = component
  }
}

function generatorAppRoutes(menus: MenuTree[], level: number): RouteRecordRaw[] {
  const appRoutes: RouteRecordRaw[] = []
  menus.forEach((menu) => {
    const appRoute: RouteRecordRaw = {
      name: String(menu.id),
      component: () => {},
      meta: {
        title: menu.title,
        type: menu.type,
        icon: menu.icon,
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
        completeFirstLevelComponent(level, appRoute, getComponent(menu.data!))
        break
      case MenuType.IFRAME:
        appRoute.meta!.url = menu.data
        completeFirstLevelComponent(level, appRoute, IFrameLayout)
        break
      case MenuType.LINK:
        appRoute.meta!.url = menu.data
        break
      default:
        break
    }

    if (menu.children?.length ?? 0 > 0) {
      appRoute.children = generatorAppRoutes(menu.children!, level + 1)
    }

    appRoutes.push(appRoute)
  })
  return appRoutes
}

function setupRedirect(appRoute: RouteRecordRaw, menu: MenuTree): string | undefined {
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
