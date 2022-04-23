import { RouteRecordRaw } from 'vue-router'

const PAGE_NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'PageNotFound',
  component: () => import('/@/layouts/default/index.vue'),
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'PageNotFound',
      component: () => import('/@/views/sys/exception/Exception.vue'),
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
}

const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/public/auth/Login.vue'),
  meta: {
    title: 'login',
  },
}

const HomeRoute: RouteRecordRaw = {
  path: '/',
  name: 'Home',
  redirect: '/home',
  meta: {
    title: 'Home',
  },
}

export const basicRoutes = [LoginRoute, HomeRoute, PAGE_NOT_FOUND_ROUTE]
