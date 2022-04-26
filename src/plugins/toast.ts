// @ts-ignore
import VSnackbar from 'vuetify/components/VSnackbar'
import { App, createApp } from 'vue'

const plugin = {
  install(app: App, options: any) {
    options.global = options.global || {}

    const appEl = document.getElementById('app')
    const mountPoint = document.createElement('div')
    appEl!.appendChild(mountPoint)
    const notifier = createApp(VSnackbar).mount(mountPoint)

    app.provide('toast', notifier)
  }
}

export default plugin
