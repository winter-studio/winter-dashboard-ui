import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
// @ts-ignore
import colors from 'vuetify/lib/util/colors'

// Vuetify
import { createVuetify } from 'vuetify'

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

export default vuetify
