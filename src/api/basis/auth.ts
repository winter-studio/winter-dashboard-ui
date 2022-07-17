import { axios } from '@/utils/request'
import { UserLogin } from '@/types/modules/base'

/**
 * 用户登录
 */
export function login(data: any) {
  return axios.request<UserLogin>({
    url: '/auth/token',
    method: 'POST',
    data
  })
}

/**
 * 用户登出
 */
export function logout(refreshToken: string | undefined) {
  return axios.request({
    url: '/auth/token',
    method: 'DELETE',
    data: {
      refreshToken
    }
  })
}

/**
 * 用户登出
 */
export function refreshToken(token: string) {
  return axios.request<string>({
    url: '/auth/token',
    method: 'PUT',
    headers: {
      'x-refresh-token': token
    }
  })
}
