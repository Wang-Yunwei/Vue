import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getJwtToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: window.GLOBAL_APP_API_BASE_URL + '/chestpain', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    const token = getJwtToken()
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['jwt-token'] = token
    }

    if (config.url && config.url.substring(0, 7) === '/files/') {
      config.headers['Conten-Type'] = 'multipart/form-data;charse=UTF-8'
      config.url = config.url.slice(6)
    } else {
      config.headers['Conten-Type'] = 'application/json;charset=utf-8'
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data

    if (res instanceof Blob) {
      return res
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== '0') {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误啦'
          if (err.response.data.errCode === 100141) {
            err.message = err.response.data.message
          }
          break
        case 401:
          err.message = '未授权，请登录'
          break
        case 403:
          err.message = '拒绝访问'
          break
        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`
          break
        case 408:
          err.message = '请求超时'
          break
        case 500:
          err.message = '服务器内部错误'
          break
        case 501:
          err.message = '服务未实现'
          break
        case 502:
          err.message = '网关错误'
          break
        case 503:
          err.message = '服务不可用'
          break
        case 504:
          err.message = '网关超时'
          break
        case 505:
          err.message = 'HTTP版本不受支持'
          break
        default:
      }
      Message({ type: 'error', message: err.message })
    } else if (err.isAxiosError) {
      Message({ type: 'error', message: '网络异常' })
    }
    return Promise.reject(err) // 返回接口返回的错误信息
  }
)

export default service
