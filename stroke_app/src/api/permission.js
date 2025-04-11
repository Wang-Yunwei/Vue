import axios from '@utils/http/api'
export const permission = () => {
  var redirectUrl = `${window.GLOBAL_APP_API_BASE_URL}/oauth2/callback`
  return axios({
    url:
      '/oauth2/authorize?response_type=code&scope=openid&client_id=stroke&redirect_uri=' +
      redirectUrl,
    method: 'get'
  })
}
// 调用权限-获取院区
// export const getHospitalArea = params => {
//   const url = `/resource/getHospitalArea`
//   return axios({
//     url: url,
//     method: 'post',
//     data: params
//   })
// }
export const authorize = params => {
  return axios({
    url: '/authority/getloginuserinfo',
    method: 'get',
    param: params
  })
}

export default {
  permission,
  // getHospitalArea,
  authorize
}
