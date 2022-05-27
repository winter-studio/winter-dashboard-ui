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
  request<S = any, T = ApiResponse<S>, R = ProxyAxiosResponse<T>, D = any>(
    config: ProxyAxiosRequestConfig<D>
  ): Promise<R | T | S>

  get<S = any, T = ApiResponse<S>, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R | T | S>
  delete<S = any, T = ApiResponse<S>, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R | T | S>
  head<S = any, T = ApiResponse<S>, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R | T | S>
  options<S = any, T = ApiResponse<S>, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R | T | S>
  post<S = any, T = ApiResponse<S>, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R | T | S>
  put<S = any, T = ApiResponse<S>, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R | T | S>
  patch<S = any, T = ApiResponse<S>, R = ProxyAxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<R | T | S>
}
