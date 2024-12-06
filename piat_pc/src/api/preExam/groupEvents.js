import request from '@utils/http/request'

const api = {
  groupDetails: '/piat/GroupEvents/gesSaveOrUpdate',
  gesSelectByIdList: '/piat/GroupEvents/gesSelectByIdList',
  selectList: '/piat/GroupEvents/selectList',
  exportExcel: '/piat/GroupEvents/exportExcel',
  updateStatus: '/piat/GroupEvents/updateStatus',
  disassociate: '/piat/GroupEvents/disassociate',
  bindingCardInfoList: '/piat/GroupEvents/bindingCardInfoList',
  selectPatientSay: '/piat/GroupEvents/selectPatientSay',
  selectByCardInfo: '/piat/GroupEvents/selectByCardInfo'
}

export default api

// post
export function gesSaveOrUpdate(params) {
  return request({
    url: api.groupDetails,
    method: 'post',
    data: params
  })
}
// post
export function gesSelectByIdList(params, parameter) {
  return request({
    url: api.gesSelectByIdList,
    method: 'post',
    data: params,
    params: parameter
  })
}
//查询群伤事件list
export function selectList(params, parameter) {
  return request({
    url: api.selectList,
    method: 'post',
    data: params,
    params: parameter
  })
}

//导出excel
export function exportExcel(params) {
  return request({
    url: api.exportExcel,
    method: 'post',
    data: params
  })
}

//修改状态
export function updateStatus(params, status) {
  return request({
    url: api.updateStatus + '/' + status,
    method: 'post',
    data: params
  })
}

//修改关联卡号
export function disassociate(params) {
  return request({
    url: api.disassociate,
    method: 'post',
    data: params
  })
}

//绑定卡号
export function bindingCardInfoList(params, eventId) {
  return request({
    url: api.bindingCardInfoList + '/' + eventId,
    method: 'post',
    data: params
  })
}

//查询主诉
export function selectPatientSay(params) {
  return request({
    url: api.selectPatientSay,
    method: 'post',
    data: params
  })
}

//查询患者列表
export function selectByCardInfo(params) {
  return request({
    url: api.selectByCardInfo,
    method: 'post',
    data: params
  })
}
