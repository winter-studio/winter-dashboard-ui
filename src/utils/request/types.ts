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
  unwrap?: boolean
}

export interface ProxyAxiosResponse<T = ApiResponse, D = any> extends AxiosResponse<T, D> {
  config: ProxyAxiosRequestConfig<D>
}

export interface ProxyAxiosInstance extends AxiosInstance {
  request<T = ProxyAxiosResponse, R = ProxyAxiosResponse<T>, D = any>(
    config: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  get<T = ProxyAxiosResponse, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  delete<T = ProxyAxiosResponse, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  head<T = ProxyAxiosResponse, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  options<T = ProxyAxiosResponse, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  post<T = ProxyAxiosResponse, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  put<T = ProxyAxiosResponse, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>

  patch<T = ProxyAxiosResponse, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R>
}
