import { axios } from '@/utils/request'
import { MenuTree } from '@/router/types'

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
