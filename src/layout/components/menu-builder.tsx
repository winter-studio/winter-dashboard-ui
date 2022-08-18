import { MenuTree } from '@/types/component/menu'
import { cloneDeep } from 'lodash-es'
import { MenuDividerOption, MenuGroupOption, MenuOption, NTag } from 'naive-ui'
import IconRender from '@/components/menu/IconRender.vue'

/**
 * 递归组装菜单格式
 */
export function buildMenu(
  menus?: MenuTree[]
): Array<MenuOption | MenuDividerOption | MenuGroupOption> {
  if (!menus) {
    return []
  }
  return filterHiddenMenus(menus).map((menu) => {
    const currentMenu: MenuOption | MenuDividerOption | MenuGroupOption = {
      label: menu.title,
      key: String(menu.id),
      icon: menu.icon ? () => <IconRender icon={menu.icon!} /> : undefined,
      extra: menu.tags ? renderTags(menu.tags) : undefined,
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
  menus?: MenuTree[]
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
        key: String(menu.id),
        icon: menu.icon ? () => <IconRender icon={menu.icon!} /> : undefined,
        extra: menu.tags ? renderTags(menu.tags) : undefined,
        type: menu.type,
        data: menu.data
      }
      firstRouter.push(currentMenu)
    })
    return firstRouter
  } else {
    return buildChildren(cloneRouterMap.filter((item) => String(item.id) === routerName))
  }
}

function filterHiddenMenus(menus: MenuTree[]): MenuTree[] {
  return menus.filter((item) => item.hidden !== true)
}

/**
 * 递归组装子菜单
 * */
function buildChildren(
  menus?: MenuTree[]
): Array<MenuOption | MenuDividerOption | MenuGroupOption> {
  if (!menus) {
    return []
  }
  return filterHiddenMenus(menus).map((menu) => {
    const currentMenu: MenuOption | MenuDividerOption | MenuGroupOption = {
      label: menu.title,
      key: String(menu.id),
      icon: menu.icon ? () => <IconRender icon={menu.icon!} /> : undefined,
      extra: menu.tags ? renderTags(menu.tags) : undefined,
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

export function renderTags(tags: string) {
  return () =>
    tags.split(',').map((tag: string) => (
      <NTag type="error" round size="small" class="mr-1" key={tag}>
        {tag}
      </NTag>
    ))
}
