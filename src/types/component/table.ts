import { SelectOption, SelectGroupOption } from 'naive-ui'
import { DictCode } from '@/store/modules/dict'

export interface SearchItem {
  type?: 'input' | 'select'
  label: string
  path: string
  placeholder?: string
  span?: number // total 24
  options?: SearchItemOptions
}

export type SearchItemOptions = Array<SelectOption | SelectGroupOption> | DictCode

export interface PageParam {
  page: number
  pageSize: number
}

export type SearchOptions<T> = T & PageParam
