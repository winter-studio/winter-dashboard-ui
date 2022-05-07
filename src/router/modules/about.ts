import { RouteRecordRaw } from 'vue-router'
import { AppLayout } from '@/router/constant'
import { ProjectOutlined } from '@vicons/antd'
import { renderIcon, renderNew } from '@/utils/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/about',
    name: 'about',
    component: AppLayout,
    meta: {
      sort: 10,
      isRoot: true,
      activeMenu: 'about_index',
      icon: renderIcon(ProjectOutlined)
    },
    children: [
      {
        path: 'index',
        name: `about_index`,
        meta: {
          title: '关于',
          extra: renderNew(),
          activeMenu: 'about_index'
        },
        component: () => import('@/views/about/index.vue')
      }
    ]
  }
]

export default routes
