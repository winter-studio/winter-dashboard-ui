import { Menu } from '@/router/types'
import { cloneDeep } from 'lodash-es'
import { MenuDividerOption, MenuGroupOption, MenuOption } from 'naive-ui'
import { renderIconByName } from '@/utils/iconUtils'

/**
 * 递归组装菜单格式
 */
export function generatorMenu(
  menus: Menu[]
): Array<MenuOption | MenuDividerOption | MenuGroupOption> {
  return filterHiddenMenus(menus).map((menu) => {
    const currentMenu: MenuOption | MenuDividerOption | MenuGroupOption = {
      label: menu.title,
      key: menu.id,
      icon: menu.icon ? renderIconByName(menu.icon) : undefined
    }
    // 是否有子菜单，并递归处理
    if (menu.children?.length ?? 0 > 0) {
      // Recursion
      currentMenu.children = generatorMenu(menu.children!)
    }
    return currentMenu
  })
}

/**
 * 混合菜单
 * */
export function generatorMenuMix(
  routerMap: Menu[],
  routerName: string,
  location: string
): Array<MenuOption | MenuDividerOption | MenuGroupOption> {
  const cloneRouterMap = cloneDeep(routerMap)
  if (location === 'header') {
    const firstRouter: any[] = []
    filterHiddenMenus(cloneRouterMap).forEach((menu) => {
      menu.children = undefined
      const currentMenu: MenuOption | MenuDividerOption | MenuGroupOption = {
        label: menu.title,
        key: menu.id,
        icon: menu.icon ? renderIconByName(menu.icon) : undefined
      }
      firstRouter.push(currentMenu)
    })
    return firstRouter
  } else {
    return getChildrenRouter(cloneRouterMap.filter((item) => item.id === routerName))
  }
}

function filterHiddenMenus(menus: Menu[]): Menu[] {
  return menus.filter((item) => item.hidden !== true)
}

/**
 * 递归组装子菜单
 * */
export function getChildrenRouter(
  routerMap: Menu[]
): Array<MenuOption | MenuDividerOption | MenuGroupOption> {
  return filterHiddenMenus(routerMap).map((menu) => {
    const currentMenu: MenuOption | MenuDividerOption | MenuGroupOption = {
      label: menu.title,
      key: menu.id,
      icon: menu.icon ? renderIconByName(menu.icon) : undefined
    }
    // 是否有子菜单，并递归处理
    if (menu.children && menu.children.length > 0) {
      // Recursion
      currentMenu.children = getChildrenRouter(menu.children)
    }
    return currentMenu
  })
}
