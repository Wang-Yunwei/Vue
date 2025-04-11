import axios from '@utils/http/api'

export function loginByPassword(parameter) {
  return axios({
    url: '/auth/password',
    method: 'post',
    data: parameter
  })
}

export function clientAccToken(token) {
  return axios({
    url: `/auth/clientAccToken/jwt?jwt-token=${token}`,
    method: 'get'
  })
}

export function login(parameter) {
  return axios({
    url: '/auth/login',
    method: 'get',
    params: parameter
  })
}

// 获取用户的资源
export function getResourceByUser(token) {
  return axios({
    url: '/auth/user/resource',
    method: 'get',
    headers: { 'access-token': token }
  })
}

export default {
  clientAccToken,
  login,
  loginByPassword,
  getResourceByUser
}
