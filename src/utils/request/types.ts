import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export enum ApiResponseType {
  SUCCESS = 'success',
  ERROR = 'error',
  FAILURE = 'failure'
}

export interface ApiResponse<T = any> {
  code: number
  message?: string
  data?: T
  type: ApiResponseType
}

export interface ProxyAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  rawResponse?: boolean
}

export interface ProxyAxiosResponse<T = any, D = any> extends AxiosResponse<T, D> {
  config: ProxyAxiosRequestConfig<D>
}

export interface ProxyAxiosInstance extends AxiosInstance {
  request<T = any, R = AxiosResponse<T>, D = any>(config: ProxyAxiosRequestConfig<D>): Promise<R>

  get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  head<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  options<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>
}
