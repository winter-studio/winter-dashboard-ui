import { TreeOption } from 'naive-ui'

export interface MenuTreeOptions extends TreeOption {
  label: string
  path: string
  children?: MenuTreeOptions[]
}
