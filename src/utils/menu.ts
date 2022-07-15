import { MenuTree, MenuType } from '@/router/types'
import { MenuTreeOptions } from '@/types/view/menu'
import { TreeSelectOption } from 'naive-ui'

/**
 * 构建菜单树
 */
export function buildTreeOptions(menuTrees: Array<MenuTree>): Array<MenuTreeOptions> {
  return menuTrees.map((item: MenuTree) => {
    return {
      key: item.id,
      label: item.title,
      path: item.path,
      children: item.children ? buildTreeOptions(item.children) : undefined
    }
  })
}

/**
 * 构建菜单目录树
 */
export function buildDirTreeOptions(
  menuTrees: Array<MenuTree>
): Array<TreeSelectOption> | undefined {
  const data = menuTrees
    .filter((i) => i.type == MenuType.DIR)
    .map((item: MenuTree) => {
      return {
        key: item.id,
        label: item.title,
        children: item.children ? buildDirTreeOptions(item.children) : undefined
      }
    })
  if (data.length == 0) {
    return undefined
  }
  return data
}
