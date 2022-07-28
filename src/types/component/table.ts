import { SelectOption, SelectGroupOption } from 'naive-ui'

export interface SearchItem {
  type?: 'input' | 'select'
  label: string
  path: string
  placeholder?: string
  span?: number // total 24
  options?: Array<SelectOption | SelectGroupOption>
}

export interface PageParam {
  page: number
  pageSize: number
}

export type SearchOptions<T> = T & PageParam
