import axios from '@utils/http/api'

/**
 * 上传心电图
 * @param params
 * @returns {Promise<{[p: string]: *}>}
 */
const upload = async params => {
  const res = await axios({
    method: 'post',
    url: '/ecg/upload',
    data: params,
    headers: {
      AppId: 'stroke'
    }
  })
  return {
    ...res
    // eslint-disable-next-line
    // result: GLOBAL_APP_API_BASE_URL + res.result // 拼接前缀
  }
}

// 查询心电图list
const getEcg = (registId, ecgType) => {
  const params = { registId: registId, ecgType: ecgType }
  const url = `/ecg/getElectrocardiogram`
  return axios({
    url: url,
    method: 'get',
    params: params
  })
}

// 保存心电图信息
const saveEcg = params => {
  const url = `/ecg/saveElectrocardiogram`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
// 删除心电图信息
const deleteEcg = id => {
  const url = `/ecg/id/${id}`
  return axios({
    url: url,
    // method: 'delete'
    method: 'get'
  })
}

/**
 * 时间采集，保存或更新心电图完成时间
 * @param params 心电图完成
 * @returns {*}
 */
export const timeCollection = params => {
  const url = `/ecg/timeCollection`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

// 默认全部倒出
export default {
  upload,
  getEcg,
  saveEcg,
  deleteEcg,
  timeCollection
}
