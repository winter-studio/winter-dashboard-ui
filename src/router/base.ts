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
  ERROR_PAGE_NAME = 'ErrorPage'
}

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: RouteNames.BASE_HOME,
  meta: {
    title: 'Root',
    type: MenuType.DIR
  }
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
