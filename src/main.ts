import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import { router } from '@/router'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import toast from '@/plugins/toast'

const app = createApp(App)

// Configure store
app.use(store)
// Configure router
app.use(router)
// Configure vuetify
loadFonts()
app.use(vuetify)
// toast
app.use(toast)

// Run!
router.isReady().then(() => {
  app.mount('#app')
})
