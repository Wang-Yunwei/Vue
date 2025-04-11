import axios from '@utils/http/api'

/**
 * 分页查询患者信息
 * @param params
 * @returns {*}
 */
export const getBasicInformationPage = params => {
  const url = `/gc/basicInformation/page`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

// 查询患者急救信息
export const getFirstAidList = registId => {
  const url = `/gc/medSwmGcFirstAid/getFirstAidList?registId=${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}

// 查询患者急救信息
export const getFirstOutrefera = registId => {
  const url = `/gc/outReferral/getFirstOutrefera?registId=${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}
// 添加修改患者急救信息
export const updateFirstAidList = params => {
  const url = `/gc/medSwmGcFirstAid/updateFirstAidList`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

// 添加修改患者急救信息
export const updateOutreferalList = params => {
  const url = `/gc/outReferral/updateOutreferalList`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
// 默认全部倒出
export default {
  getBasicInformationPage,
  getFirstAidList,
  updateOutreferalList,
  getFirstOutrefera,
  updateFirstAidList
}
