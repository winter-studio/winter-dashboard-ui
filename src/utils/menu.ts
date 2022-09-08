import { MenuTree } from '@/types/component/menu'
import { MenuTreeOptions } from '@/types/view/menu'

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
