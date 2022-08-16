import { createI18n } from 'vue-i18n'
import { App } from 'vue'

const supportedLocales = [
  { test: /^en\b/, locale: 'en-US' },
  { test: 'zh-CN', locale: 'zh-CN' }
]

function getCurrentLocale() {
  if (navigator.languages) {
    const locale = navigator.language
    for (const supportedLocale of supportedLocales) {
      if (typeof supportedLocale.test === 'string' && supportedLocale.test === locale) {
        return supportedLocale.locale
      } else if (supportedLocale.test instanceof RegExp && supportedLocale.test.test(locale)) {
        return supportedLocale.locale
      }
    }
  }
  return 'en-US'
}

const messages = {
  en: {
    views: {
      dashboard: {
        workplace: {
          hello: 'Hello'
        }
      }
    }
  },
  'zh-CN': {
    views: {
      dashboard: {
        workplace: {
          hello: '您好'
        }
      }
    }
  }
}

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: getCurrentLocale(), // set locale
  fallbackLocale: 'en', // set fallback locale,
  messages
})

export function setUpI18n(app: App) {
  app.use(i18n)
}
