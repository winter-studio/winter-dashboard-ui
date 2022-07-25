import { axios } from '@/utils/request'
import { Dict, DictItem, DictModel } from '@/types/modules/dict'

const PREFIX = '/dicts'

export function getDicts() {
  return axios.request<Array<Dict>>({
    url: `${PREFIX}`,
    method: 'GET'
  })
}

export function getDictItems(code: string) {
  return axios.request<Array<DictItem>>({
    url: `${PREFIX}/${code}/items`,
    method: 'GET'
  })
}

export function removeDicts(codes: string[]) {
  return axios.request({
    url: `${PREFIX}`,
    method: 'DELETE',
    data: {
      codes
    }
  })
}

export function getDictByCode(code: string) {
  return axios.request<DictModel>({
    url: `${PREFIX}/${code}`,
    method: 'GET'
  })
}

export function saveDict(data: DictModel) {
  return axios.request<void>({
    url: `${PREFIX}`,
    method: 'POST',
    data
  })
}
