import axios from '@utils/http/api'
import storage from 'store'
import * as types from '@/store/mutations/mutations-types'
export const permission = () => {
  const token = storage.get(types.SET_ACCESS_TOKEN)
  return axios({
    url: '/authInfo/getClientAccTokenByJwt',
    method: 'post',
    data: {
      clientId: 'chestpain',
      token: token
    }
  })
}
export const authorize = params => {
  return axios({
    url: '/authority/getloginuserinfo',
    method: 'get',
    param: params
  })
}

export default {
  permission,
  authorize
}
