import { Menu } from '@/router/types'
import { cloneDeep } from 'lodash-es'
import { MenuDividerOption, MenuGroupOption, MenuOption, NTag } from 'naive-ui'
import { renderIconByName } from '@/utils/icon-utils'
import { h } from 'vue'

/**
 * 递归组装菜单格式
 */
export function buildMenu(menus?: Menu[]): Array<MenuOption | MenuDividerOption | MenuGroupOption> {
  if (!menus) {
    return []
  }
  return filterHiddenMenus(menus).map((menu) => {
    const currentMenu: MenuOption | MenuDividerOption | MenuGroupOption = {
      label: menu.title,
      key: menu.id,
      icon: menu.icon ? renderIconByName(menu.icon) : undefined,
      extra: menu.extra ? renderNew() : undefined,
      type: menu.type,
      data: menu.data
    }
    // 是否有子菜单，并递归处理
    if (menu.children?.length ?? 0 > 0) {
      // Recursion
      currentMenu.children = buildMenu(menu.children!)
    }
    return currentMenu
  })
}

/**
 * 混合菜单
 * */
export function buildMenuMix(
  routerName: string,
  location: string,
  menus?: Menu[]
): Array<MenuOption | MenuDividerOption | MenuGroupOption> {
  if (!menus) {
    return []
  }
  const cloneRouterMap = cloneDeep(menus)
  if (location === 'header') {
    const firstRouter: any[] = []
    filterHiddenMenus(cloneRouterMap).forEach((menu) => {
      menu.children = undefined
      const currentMenu: MenuOption | MenuDividerOption | MenuGroupOption = {
        label: menu.title,
        key: menu.id,
        icon: menu.icon ? renderIconByName(menu.icon) : undefined,
        extra: menu.extra ? renderNew() : undefined,
        type: menu.type,
        data: menu.data
      }
      firstRouter.push(currentMenu)
    })
    return firstRouter
  } else {
    return buildChildren(cloneRouterMap.filter((item) => item.id === routerName))
  }
}

function filterHiddenMenus(menus: Menu[]): Menu[] {
  return menus.filter((item) => item.hidden !== true)
}

/**
 * 递归组装子菜单
 * */
function buildChildren(menus?: Menu[]): Array<MenuOption | MenuDividerOption | MenuGroupOption> {
  if (!menus) {
    return []
  }
  return filterHiddenMenus(menus).map((menu) => {
    const currentMenu: MenuOption | MenuDividerOption | MenuGroupOption = {
      label: menu.title,
      key: menu.id,
      icon: menu.icon ? renderIconByName(menu.icon) : undefined,
      extra: menu.extra ? renderNew() : undefined,
      type: menu.type,
      data: menu.data
    }
    // 是否有子菜单，并递归处理
    if (menu.children && menu.children.length > 0) {
      // Recursion
      currentMenu.children = buildChildren(menu.children)
    }
    return currentMenu
  })
}

const newTagColors = { color: '#f90', textColor: '#fff', borderColor: '#f90' }
export function renderNew(type = 'warning', text = 'New', color: object = newTagColors) {
  return () =>
    h(
      NTag as any,
      {
        type,
        round: true,
        size: 'small',
        color
      },
      { default: () => text }
    )
}
