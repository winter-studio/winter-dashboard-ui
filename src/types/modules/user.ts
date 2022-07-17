export interface AdminUserPageItem {
  id: number
  avatar: string
  username: string
  nickname: string
  mobile: string
  createTime: string
  status: string
}

export interface UserProfile {
  avatar?: string
  nickname: string
}

export interface UserPassword {
  oldPassword?: string
  newPassword: string
}
