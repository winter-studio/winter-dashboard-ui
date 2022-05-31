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
  extra?: string
  hidden?: boolean
  keepAlive?: boolean
  permitAll?: boolean
}

export function getMenuById(id: string | number) {
  return axios.request<Menu>({
    url: `/menus/${id}`,
    method: 'GET'
  })
}
