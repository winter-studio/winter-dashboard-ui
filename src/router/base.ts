import { ErrorPage, AppLayout } from '@/router/constant'
import { PageEnum } from '@/enums/pageEnum'
import { AppRouteRecordRaw, MenuType } from '@/router/types'

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
    type: MenuType.DIR
  }
}

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/basic/Login.vue'),
  meta: {
    title: '登录',
    type: MenuType.VIEW
  }
}

// 404 on a page
export const ErrorPageRoute: AppRouteRecordRaw = {
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
export const constantRouter: AppRouteRecordRaw[] = [LoginRoute, RootRoute, ErrorPageRoute]
