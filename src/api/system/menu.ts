import { http } from '@/utils/http/axios'

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?: any) {
  return http.request({
    url: '/menus',
    method: 'GET',
    params
  })
}
