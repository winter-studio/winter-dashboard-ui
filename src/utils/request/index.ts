import axios from 'axios'
import { setupInterceptors } from '@/utils/request/interceptor'
import { ProxyAxiosInstance } from '@/utils/request/types'

const http: ProxyAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL ?? '',
  timeout: 10000
})

setupInterceptors(http)

export { http as axios }
