import axios from '@utils/http/api'

/**
 * 查询外院转诊
 * @param registId 登记号
 * @returns {*}
 */
const getOutReferral = registId => {
  const url = `/gc/outReferral/registId/${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}

// 默认全部倒出
export default {
  getOutReferral
}
