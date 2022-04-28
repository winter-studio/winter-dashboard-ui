import { RouteRecordRaw } from 'vue-router'
import { AppLayout } from '@/router/constant'

const ROOT_ROUTE: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: '/dashboard',
  meta: {
    title: 'Root'
  }
}

const PAGE_NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'PageNotFound',
  component: AppLayout,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'PageNotFound',
      component: () => import('@/views/public/PageNotFound.vue'),
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true
      }
    }
  ]
}

const LOGIN_ROUTE: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/auth/Login.vue'),
  meta: {
    title: 'login'
  }
}

const DASHBOARD_ROUTE: RouteRecordRaw = {
  path: '/dashboard',
  name: 'Home',
  component: AppLayout,
  redirect: '/dashboard/home',
  meta: {
    title: 'Home'
  },
  children: [
    {
      path: 'home',
      name: 'Home',
      component: () => import('@/views/dashboard/Home.vue'),
      meta: {
        // affix: true,
        title: 'Home'
      }
    }
  ]
}

export const basicRoutes: RouteRecordRaw[] = [
  LOGIN_ROUTE,
  ROOT_ROUTE,
  DASHBOARD_ROUTE,
  PAGE_NOT_FOUND_ROUTE
]
