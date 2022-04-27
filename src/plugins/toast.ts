import VToast from '@/components/utils/VToast.vue'
import { App, createApp } from 'vue'
import { Toast, ToastOptions } from '@/types/toast'

const mountId = 'toast-mount-point'

const vuetifyToast: Toast = {
  error(message: string, options: ToastOptions | undefined): void {
    this.show(message, Object.assign(options || {}, { color: 'error' }))
  },
  info(message: string, options: ToastOptions | undefined): void {
    this.show(message, Object.assign(options || {}, { color: 'info' }))
  },
  success(message: string, options: ToastOptions | undefined): void {
    this.show(message, Object.assign(options || {}, { color: 'success' }))
  },
  warn(message: string, options: ToastOptions | undefined): void {
    this.show(message, Object.assign(options || {}, { color: 'warn' }))
  },
  show(message: string, options: ToastOptions | undefined): void {
    if (options) {
    }
    let mountPoint = document.getElementById(mountId)
    if (!mountPoint) {
      mountPoint = document.createElement('div')
      mountPoint.id = mountId
    }
    createApp(VToast, { message }).mount(mountPoint)
  }
}

const toast = {
  install(app: App) {
    // mount a div to #app
    const appEl = document.getElementById('app')
    const mountPoint = document.createElement('div')
    mountPoint.id = mountId
    appEl!.appendChild(mountPoint)
    app.config.globalProperties.$toast = vuetifyToast
  }
}

export default toast
