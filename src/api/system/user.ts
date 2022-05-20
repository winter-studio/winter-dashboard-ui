import { axios } from '@/utils/request'

export interface BasicResponseModel<T = any> {
  code: number
  message: string
  result: T
}

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
export function login(params: any) {
  return axios.request<BasicResponseModel>({
    url: '/api-token',
    method: 'POST',
    params
  })
}

/**
 * @description: 用户登出
 */
export function logout(params: any) {
  return axios.request({
    url: '/api-token',
    method: 'DELETE',
    params
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
