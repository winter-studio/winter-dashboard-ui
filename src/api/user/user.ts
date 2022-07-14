import { axios } from '@/utils/request'
import { MenuTree } from '@/router/types'
import { PageRes } from '@/utils/request/types'
import { AdminUserPageItem } from '@/types/response/user'
import { UserFormModel } from '@/views/system/user/user-form'

const PREFIX = '/users'
const ADMIN_PREFIX = '/admin/users'

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return axios.request({
    url: `${PREFIX}/me`,
    method: 'GET'
  })
}

/**
 * 获取用户菜单
 */
export function getUserMenus() {
  return axios.request<MenuTree[]>({
    url: `${PREFIX}/me/menus`,
    method: 'GET'
  })
}

/**
 * 获取用户信息
 */
export function getPagedUsers(params: any) {
  return axios.request<PageRes<AdminUserPageItem>>({
    url: `${ADMIN_PREFIX}`,
    method: 'GET',
    params
  })
}

/**
 * 获取用户信息
 */
export function getUser(id: number) {
  return axios.request<UserFormModel>({
    url: `${ADMIN_PREFIX}/${id}`,
    method: 'GET'
  })
}

/**
 * 上传头像
 */
export function uploadAvatar(data: any) {
  return axios.request<string>({
    url: `${PREFIX}/profile/avatar`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

/**
 * 删除用户
 */
export function deleteUser(id: number) {
  return axios.request<UserFormModel>({
    url: `${ADMIN_PREFIX}/${id}`,
    method: 'DELETE'
  })
}

/**
 * 更改用户状态
 */
export function changeUserStatus(id: number, status: string) {
  return axios.request<UserFormModel>({
    url: `${ADMIN_PREFIX}/${id}/status`,
    method: 'PUT',
    params: {
      status
    }
  })
}

/**
 * 新增用户
 */
export function addUser(data: UserFormModel) {
  return axios.request<number>({
    url: `${ADMIN_PREFIX}`,
    method: 'POST',
    data
  })
}

/**
 * 编辑用户
 */
export function editUser(id: number, data: UserFormModel) {
  return axios.request<void>({
    url: `${ADMIN_PREFIX}/${id}`,
    method: 'PUT',
    data
  })
}
