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
 * @description: 用户登录
 */
export function login(data: any) {
  return axios.request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

/**
 * @description: 用户登出
 */
export function logout() {
  return axios.request({
    url: '/auth/logout',
    method: 'POST'
  })
}

/**
 * @description: 用户登出
 */
export function refreshToken(token: string) {
  return axios.request({
    url: '/auth/token',
    method: 'PUT',
    headers: {
      'x-refresh-token': token
    }
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
