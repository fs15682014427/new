import axios from "axios";
import uesUserStore from '@/store/modules/user'

let request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use((config) => {
  const userStore = uesUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

request.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  if (error) {
    const { status } = error.response
    if (status === 401) {
      localStorage.removeItem("token")
      window.location.href = '#/login'
    }
    return Promise.reject(error)
  } else {
    return
  }
})

export default request