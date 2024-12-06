import request from '@utils/http/request'

const api = {
  Access: '/piat/CommonController/v1/login/getAuthToken',
  GetUserInfo: '/piat/CommonController/v1/login/getBusinessToken',
  GetUserBackMenu: '/resource/resources_by_user',
  GetAllSource: '/piat/authority/clientresourcelist',
  UserMenu: '/user/nav'
}

export default api

export function access(parameter) {
  return request({
    url: api.Access,
    method: 'post',
    data: parameter
  })
}

export function getUserInfo(parameter) {
  return request({
    url: api.GetUserInfo,
    method: 'post',
    data: parameter
  })
}

export function getUserBackMenu() {
  return request({
    url: api.GetUserBackMenu,
    method: 'get'
  })
}

export function getAllSource() {
  return request({
    url: api.GetAllSource,
    method: 'get'
  })
}

export function getCurrentUserNav() {
  return request({
    url: api.UserMenu,
    method: 'get'
  })
}
