import axios from '@utils/http/api'

export function login(parameter) {
  return axios({
    url:
      '/oauth2/password?password=admin&username=admin&grant_type=password&client_id=stroke&client_secret=stroke',
    method: 'post',
    params: parameter
  })
}
export default {
  login
}
