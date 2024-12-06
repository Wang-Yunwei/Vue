import request from '@/utils/request'

// 权限登入
export function access(parameter) {
  return request({
    url: '/CommonController/v1/login/getAuthToken',
    method: 'post',
    data: parameter
  })
}