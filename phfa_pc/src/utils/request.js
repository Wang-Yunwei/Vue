import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import md5 from 'js-md5'
import router from '@/router'

const service = axios.create({
  baseURL: GLOBAL_APP_API_BASE_URL,
  timeout: 8000
})

service.interceptors.request.use(config => {
  if (store.getters.businessToken) {
    config.headers['Jwt-Token'] = store.getters.businessToken
  }
  if (router.history.current.path === '/view-patient') {
    // 查看模式 特殊放行标记
    config.headers.mdsd = md5('das')
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => response.data, error => {
  Message({
    message: error.response.data.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

export default service
