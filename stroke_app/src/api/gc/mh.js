import axios from '@utils/http/api'

/**
 * 保存病历记录信息
 * @param params 病历记录信息
 * @returns {*}
 */
export const saveGcMh = params => {
  const url = `/gc/mh`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  saveGcMh
}
