import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import StorageType from '@/enums/storageType'
import { getUserInfo, getUserMenus } from '@/api/system/user'
import { setupDynamicRoutes } from '@/router/dynamic'
import { useAppStore } from '@/store/modules/application'
import { Menu } from '@/router/types'

const STORAGE_EXPIRED_TIME = 7 * 24 * 60 * 60 * 1000

export interface UserState {
  token: string
  username: string
  welcome: string
  avatar: string
  info: any
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    token: storage.get(StorageType.ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
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
    getUserInfo(): object {
      return this.info
    }
  },
  actions: {
    setToken(token: string) {
      storage.set(StorageType.ACCESS_TOKEN, token, STORAGE_EXPIRED_TIME)
      this.token = token
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setUserInfo(info: any) {
      storage.set(StorageType.CURRENT_USER, info, STORAGE_EXPIRED_TIME)
      this.info = info
    },
    // 登录
    login(result: any) {
      this.setToken(result.accessToken)
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
    // 登录成功后
    async afterLogin() {
      try {
        // 获取用户菜单
        const res = (await getUserMenus()) as Menu[]
        useAppStore().menus = res
        // 更新路由
        setupDynamicRoutes(res)
      } catch (e) {
        console.error('获取用户菜单失败', e)
        throw new Error('获取用户菜单失败')
      }
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
