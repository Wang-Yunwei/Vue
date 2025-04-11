import http from '@/utils/request'

const validateApi = {
  /**
 * 根据登记号校验时间先后顺序
 * @param registId 登记号
 * @returns {*}
 */
  timeRestriction(registId) {
    return http({
      url: `/validation/timeRestriction/${registId}`,
      method: 'get'
    })
  }
}

export default validateApi
