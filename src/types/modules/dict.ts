export interface Dict {
  code: string
  name: string
}
export interface DictItem {
  key: string
  value: string
}

export interface DictModel {
  name?: string
  code?: string
  items?: DictItem[]
}
