import { SelectOption, SelectGroupOption } from 'naive-ui'
import { DictCode } from '@/store/modules/dict'

export interface SearchItem {
  type?: 'input' | 'select' | 'daterange'
  label: string
  path: string
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  span?: number // total 24
  labelWidth?: number | string
  options?: SearchItemOptions
}

export type SearchItemOptions = Array<SelectOption | SelectGroupOption> | DictCode

export interface PageParam {
  page: number
  pageSize: number
}

export type SearchOptions<T> = T & PageParam
