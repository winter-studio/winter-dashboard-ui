import { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { ApiRes, ApiResponseType, ProxyAxiosResponse } from '@/types/component/request'
import router from '@/router'
import { RouteNames } from '@/router/base'
import { RouteLocationRaw } from 'vue-router'
import { ApiResCode } from '@/utils/request/constants'
import { refreshToken } from '@/api/auth'

let refreshing: Promise<any> | undefined = undefined
let waiting = false
let retryCount = 0

/**
 * request interceptor
 */
function setupRequestInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (request: InternalAxiosRequestConfig<ApiRes>) => {
      window.$loading.start()
      if (request.headers) {
        // set locale
        request.headers['Accept-Language'] = window.$i18n.locale.value
        // set header Authorization
        const token = useUserStore().accessToken
        if (token) {
          request.headers.Authorization = `Bearer ${token}`
        }
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

function createRefreshing(token: string): Promise<ApiRes<string>> {
  if (!refreshing) {
    waiting = true
    refreshing = refreshToken(token)
  }
  return refreshing
}

/**
 * response interceptor
 */
function setupResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    //@ts-ignore
    (response: ProxyAxiosResponse) => {
      window.$loading.finish()
      const { data } = response
      switch (data.type) {
        case ApiResponseType.SUCCESS:
          if (response.config.handleSuccess) {
            return data
          }
          break
        case ApiResponseType.FAILURE:
          if (response.config.handleFailure) {
            window.$message.error(data.message ?? '未知错误')
            throw response
          }
          break
        case ApiResponseType.ERROR:
          if (response.config.handleError) {
            window.$message.error(data.message ?? '请求异常')
            throw response
          }
          break
      }
      throw response
    },
    async (error: any) => {
      window.$loading.error()
      if (error && error.response) {
        switch (error.response.status) {
          case 401: {
            const userStore = useUserStore()
            if (error.response.data.code === ApiResCode.ACCESS_TOKEN_EXPIRED) {
              // token过期，尝试刷新token
              if (
                userStore.refreshToken &&
                userStore.refreshTokenExpireAt &&
                userStore.refreshTokenExpireAt > new Date().getTime()
              ) {
                console.info('token expired，try to refresh token')
                refreshing = createRefreshing(userStore.refreshToken)
                const res = await refreshing
                if (waiting) {
                  console.info('refresh token successfully')
                  waiting = false
                  userStore.setAccessToken(res.data)
                  refreshing = undefined
                }
                if (retryCount++ < 3) {
                  console.info('retry request')
                  return instance(error.response.config)
                } else {
                  retryCount = 0
                }
              }
            }
            userStore.logout().then(() => {
              const redirect = router.currentRoute.value.fullPath
              const to: RouteLocationRaw = {
                name: RouteNames.BASE_LOGIN_NAME
              }
              if (redirect && redirect !== '/') {
                to.query = { redirect }
              }
              const msg = error.response.data.message
              router.push(to).then((_) => {
                window.$message.error(`${msg}, 请重新登录`)
              })
            })
            return
          }
          case 403:
            window.$message.error('没有权限')
            break
          case 404:
            window.$message.error('请求资源不存在')
            break
        }
        throw error.response
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
        throw error
      }
    }
  )
}

export function setupInterceptors(axios: AxiosInstance) {
  setupRequestInterceptor(axios)
  setupResponseInterceptor(axios)
}
