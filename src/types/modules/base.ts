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

export interface UserInfo {
  userId: number
  username: string
  nickname: string
  avatar: string
  mobile: string
  status: string
  roles: string[]
}

export interface UserLogin {
  user: UserInfo
  accessToken: string
  refreshToken: string
  refreshTokenExpireIn: number
}
