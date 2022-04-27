export interface ToastOptions {
  timeout?: number
  color?: string
}

export interface Toast {
  info: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  warn: (message: string, options?: ToastOptions) => void
  success: (message: string, options?: ToastOptions) => void
  show: (message: string, options?: ToastOptions) => void
}
