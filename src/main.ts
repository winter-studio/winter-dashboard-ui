import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import { setupDirectives } from '@/plugins'
import naive from 'naive-ui'

import './styles/tailwind.css'

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
// 挂载路由
app.use(router)
app.mount('#app', true)
