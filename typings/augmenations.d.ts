import { MenuType } from '@/router/types'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    type: MenuType
    icon?: string
    virtual?: boolean
    url?: string
    hideBreadcrumb?: boolean
    keepAlive?: boolean
    permitAll?: boolean
  }
}
