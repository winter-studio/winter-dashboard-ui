import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL ?? '',
  timeout: 10000
})

export { http as axios }
