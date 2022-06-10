import { axios } from '@/utils/request'

//获取table
export function getTableList(params: any) {
  return axios.request({
    url: '/table/list',
    method: 'get',
    params
  })
}
