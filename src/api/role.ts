import { axios } from '@/utils/request'
import { FormSelectOption } from '@/types/component/form'
import { Role, RoleForm } from '@/types/modules/role'

const PREFIX = '/roles'

export function getRoleOptions() {
  return axios.request<Array<FormSelectOption>>({
    url: `${PREFIX}/options`,
    method: 'GET'
  })
}

export function getRoles() {
  return axios.request<Array<Role>>({
    url: `${PREFIX}`,
    method: 'GET'
  })
}

export function getRoleById(id: number) {
  return axios.request<Role>({
    url: `${PREFIX}/${id}`,
    method: 'GET'
  })
}

export function addRole(role: RoleForm) {
  return axios.request<number>({
    url: `${PREFIX}`,
    method: 'POST',
    data: role
  })
}

export function updateRole(id: number, role: RoleForm) {
  return axios.request<Array<Role>>({
    url: `${PREFIX}/${id}`,
    method: 'PUT',
    data: role
  })
}

export function removeRoles(roles: number[]) {
  return axios.request({
    url: `${PREFIX}`,
    method: 'DELETE',
    data: {
      roles
    }
  })
}

export function getRoleMenus(id: number) {
  return axios.request<number[]>({
    url: `${PREFIX}/${id}/menus`,
    method: 'GET'
  })
}

export function updateRoleMenus(id: number, menus: number[]) {
  return axios.request<number[]>({
    url: `${PREFIX}/${id}/menus`,
    method: 'PUT',
    data: {
      menus
    }
  })
}
