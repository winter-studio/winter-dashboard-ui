import { axios } from '@/utils/request'
import { MenuTree, MenuType } from '@/router/types'

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?: any) {
  return axios.request<Array<MenuTree>>({
    url: '/menus/tree',
    method: 'GET',
    params
  })
}

export interface Menu {
  id?: number
  parentId?: number
  path?: string
  title?: string
  type?: MenuType
  data?: string
  icon?: string
  tags?: string
  hidden?: boolean
  keepAlive?: boolean
}

export function getMenuById(id: string | number) {
  return axios.request<Menu>({
    url: `/menus/${id}`,
    method: 'GET'
  })
}

export function addMenu(data: Menu) {
  return axios.request({
    url: `/menus/`,
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
