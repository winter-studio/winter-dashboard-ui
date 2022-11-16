import { axios } from '@/utils/request'
import { MenuTree } from '@/types/component/menu'
import { Menu } from '@/types/modules/base'

/**
 * @en get menu list(tree)
 * @zh-CN 获取tree菜单列表
 */
export function getMenuList(params?: any) {
  return axios.request<Array<MenuTree>>({
    url: '/menus/tree',
    method: 'GET',
    params
  })
}

export function getMenuById(id: string | number) {
  return axios.request<Menu>({
    url: `/menus/${id}`,
    method: 'GET'
  })
}

export function addMenu(data: Menu) {
  return axios.request({
    url: `/menus`,
    method: 'POST',
    data
  })
}

export function updateMenu(id: string | number, data: Menu) {
  return axios.request({
    url: `/menus/${id}`,
    method: 'PUT',
    data
  })
}

export function removeMenu(id: string | number) {
  return axios.request({
    url: `/menus/${id}`,
    method: 'DELETE'
  })
}

export function removeMenus(ids: (string | number)[]) {
  return axios.request({
    url: `/menus`,
    method: 'DELETE',
    data: {
      ids
    }
  })
}

export function moveMenu(
  target: string | number,
  relative: string | number,
  position: 'before' | 'after' | 'inside'
) {
  return axios.request({
    url: `/menus/${target}/position`,
    method: 'PUT',
    data: {
      relative,
      position
    }
  })
}
