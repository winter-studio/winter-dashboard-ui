import { RouteRecordRaw } from 'vue-router'

const PAGE_NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'PageNotFound',
  component: () => import('@/layouts/AppSkeleton.vue'),
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'PageNotFound',
      component: () => import('@/views/sys/exception/PageNotFound.vue'),
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true
      }
    }
  ]
}

const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/public/Login.vue'),
  meta: {
    title: 'login'
  }
}

const HomeRoute: RouteRecordRaw = {
  path: '/home',
  name: 'Home',
  redirect: '/home/dashboard',
  meta: {
    title: 'Home'
  },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('/@/views/public/Home.vue'),
      meta: {
        // affix: true,
        title: 'Home'
      }
    }
  ]
}

const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: '/home',
  meta: {
    title: 'Home'
  }
}

export const basicRoutes = [LoginRoute, RootRoute, HomeRoute, PAGE_NOT_FOUND_ROUTE]
