import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiResponse, ApiResponseType } from '@/utils/request/types'
import router from '@/router'

/**
 * request interceptor
 */
function setupRequestInterceptor(axios: AxiosInstance) {
  axios.interceptors.request.use(
    (request: AxiosRequestConfig) => {
      window.$loading.start()
      // set header Authorization
      const token = useUserStore().token
      if (request.headers && token) {
        request.headers.Authorization = `Bearer ${token}`
      }
      return request
    },
    (error: any) => {
      window.$loading.error()
      console.error(error)
      throw new Error(error)
    }
  )
}

/**
 * response interceptor
 */
function setupResponseInterceptor(axios: AxiosInstance) {
  axios.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      window.$loading.finish()
      const { data } = response
      if (data.type === ApiResponseType.SUCCESS) {
        return data.data
      } else {
        throw new Error(data.message)
      }
    },
    (error: any) => {
      window.$loading.error()
      console.error(error)
      if (error && error.response) {
        switch (error.response.status) {
          case 401:
            useUserStore().logout()
            router
              .push({
                name: 'login',
                query: {
                  redirect: router.currentRoute.value.fullPath
                }
              })
              .then((_) => {
                window.$message.error('请重新登录')
              })
            break
          case 403:
            window.$message.error('没有权限')
            break
          case 404:
            window.$message.error('请求资源不存在')
            break
        }
      } else {
        switch (error.code) {
          case 'ECONNABORTED':
            window.$message.error('网络错误')
            break
          case 'ETIMEDOUT':
            window.$message.error('请求超时')
            break
          default:
            window.$message.error('请求失败')
        }
      }
    }
  )
}

export function setupInterceptors(axios: AxiosInstance) {
  setupRequestInterceptor(axios)
  setupResponseInterceptor(axios)
}
