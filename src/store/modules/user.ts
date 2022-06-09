import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import StorageType from '@/enums/storageType'
import { getUserInfo, getUserMenus } from '@/api/base/user'
import { setupDynamicRoutes } from '@/router/dynamic'
import { useAppStore } from '@/store/modules/application'
import { UserLogin } from '@/types/response/base'
import { omit } from 'lodash-es'

const STORAGE_EXPIRED_TIME = 7 * 24 * 60 * 60 * 1000

export interface UserState {
  accessToken: string
  refreshToken: string
  username: string
  welcome: string
  avatar: string
  info: any
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    accessToken: storage.get(StorageType.ACCESS_TOKEN, ''),
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
    setToken(accessToken: string, refreshToken: string, refreshTokenExpireIn: number) {
      storage.set(StorageType.ACCESS_TOKEN, accessToken, STORAGE_EXPIRED_TIME)
      storage.set(StorageType.REFRESH_TOKEN, refreshToken, refreshTokenExpireIn * 1000)
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setUserInfo(info: UserLogin) {
      storage.set(
        StorageType.CURRENT_USER,
        omit(info, ['accessToken', 'refreshToken', 'refreshTokenExpireIn']),
        info.refreshTokenExpireIn * 1000
      )
      this.info = info
    },
    // 登录
    login(result: UserLogin) {
      this.setToken(result.accessToken, result.refreshToken, result.refreshTokenExpireIn)
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
      this.info = undefined
      storage.remove(StorageType.ACCESS_TOKEN)
      storage.remove(StorageType.CURRENT_USER)
    }
  }
})
