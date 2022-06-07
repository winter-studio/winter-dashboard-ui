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
  handleSuccess?: boolean
  handleFailure?: boolean
  handleError?: boolean
}

export interface ProxyAxiosResponse<T = ApiResponse, D = any> extends AxiosResponse<T, D> {
  config: ProxyAxiosRequestConfig<D>
}

export interface ProxyAxiosInstance extends AxiosInstance {
  request<S = any, T = ApiResponse<S>, D = any>(config: ProxyAxiosRequestConfig<D>): Promise<T>

  get<S = any, T = ApiResponse<S>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  delete<S = any, T = ApiResponse<S>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  head<S = any, T = ApiResponse<S>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  options<S = any, T = ApiResponse<S>, D = any>(
    url: string,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  post<S = any, T = ApiResponse<S>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  put<S = any, T = ApiResponse<S>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
  patch<S = any, T = ApiResponse<S>, D = any>(
    url: string,
    data?: D,
    config?: ProxyAxiosRequestConfig<D>
  ): Promise<T>
}
