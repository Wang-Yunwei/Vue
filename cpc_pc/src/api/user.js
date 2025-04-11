import request from '@/utils/request'
const userApi = {
  // Access: '/oauth2/password',
  // Login: '/authority/me',
  exchangeToken: '/authInfo/getClientAccTokenByJwt',
  Access: '/auth/password',
  Login: '/auth/pclogin',
  GetUserBackMenu: '/resource/resources_by_user',
  GetAllSource: 'authority/clientresourcelist',
  getUserPermission: 'authority/getloginuserinfo',
  ModifyPassword: '/auth/updatePassword'
}

export function access(parameter) {
  return request({
    url: userApi.Access,
    method: 'post',
    data: parameter
  })
}

export function exchangeToken(parameter) {
  return request({
    url: userApi.exchangeToken,
    method: 'post',
    data: parameter
  })
}

export function getUserPermission(params) {
  return request({
    url: userApi.getUserPermission,
    method: 'get',
    param: params
  })
}

export function login(parameter) {
  return request({
    url: userApi.Login,
    method: 'get',
    data: parameter
  })
}

export function getUserBackMenu() {
  return request({
    url: userApi.GetUserBackMenu,
    method: 'get'
  })
}

export function getAllSource() {
  return request({
    url: userApi.GetAllSource,
    method: 'get'
  })
}

export function modifyPwd(params) {
  return request({
    baseURL: window.GLOBAL_APP_API_BASE_URL + '/chestpain',
    url:
      userApi.ModifyPassword +
      `?old=${params.old}&password=${params.password}&id=${params.id}`,
    method: 'put'
  })
}
