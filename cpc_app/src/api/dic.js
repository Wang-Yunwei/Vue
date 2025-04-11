import axios from '@utils/http/api'
// 字典表
export const queryByCodeList = params => {
  return axios({
    url: '/base/getDicData',
    method: 'post',
    data: params
  })
}

export const queryScoreList = params => {
  return axios({
    url: '/dic/base/ratingscaleItem/queryList',
    method: 'post',
    data: params
  })
}

/**
 * 上传文件
 * @param params
 * @returns {*}
 */
const upload = params => {
  return axios({
    headers: {
      AppId: 'chestpain'
    },
    method: 'post',
    url: '/files/dic/base/file/upload',
    data: params
  })
}

/**
 * 获取用户所在的医院列表
 * @param params
 * @returns {*}
 */
const getUserHospitalList = params => {
  const url = '/dic/base/hospitals/list'
  return axios({
    url: url,
    method: 'post'
  })
}

// 默认全部倒出
export default {
  queryByCodeList,
  queryScoreList,
  getUserHospitalList,
  upload
}
