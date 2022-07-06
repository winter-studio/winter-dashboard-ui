export interface SearchItem {
  label: string
  path: string
  placeholder?: string
}

export interface SearchOptions {
  page: number
  pageSize: number
  search: any
}
