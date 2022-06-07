import axios, { AxiosInstance } from 'axios'
import { setupInterceptors } from '@/utils/request/interceptor'
import { ProxyAxiosInstance, ProxyAxiosRequestConfig } from '@/utils/request/types'

const http: ProxyAxiosInstance = axios.create(<ProxyAxiosRequestConfig>{
  baseURL: import.meta.env.VITE_APP_API_URL ?? '',
  timeout: 10000,
  handleSuccess: true,
  handleFailure: true,
  handleError: true
})

const httpRaw: AxiosInstance = axios.create(<ProxyAxiosRequestConfig>{
  baseURL: import.meta.env.VITE_APP_API_URL ?? '',
  timeout: 10000
})

setupInterceptors(http)

export { http as axios, httpRaw as axiosRaw }
