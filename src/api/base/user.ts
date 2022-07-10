import { axios } from '@/utils/request'
import { MenuTree } from '@/router/types'
import { PageRes } from '@/utils/request/types'
import { AdminUserPageItem } from '@/types/response/user'

const PREFIX = '/users'

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return axios.request({
    url: `${PREFIX}/me`,
    method: 'get'
  })
}

/**
 * @description: 获取用户信息
 */
export function getUserMenus() {
  return axios.request<MenuTree[]>({
    url: `${PREFIX}/me/menus`,
    method: 'get'
  })
}

/**
 * @description: 获取用户信息
 */
export function getPagedUsers(params: any) {
  return axios.request<PageRes<AdminUserPageItem>>({
    url: `${PREFIX}`,
    method: 'get',
    params
  })
}
