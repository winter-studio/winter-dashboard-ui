import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { setupStore } from '@/store'

async function bootstrap() {
  const app = createApp(App)

  // Configure store
  setupStore(app)

  app.use(ElementPlus, { size: 'small', zIndex: 3000 })

  app.mount('#app')
}

bootstrap()
