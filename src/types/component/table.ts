export interface SearchItem {
  label: string
  path: string
  placeholder?: string
  span?: number // total 24
}

export interface PageParam {
  page: number
  pageSize: number
}

export type SearchOptions<T> = T & PageParam
