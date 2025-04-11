import axios from '@utils/http/api'

/**
 * 根据登记号校验时间先后顺序
 * @param registId 登记号
 * @returns {*}
 */
const timeRestriction = registId => {
  return axios({
    url: `/validation/timeRestriction/${registId}`,
    method: 'get'
  })
}

// 默认全部导出
export default {
  timeRestriction
}
