import http from '@utils/http'

// Auth - 获取权限Token
export function getAuthToken(data) {
  return http({
    url: `/CommonController/v1/login/getAuthToken`,
    method: 'post',
    data
  })
}
// Auth - 获取权限Token
export function getBusinessToken(data) {
  return http({
    url: `/CommonController/v1/login/getBusinessToken`,
    method: 'post',
    data
  })
}
// Auth - 获取医院列表
export function getHospitals() {
  return http({
    url: `/CommonController/v1/getHospitals`,
    method: 'get'
  })
}