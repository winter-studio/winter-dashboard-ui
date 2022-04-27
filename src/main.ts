import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import { router } from '@/router'
import naive from 'naive-ui'

const app = createApp(App)

// Configure store
app.use(store)
// Configure router
app.use(router)
// Configure NativeUI
app.use(naive)

// Run!
router.isReady().then(() => {
  app.mount('#app')
})
