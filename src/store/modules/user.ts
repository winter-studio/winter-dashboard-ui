import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import { getUserInfo, getUserMenus } from '@/api/base/user'
import { logout } from '@/api/base/auth'
import { setupDynamicRoutes } from '@/router/dynamic'
import { useAppStore } from '@/store/modules/application'
import { UserLogin } from '@/types/response/base'
import { omit } from 'lodash-es'
import LocalStorageType from '@/enums/storage-types'

const STORAGE_EXPIRED_TIME = 7 * 24 * 60 * 60 * 1000

export interface UserState {
  accessToken: string | undefined
  refreshToken: string | undefined
  username: string
  welcome: string
  avatar: string
  info: any
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    accessToken: storage.get(LocalStorageType.ACCESS_TOKEN, undefined),
    refreshToken: storage.get(LocalStorageType.REFRESH_TOKEN, undefined),
    username: '',
    welcome: '',
    avatar: '',
    info: storage.get(LocalStorageType.CURRENT_USER, {})
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
      storage.set(LocalStorageType.ACCESS_TOKEN, accessToken, STORAGE_EXPIRED_TIME)
      storage.set(LocalStorageType.REFRESH_TOKEN, refreshToken, refreshTokenExpireIn * 1000)
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    },
    setAccessToken(accessToken: string) {
      storage.set(LocalStorageType.ACCESS_TOKEN, accessToken, STORAGE_EXPIRED_TIME)
      this.accessToken = accessToken
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setUserInfo(info: UserLogin) {
      storage.set(
        LocalStorageType.CURRENT_USER,
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
    async logout() {
      await logout(this.refreshToken)
      this.info = undefined
      this.accessToken = undefined
      this.refreshToken = undefined
      storage.remove(LocalStorageType.ACCESS_TOKEN)
      storage.remove(LocalStorageType.CURRENT_USER)
    }
  }
})
