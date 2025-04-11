import axios from '@utils/http/api'
// 附件
/**
 * 根据登记号和附件类型获取附件列表
 * @param registId 登记号
 * @param use 附件类型
 * @returns {*}
 */
const getAttachList = (registId, use) => {
  return axios({
    url: `/attach/registId/${registId}/use/${use}`,
    method: 'get'
  })
}

const saveAttachList = (registId, params) => {
  return axios({
    url: `/attach/registId/${registId}`,
    method: 'post',
    data: params
  })
}

const deleteOne = id => {
  return axios({
    url: `/attach/id/${id}`,
    method: 'delete'
  })
}

// 默认全部导出
export default {
  getAttachList,
  saveAttachList,
  deleteOne
}
