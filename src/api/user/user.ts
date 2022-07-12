import { axios } from '@/utils/request'
import { MenuTree } from '@/router/types'
import { PageRes } from '@/utils/request/types'
import { AdminUserPageItem } from '@/types/response/user'
import { UserForm } from '@/views/system/user/user'

const PREFIX = '/users'
const ADMIN_PREFIX = '/admin/users'

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return axios.request({
    url: `${PREFIX}/me`,
    method: 'GET'
  })
}

/**
 * @description: 获取用户信息
 */
export function getUserMenus() {
  return axios.request<MenuTree[]>({
    url: `${PREFIX}/me/menus`,
    method: 'GET'
  })
}

/**
 * @description: 获取用户信息
 */
export function getPagedUsers(params: any) {
  return axios.request<PageRes<AdminUserPageItem>>({
    url: `${ADMIN_PREFIX}`,
    method: 'GET',
    params
  })
}
/**
 * @description: 获取用户信息
 */
export function getUser(id: number) {
  return axios.request<UserForm>({
    url: `${ADMIN_PREFIX}/${id}`,
    method: 'GET'
  })
}
