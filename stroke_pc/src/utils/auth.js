import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
// const JwtTokenKey = 'Jwt-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // 设置 Cookie 2小时过期
  return Cookies.set(TokenKey, token, 60 * 60 * 2)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// export function getJwtToken() {
//   return Cookies.get(JwtTokenKey)
// }

// export function setJwtToken(token) {
//   return Cookies.set(JwtTokenKey, token)
// }

// export function removeJwtToken() {
//   return Cookies.remove(JwtTokenKey)
// }
