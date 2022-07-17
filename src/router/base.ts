import { ErrorPage, AppLayout } from '@/router/constant'
import { MenuType } from '@/router/types'
import { RouteRecordRaw } from 'vue-router'

export enum RouteNames {
  // 登录
  BASE_LOGIN_NAME = 'Login',
  // 首页
  BASE_HOME = '/dashboard',
  //首页跳转默认路由
  BASE_HOME_REDIRECT = '/dashboard/workplace',
  // 错误
  ERROR_PAGE_NAME = 'ErrorPage',
  // 个人设置
  PERSONAL_SETTING = 'PersonalSetting',
  // 更改密码
  CHANGE_PASSWORD = 'ChangePassword'
}

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: RouteNames.BASE_HOME,
  component: AppLayout,
  meta: {
    title: 'Root',
    type: MenuType.DIR
  },
  children: [
    {
      path: 'user/profile',
      name: RouteNames.PERSONAL_SETTING,
      component: () => import('@/views/user/ProfileSetting.vue'),
      meta: {
        title: '个人设置',
        type: MenuType.VIEW
      }
    },
    {
      path: 'user/password',
      name: RouteNames.CHANGE_PASSWORD,
      component: () => import('@/views/user/ChangePassword.vue'),
      meta: {
        title: '更改密码',
        type: MenuType.VIEW
      }
    }
  ]
}

export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/basic/Login.vue'),
  meta: {
    title: '登录',
    type: MenuType.VIEW,
    permitAll: true
  }
}

// 404 on a page
export const ErrorPageRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: AppLayout,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    type: MenuType.VIEW
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'ErrorPageSon',
      component: ErrorPage,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        type: MenuType.VIEW
      }
    }
  ]
}

//普通路由 无需验证权限
export const constantRouter: RouteRecordRaw[] = [LoginRoute, RootRoute, ErrorPageRoute]
