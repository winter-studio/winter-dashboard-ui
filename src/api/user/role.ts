import { axios } from '@/utils/request'
import { FormSelectOption } from '@/types/component/form'

// const PREFIX = '/roles'
const ADMIN_PREFIX = '/admin/roles'

/**
 * 获取用户信息
 */
export function getRoleOptions() {
  return axios.request<Array<FormSelectOption>>({
    url: `${ADMIN_PREFIX}/options`,
    method: 'GET'
  })
}
