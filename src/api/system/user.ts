import { axios } from '@/utils/request'

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
 * @description: 获取用户信息
 */
export function getUserMenus() {
  return axios.request({
    url: '/users/me/menus',
    method: 'get'
  })
}
