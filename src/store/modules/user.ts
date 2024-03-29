import { defineStore, PiniaPluginContext } from 'pinia'
import { getUserInfo, getUserMenus } from '@/api/user'
import { logout } from '@/api/auth'
import { setupDynamicRoutes } from '@/router/dynamic'
import { useAppStore } from '@/store/modules/application'
import { UserInfo, UserLogin } from '@/types/modules/base'
import LocalStorageType from '@/constants/storage-types'

export interface UserState {
  rememberMe: boolean
  accessToken: string | undefined
  refreshToken: string | undefined
  refreshTokenExpireAt: number | undefined
  userInfo: UserInfo | undefined
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    rememberMe: false,
    accessToken: undefined,
    refreshToken: undefined,
    refreshTokenExpireAt: undefined,
    userInfo: undefined
  }),
  getters: {},
  actions: {
    setToken(accessToken: string, refreshToken: string, refreshTokenExpireIn: number) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.refreshTokenExpireAt = refreshTokenExpireIn * 1000 + new Date().getTime()
    },
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info
    },
    // 登录
    login(result: UserLogin, rememberMe: boolean) {
      if (result.user.status === '1') {
        throw new Error('用户被禁用')
      }
      this.rememberMe = rememberMe
      sessionStorage.setItem('refresh_flag', '1')
      this.setToken(result.accessToken, result.refreshToken, result.refreshTokenExpireIn)
      this.setUserInfo(result.user)
    },
    async updateUserInfo() {
      const { data } = await getUserInfo()
      this.userInfo = data!
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
      this.userInfo = undefined
      this.accessToken = undefined
      this.refreshToken = undefined
      this.refreshTokenExpireAt = undefined
      localStorage.removeItem(LocalStorageType.CURRENT_USER)
    }
  },
  persist: {
    key: LocalStorageType.CURRENT_USER,
    paths: ['accessToken', 'refreshToken', 'refreshTokenExpireAt', 'rememberMe'],
    afterRestore(context: PiniaPluginContext) {
      if (!sessionStorage.getItem('refresh_flag')) {
        if (!context.store.rememberMe) {
          context.store.userInfo = undefined
          context.store.accessToken = undefined
          context.store.refreshToken = undefined
          context.store.refreshTokenExpireAt = undefined
          localStorage.removeItem(LocalStorageType.CURRENT_USER)
        }
      }
    }
  }
})
