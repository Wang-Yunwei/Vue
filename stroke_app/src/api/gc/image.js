import axios from '@utils/http/api'

/**
 * 保存影像学检查信息
 * @param params 影像学检查信息
 * @returns {*}
 */
export const saveGcImage = (registId, params) => {
  const url = `/gc/image/registId/${registId}`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 时间采集，保存或更新影像时间
 * @param params 影像学时间
 * @returns {*}
 */
export const timeCollection = params => {
  const url = `/gc/image/timeCollection`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export default {
  saveGcImage,
  timeCollection
}
