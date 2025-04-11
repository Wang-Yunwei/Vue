import axios from '@utils/http/api'

/**
 * @param params
 * @returns {Promise<{[p: string]: *}>}
 * @deprecated
 */
const upload = async params => {
  const res = await axios({
    method: 'post',
    url: '/gc/medswmecg/upload',
    data: params,
    headers: {
      AppId: 'stroke'
    }
  })
  return {
    ...res
    // eslint-disable-next-line
    // result: GLOBAL_APP_API_BASE_URL + res.result // 拼接前缀
  }
}

/**
 * 把患者推送给住院
 * @param params
 * @returns {*}
 */
const notifyHospitalAdmission = params => {
  return axios({
    method: 'post',
    url: '/external/gc/notify/hospitalAdmission',
    data: params
  })
}

// 默认全部倒出
export default {
  upload,
  notifyHospitalAdmission
}
