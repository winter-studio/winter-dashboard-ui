import { defineComponent } from 'vue'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export enum MenuType {
  DIR = 1,
  VIEW,
  LINK,
  IFRAME
}

export interface MenuTree {
  id: number
  path: string
  title: string
  type: MenuType
  data?: string
  children?: MenuTree[]
  icon?: string
  tags?: string
  hidden?: boolean
  keepAlive?: boolean
}
