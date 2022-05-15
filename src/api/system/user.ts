import { http } from '@/utils/http/axios'

export interface BasicResponseModel<T = any> {
  code: number
  message: string
  result: T
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return http.request({
    url: '/users/me',
    method: 'get'
  })
}

/**
 * @description: 用户登录
 */
export function login(params: any) {
  return http.request<BasicResponseModel>(
    {
      url: '/api-token',
      method: 'POST',
      params
    },
    {
      isTransformResponse: false
    }
  )
}

/**
 * @description: 用户登出
 */
export function logout(params: any) {
  return http.request({
    url: '/api-token',
    method: 'DELETE',
    params
  })
}

/**
 * @description: 获取用户信息
 */
export function getUserMenus() {
  return http.request({
    url: '/users/me/menus',
    method: 'get'
  })
}
