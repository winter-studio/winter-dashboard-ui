import { MenuType } from '@/router/types'

export interface Menu {
  id?: number
  parentId?: number
  path?: string
  title?: string
  type?: MenuType
  data?: string
  icon?: string
  tags?: string
  hidden?: boolean
  keepAlive?: boolean
}

export interface UserLogin {
  userId: string
  username: string
  accessToken: string
  refreshToken: string
  refreshTokenExpireIn: number
}
