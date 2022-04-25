import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@/store'
import { router, setupRouter } from '@/router'
import setupVuetify from '@/plugins/vuetify'

const app = createApp(App)

// Configure store
setupStore(app)

// Configure router
setupRouter(app)

// Configure vuetify
setupVuetify(app)

// Run!
router.isReady().then(() => {
  app.mount('#app')
})
