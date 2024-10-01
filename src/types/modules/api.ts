export interface ApiResourceGroup {
  name: string
  list: ApiResource[]
}

export interface ApiResource {
  name: string
  path: string
  method: string
}
