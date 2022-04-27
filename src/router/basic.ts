import { RouteRecordRaw } from 'vue-router'
import { AppLayout } from '@/router/constant'

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
  component: () => import('@/views/public/Login.vue'),
  meta: {
    title: 'login'
  }
}

const HOME_ROUTE: RouteRecordRaw = {
  path: '/home',
  name: 'Home',
  component: AppLayout,
  redirect: '/home/dashboard',
  meta: {
    title: 'Home'
  },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/public/Home.vue'),
      meta: {
        // affix: true,
        title: 'Home'
      }
    }
  ]
}

const ROOT_ROUTE: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: '/home',
  meta: {
    title: 'Home'
  }
}

export const basicRoutes = [LOGIN_ROUTE, ROOT_ROUTE, HOME_ROUTE, PAGE_NOT_FOUND_ROUTE]
