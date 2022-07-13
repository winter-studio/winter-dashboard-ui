import { axios } from '@/utils/request'
import { SelectOption } from '@/types/component/form'

// const PREFIX = '/roles'
const ADMIN_PREFIX = '/admin/roles'

/**
 * @description: 获取用户信息
 */
export function getRoleOptions() {
  return axios.request<Array<SelectOption>>({
    url: `${ADMIN_PREFIX}/options`,
    method: 'GET'
  })
}
