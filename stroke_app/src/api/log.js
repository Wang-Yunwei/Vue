import axios from '@utils/http/api'

/**
 * 根据登记号获取病历的操作历史记录
 * @param registId 登记号
 * @returns {*}
 */
const getOperationHistory = registId => {
  return axios({
    url: `/op/history/registId/${registId}`,
    method: 'get'
  })
}

// 默认全部导出
export default {
  getOperationHistory
}
