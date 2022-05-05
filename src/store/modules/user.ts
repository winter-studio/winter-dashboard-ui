import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import StorageType from '@/enums/storageType'
import { ResultEnum } from '@/enums/httpEnum'
import { getUserInfo, login } from '@/api/system/user'

export interface IUserState {
  token: string
  username: string
  welcome: string
  avatar: string
  permissions: any[]
  info: any
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(StorageType.ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(StorageType.CURRENT_USER, {})
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getAvatar(): string {
      return this.avatar
    },
    getNickname(): string {
      return this.username
    },
    getPermissions(): [any][] {
      return this.permissions
    },
    getUserInfo(): object {
      return this.info
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setPermissions(permissions: [any][]) {
      this.permissions = permissions
    },
    setUserInfo(info: any) {
      this.info = info
    },
    // 登录
    async login(userInfo: any) {
      try {
        const response = await login(userInfo)
        const { result, code } = response
        if (code === ResultEnum.SUCCESS) {
          const ex = 7 * 24 * 60 * 60 * 1000
          storage.set(StorageType.ACCESS_TOKEN, result.token, ex)
          storage.set(StorageType.CURRENT_USER, result, ex)
          this.setToken(result.token)
          this.setUserInfo(result)
        }
        return Promise.resolve(response)
      } catch (e) {
        return Promise.reject(e)
      }
    },

    // 获取用户信息
    GetInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const result = res
            if (result.permissions && result.permissions.length) {
              const permissionsList = result.permissions
              this.setPermissions(permissionsList)
              this.setUserInfo(result)
            } else {
              reject(new Error('getInfo: permissionsList must be a non-null array !'))
            }
            this.setAvatar(result.avatar)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 登出
    async logout() {
      this.setPermissions([])
      this.setUserInfo('')
      storage.remove(StorageType.ACCESS_TOKEN)
      storage.remove(StorageType.CURRENT_USER)
      return Promise.resolve('')
    }
  }
})
