import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiResponseType, ProxyAxiosResponse } from '@/utils/request/types'
import router from '@/router'
import { PageEnum } from '@/enums/pageEnum'
import { RouteLocationRaw } from 'vue-router'

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
    (response: ProxyAxiosResponse) => {
      window.$loading.finish()
      const { data } = response
      if (data.type === ApiResponseType.SUCCESS) {
        if (!response.config.raw) {
          return data
        }
      } else {
        throw new Error(data.message)
      }
    },
    (error: any) => {
      window.$loading.error()
      if (error && error.response) {
        switch (error.response.status) {
          case 401:
            useUserStore().logout()
            const redirect = router.currentRoute.value.fullPath
            const to: RouteLocationRaw = {
              name: PageEnum.BASE_LOGIN_NAME
            }
            if (redirect && redirect !== '/') {
              to.query = { redirect }
            }
            const msg = error.response.data.message
            router.push(to).then((_) => {
              window.$message.error(`${msg}, 请重新登录`)
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
        console.error(error)
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
