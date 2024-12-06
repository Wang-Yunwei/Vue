import axios from 'axios'
import storage from 'store'
import { Notify } from 'vant'

const instance = axios.create({
  baseURL: window.GLOBAL_APP_API_BASE_URL,
  timeout: 1000,
})

instance.interceptors.request.use(config => {
  config.headers['Content-SHA-256'] = true
  const token = storage.get('businessToken')
  if (token) {
    config.headers['jwt-token'] = token
  }
  if (config.url.startsWith('/files/')) {
    config.headers['Conten-Type'] = 'multipart/form-data;charse=UTF-8'
    config.url = config.url.slice(6)
  }
  return config
}, error => {
  const errorInfo = error.response
  if (errorInfo) {
    const errorStatus = errorInfo.status
    router.push({
      path: `/error/${errorStatus}`
    })
  }
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  if (response.status === 200) {
    return response.data
  } else {
    return Promise.reject(response)
  }
}, error => {
  const message = error.response.data.message
  if (obj.code === '103012') {
    message = '登录失败! ' + message
  } else {
    message = message
  }
  Notify({ type: 'danger', message: error.message })
  return Promise.reject(error)
})

export default instance
