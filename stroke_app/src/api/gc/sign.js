import axios from '@utils/http/api'

/**
 * 保存绿通体征信息
 * @param params 绿通体征信息
 * @returns {*}
 */
export const saveGcSign = params => {
  const url = `/gc/sign`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  saveGcSign
}
