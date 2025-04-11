import axios from 'axios'
import qs from 'qs'
import { Notify, Dialog } from 'vant'
import storage from 'store'
import { SET_ACCESS_TOKEN } from '@store/mutations/mutations-types'
import Bridge from '@/utils/bridge'

const config = {
  method: 'get',
  baseURL: window.GLOBAL_APP_API_BASE_URL + '/chestpain',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  data: {},
  timeout: 10000,
  withCredentials: false,
  responseType: 'json'
}

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseURL,
      headers: {}
    })

    instance.interceptors.request.use(
      config => {
        const token = storage.get(SET_ACCESS_TOKEN)
        if (token) {
          config.headers['jwt-token'] = token
        }
        if (config.url && config.url.substring(0, 7) === '/files/') {
          config.headers['Conten-Type'] = 'multipart/form-data;charse=UTF-8'
          config.url = config.url.slice(6)
        } else {
          config.headers['Conten-Type'] = 'application/json;charset=utf-8'
        }

        if (
          config.method.toLocaleLowerCase() === 'get' ||
          config.method.toLocaleLowerCase() === 'delete'
        ) {
          config.data = qs.stringify(config.data)
        }
        return config
      },
      error => {
        if (
          error.code === 'ECONNABORTED' &&
          error.message.indexOf('timeout') !== -1
        ) {
          // return service.request(originalRequest);
        }
        const errorInfo = error.response

        if (errorInfo) {
          const errorStatus = errorInfo.status
          // eslint-disable-next-line
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return Promise.reject(error)
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        let data
        if (response.data === undefined) {
          data = JSON.parse(response.request.responseText)
        } else {
          data = response.data
        }

        if (data.status === 203100) {
          Dialog.confirm({
            title: '提示',
            message: `系统登录长时间未使用，授权已过期，请重新登录。`,
            showCancelButton: false
          }).then(() => {
            Bridge.exit()
          })

          throw new Error('授权已过期')
        }
        return data
      },
      err => {
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
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
          Notify({ type: 'danger', message: err.message })
        } else if (err.isAxiosError) {
          Notify({
            type: 'danger',
            message: '网络异常，原因：' + err.config.url
          })
        }
        return Promise.reject(err) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    instance(options)
      .then(res => {
        if (res && res.code === '10') {
          reject(res)
        } else {
          resolve(res)
        }
        return false
      })
      .catch(error => {
        reject(error)
      })
  })
}
