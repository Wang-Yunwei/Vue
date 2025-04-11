import axios from '@utils/http/api'

/**
 * 时间采集，保存或更新院前急救时间
 * @param params 院前急救
 * @returns {*}
 */
export const timeCollection = params => {
  const url = `/gc/medSwmGcFirstAid/timeCollection`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  timeCollection
}
