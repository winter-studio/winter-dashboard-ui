import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import StorageType from '@/enums/storageType'
import { getUserInfo, getUserMenus } from '@/api/base/user'
import { setupDynamicRoutes } from '@/router/dynamic'
import { useAppStore } from '@/store/modules/application'

const STORAGE_EXPIRED_TIME = 7 * 24 * 60 * 60 * 1000

export interface UserState {
  token: string
  refreshToken: string
  username: string
  welcome: string
  avatar: string
  info: any
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    token: storage.get(StorageType.ACCESS_TOKEN, ''),
    refreshToken: storage.get(StorageType.REFRESH_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    info: storage.get(StorageType.CURRENT_USER, {})
  }),
  getters: {
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
              this.setUserInfo(result.data)
            } else {
              reject(new Error('getInfo: permissionsList must be a non-null array !'))
            }
            this.setAvatar(result.data.avatar)
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
        const { data } = await getUserMenus()
        useAppStore().menus = data
        // 更新路由
        setupDynamicRoutes(data)
      } catch (e) {
        console.error('获取用户菜单失败', e)
        throw new Error('获取用户菜单失败')
      }
    },
    // 登出
    logout() {
      this.setUserInfo('')
      storage.remove(StorageType.ACCESS_TOKEN)
      storage.remove(StorageType.CURRENT_USER)
    }
  }
})
