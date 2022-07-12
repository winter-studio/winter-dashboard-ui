import { axios } from '@/utils/request'

const PREFIX = '/files'

/**
 * @description: 上传公开的文件
 */
export function uploadPublicFile(data: any) {
  return axios.request<string>({
    url: `${PREFIX}/public-assets`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
