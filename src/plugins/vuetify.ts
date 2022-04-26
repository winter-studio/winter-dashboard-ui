import '@mdi/font/css/materialdesignicons.css'
import { loadFonts } from './webfontloader'
import 'vuetify/styles'
// @ts-ignore
import colors from 'vuetify/lib/util/colors'

// Vuetify
import { createVuetify } from 'vuetify'
import type { App } from 'vue'

loadFonts()

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.blue.lighten1,
          secondary: colors.blue.lighten2
        }
      }
    }
  }
})

export default function setupVuetify(app: App<Element>) {
  app.use(vuetify)
}
