import { axios } from '@/utils/request'
import { UserLogin } from '@/types/response/base'

const PREFIX = '/files'

/**
 * @description: 临时文件上传
 */
export function uploadTemporaryFile(data: any) {
  return axios.request<UserLogin>({
    url: `${PREFIX}/temp`,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
