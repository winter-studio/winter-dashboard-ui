import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { DocumentTextOutline } from '@vicons/ionicons5'
import { renderIcon } from '@/utils/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/external',
    name: 'https://github.com/winter-studio/winter-dashboard-ui',
    component: Layout,
    meta: {
      title: '项目文档',
      icon: renderIcon(DocumentTextOutline),
      sort: 9
    }
  }
]

export default routes
