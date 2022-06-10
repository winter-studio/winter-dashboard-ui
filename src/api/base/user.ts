import { axios } from '@/utils/request'
import { MenuTree } from '@/router/types'

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return axios.request({
    url: '/users/me',
    method: 'get'
  })
}

/**
 * @description: 获取用户信息
 */
export function getUserMenus() {
  return axios.request<MenuTree[]>({
    url: '/users/me/menus',
    method: 'get'
  })
}
