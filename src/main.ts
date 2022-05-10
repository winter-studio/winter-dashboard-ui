import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import { setupDirectives } from '@/plugins'
import naive from 'naive-ui'

import AppProvider from '@/components/application/AppProvider.vue'
import './styles/tailwind.css'

const appProvider = createApp(AppProvider)

const app = createApp(App)

// naive-ui
app.use(naive)

// 注册全局自定义组件
//setupCustomComponents();

// 注册全局自定义指令，如：v-permission权限指令
setupDirectives(app)

// 注册全局方法，如：app.config.globalProperties.$message = message
//setupGlobalMethods(app);

// 挂载状态管理
app.use(store)

//优先挂载一下 Provider 解决路由守卫，Axios中可使用，Dialog，Message 等之类组件
appProvider.mount('#appProvider', true)

// 挂载路由
app.use(router)

// 路由准备就绪后挂载APP实例
await router.isReady()

app.mount('#app', true)
