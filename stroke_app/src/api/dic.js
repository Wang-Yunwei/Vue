import axios from '@utils/http/api'
// 字典表
const queryByCodeList = params => {
  return axios({
    url: '/dic/queryByCodeList',
    method: 'post',
    data: params
  })
}

const queryScoreList = params => {
  return axios({
    url: '/ratingscaleItem/queryList',
    method: 'post',
    data: params
  })
}

// 默认全部倒出
export default {
  queryByCodeList,
  queryScoreList
}
