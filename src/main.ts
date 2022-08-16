import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
// import naive from 'naive-ui'

import './styles/tailwind.css'
import { setUpI18n } from '@/plugins/i18n'

const app = createApp(App)
// naive-ui
// app.use(naive)
// 注册全局自定义组件
//setupCustomComponents();
//setupGlobalMethods(app);
//i18n
setUpI18n(app)
// 挂载状态管理
app.use(store)
// 挂载路由
app.use(router)
app.mount('#app', true)
