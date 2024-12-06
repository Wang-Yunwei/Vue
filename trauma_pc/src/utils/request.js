import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: window.GLOBAL_APP_API_BASE_URL || process.env.VUE_APP_BASE_API,
  timeout: 8000
})

service.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers['jwt-token'] = token
    config.headers['Hospital-Id'] = store.getters.hospitalId
    config.headers['Hospital-Area'] = store.getters.hospitalArea
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => response.data, error => {
  const obj = error.response.data
  Message({
    message: obj.code === '103012' ? `登录失败：${obj.message}` : obj.message,
    type: 'error',
    duration: 5 * 1000
  })
})

export default service
