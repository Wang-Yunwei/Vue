import http from '@/utils/request'

export function getAuthToken(data) {
  return http({
    url: 'pc/auth/login/getAuthToken',
    method: 'post',
    data
  })
}

export function getBusinessToken(data) {
  return http({
    url: 'pc/auth/login/getBusinessToken',
    method: 'get',
    data
  })
}

export function getUserBackMenu() {
  return http({
    url: '/resource/resources_by_user',
    method: 'get'
  })
}

export function getAllSource() {
  return http({
    url: 'authority/clientresourcelist',
    method: 'get'
  })
}
