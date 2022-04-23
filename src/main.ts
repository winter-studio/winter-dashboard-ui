import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { setupStore } from '@/store'
import { setupRouter } from '@/router'

async function bootstrap() {
  const app = createApp(App)

  // Configure store
  setupStore(app)

  // Configure router
  setupRouter(app)

  app.use(ElementPlus, {
    size: 'small',
    zIndex: 3000,
  })

  app.mount('#app')
}

bootstrap().then(() => {
  console.log('started')
})
