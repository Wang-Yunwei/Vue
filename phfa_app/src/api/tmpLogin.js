import http from '@utils/http'

// 获取权限Token
export function getAuthToken(data) {
  return http({
    url: '/CommonController/v1/login/getAuthToken',
    method: 'post',
    data: data
  })
}