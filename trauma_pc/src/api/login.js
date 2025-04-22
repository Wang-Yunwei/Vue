import http from '@/utils/request'

export function getAuthTokenSso(params) {
  return http({
    url: 'pc/auth/login/getTokenBySSO',
    method: 'GET',
    params
  })
}
export function getAuthToken(data) {
  return http({
    url: 'pc/auth/login/getAuthToken',
    method: 'POST',
    data
  })
}
export function getBusinessToken(data) {
  return http({
    url: 'pc/auth/login/getBusinessToken',
    method: 'GET',
    data
  })
}
export function getUserBackMenu() {
  return http({
    url: '/resource/resources_by_user',
    method: 'GET'
  })
}
export function getAllSource() {
  return http({
    url: 'authority/clientresourcelist',
    method: 'GET'
  })
}
