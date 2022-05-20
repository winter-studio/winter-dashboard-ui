import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiResponse } from '@/utils/request/types'

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
        request.headers.Authentication = `Bearer ${token}`
      }
      return request
    },
    (error: any) => {
      window.$loading.error()
      console.error(error)
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
      const { status, data } = response
      switch (status) {
        case 200:
          return data.data
        case 401:
          // TODO: handle 401
          window.$message.error('请重新登录')
          break
      }
    },
    (error: any) => {
      window.$loading.error()
      console.error(error)
      if (error && error.response) {
        switch (error.response.status) {
          case 401:
            window.$message.error('请重新登录')
            break
        }
      }
    }
  )
}

export function setupInterceptors(axios: AxiosInstance) {
  setupRequestInterceptor(axios)
  setupResponseInterceptor(axios)
}
