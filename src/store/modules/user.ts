import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import StorageType from '@/enums/storageType'
import { getUserInfo, getUserMenus } from '@/api/system/user'
import { Menu } from '@/router/types'

export interface UserState {
  token: string
  username: string
  welcome: string
  avatar: string
  info: any
  menus: Menu[]
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    token: storage.get(StorageType.ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    info: storage.get(StorageType.CURRENT_USER, {}),
    menus: []
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
    getUserInfo(): object {
      return this.info
    },
    getMenus(): Menu[] {
      return this.menus
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setUserInfo(info: any) {
      this.info = info
    },
    setMenus(menus: Menu[]) {
      this.menus = menus
    },
    // 登录
    login(result: any) {
      const ex = 7 * 24 * 60 * 60 * 1000
      storage.set(StorageType.ACCESS_TOKEN, result.token, ex)
      storage.set(StorageType.CURRENT_USER, result, ex)
      this.setToken(result.token)
      this.setUserInfo(result)
    },
    // 获取用户信息
    GetInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const result = res
            if (result) {
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
    // 获取用户菜单
    async fetchMenus() {
      getUserMenus()
        .then((res) => {
          const { result } = res
          if (result) {
            this.setMenus(result)
          }
        })
        .catch((error) => {
          throw new Error(error)
        })
    },
    // 登出
    async logout() {
      this.setUserInfo('')
      storage.remove(StorageType.ACCESS_TOKEN)
      storage.remove(StorageType.CURRENT_USER)
      return Promise.resolve('')
    }
  }
})
