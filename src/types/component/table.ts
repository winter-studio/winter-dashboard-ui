export interface SearchItem {
  label: string
  path: string
  placeholder?: string
}

export interface PageParam {
  page: number
  pageSize: number
}

export type SearchOptions<T> = T & PageParam
