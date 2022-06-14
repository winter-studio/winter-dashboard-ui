import { defineStore } from 'pinia'
import { getUserMenus } from '@/api/base/user'
import { logout } from '@/api/base/auth'
import { setupDynamicRoutes } from '@/router/dynamic'
import { useAppStore } from '@/store/modules/application'
import { UserLogin } from '@/types/response/base'
import LocalStorageType from '@/enums/storage-types'

export interface UserState {
  accessToken: string | undefined
  refreshToken: string | undefined
  refreshTokenExpireIn: number | undefined
  info: any
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    accessToken: undefined,
    refreshToken: undefined,
    refreshTokenExpireIn: undefined,
    info: {}
  }),
  getters: {},
  actions: {
    setToken(accessToken: string, refreshToken: string, refreshTokenExpireIn: number) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.refreshTokenExpireIn = refreshTokenExpireIn
    },
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken
    },
    setUserInfo(info: UserLogin) {
      this.info = info
    },
    // 登录
    login(result: UserLogin) {
      this.setToken(result.accessToken, result.refreshToken, result.refreshTokenExpireIn)
      this.setUserInfo(result)
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
      this.refreshTokenExpireIn = undefined
      localStorage.removeItem(LocalStorageType.CURRENT_USER)
    }
  },
  persist: {
    key: LocalStorageType.CURRENT_USER
  }
})
