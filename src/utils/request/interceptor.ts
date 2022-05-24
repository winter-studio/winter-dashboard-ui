import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiResponse, ApiResponseType } from '@/utils/request/types'
import { useRouter } from 'vue-router'

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
            useUserStore()
              .logout()
              .then((_) =>
                useRouter()
                  .push('/login')
                  .then((_) => {
                    window.$message.error('请重新登录')
                  })
              )
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
