import { axios } from '@/utils/request'
import { ApiResourceGroup } from '@/types/modules/api'

const PREFIX = '/apis'

export function getApis() {
  return axios.request<ApiResourceGroup>({
    url: `${PREFIX}`,
    method: 'GET'
  })
}
