import type { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'
import {
  RouteLocation,
  RouteParamsRaw,
  RouteRecordName,
  RouteRecordRedirectOption
} from 'vue-router'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface AppLocationAsRelativeRaw {
  name?: AppRouteRecordName
  params?: RouteParamsRaw
}

export type AppRouteRecordName = RouteRecordName | number

export interface AppRouteRecordRaw
  extends Omit<RouteRecordRaw, 'meta' | 'children' | 'name' | 'redirect'> {
  name: AppRouteRecordName
  meta: AppRouteMeta
  children?: AppRouteRecordRaw[]
  redirect?: RouteRecordRedirectOption | ((to: RouteLocation) => AppLocationAsRelativeRaw)
}

export interface AppRouteMeta {
  // 名称
  title: string
  type: MenuType
  icon?: string
  virtual?: boolean
  url?: string
  hideBreadcrumb?: boolean
  keepAlive?: boolean
  permitAll?: boolean
}

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
