import {AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'

export interface PageRes<T> {
  list: T[]
  total: number
  page: number
  pages: number
  size: number
  hasMore?: boolean
}

export enum ApiResponseType {
  SUCCESS = 'success',
  ERROR = 'error',
  FAILURE = 'failure'
}

export interface ApiRes<T = any> {
  code: number
  message?: string
  data?: T
  type: ApiResponseType
}

export interface ProxyAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  handleSuccess?: boolean
  handleFailure?: boolean
  handleError?: boolean
}

export interface ProxyInternalAxiosRequestConfig<D = any> extends InternalAxiosRequestConfig<D> {
  handleSuccess?: boolean
  handleFailure?: boolean
  handleError?: boolean
}

export interface ProxyAxiosResponse<T = ApiRes, D = any> extends AxiosResponse<T, D> {
  config: ProxyInternalAxiosRequestConfig<D>
}

export interface ProxyAxiosInstance extends AxiosInstance {
  request<S = any, T = ApiRes<S>, D = any>(config: ProxyAxiosRequestConfig<D>): Promise<T>

  get<S = any, T = ApiRes<S>, D = any>(url: string, config?: ProxyAxiosRequestConfig<D>): Promise<T>
  delete<S = any, T = ApiRes<S>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  head<S = any, T = ApiRes<S>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  options<S = any, T = ApiRes<S>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  post<S = any, T = ApiRes<S>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  put<S = any, T = ApiRes<S>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  patch<S = any, T = ApiRes<S>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
}
