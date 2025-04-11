import axios from '@utils/http/api'

export function login(parameter) {
  return axios({
    url: `/oauth2/password?password=${parameter.password}&username=${parameter.loginName}&grant_type=password&client_id=chestpain&client_secret=sdbd`,
    // '/oauth2/password?password=admin&username=admin&grant_type=password&client_id=chestpain&client_secret=sdbd',
    method: 'post',
    params: parameter
  })
}
export default {
  login
}
