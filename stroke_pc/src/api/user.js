import request from '@/utils/request'
const userApi = {
  Access: '/auth/password',
  Login: '/auth/login',
  GetUserBackMenu: '/resource/resources_by_user',
  GetAllSource: 'authority/clientresourcelist',
  ChangePw: '/auth/change/password'
}

export function access(parameter) {
  return request({
    url: userApi.Access,
    method: 'post',
    data: parameter
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

export function changePw(data) {
  return request({
    url: userApi.ChangePw,
    method: 'POST',
    data: data
  })
}
