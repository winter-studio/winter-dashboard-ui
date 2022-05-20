import { axios } from '@/utils/request'

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?: any) {
  return axios.request({
    url: '/menus',
    method: 'GET',
    params
  })
}
