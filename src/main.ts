import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
// import naive from 'naive-ui'
import { createI18n } from 'vue-i18n'

import './styles/tailwind.css'

const i18n = createI18n({
  // something vue-i18n options here ...
})

const app = createApp(App)
// naive-ui
// app.use(naive)
// 注册全局自定义组件
//setupCustomComponents();
//setupGlobalMethods(app);
//i18n
app.use(i18n)
// 挂载状态管理
app.use(store)
// 挂载路由
app.use(router)
app.mount('#app', true)
