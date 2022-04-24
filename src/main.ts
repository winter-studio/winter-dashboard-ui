import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@/store'
import { setupRouter } from '@/router'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'

async function bootstrap() {
  const app = createApp(App)

  // Configure store
  setupStore(app)

  // Configure router
  setupRouter(app)

  // Load fonts
  loadFonts()

  // Configure vuetify
  app.use(vuetify)

  app.mount('#app')
}

bootstrap().then(() => {
  console.log('started')
})
