import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import { router } from '@/router'

const app = createApp(App)

// Configure store
app.use(store)
// Configure router
app.use(router)

// Run!
router.isReady().then(() => {
  app.mount('#app')
})
