import request from '@utils/http/request'

const api = {
  QueryPatient: '/piat/SecondaryTriage/getpatientsecondcheck',
  addsecondcheck: '/piat/SecondaryTriage/addsecondcheck',
  getsecondcheck: '/piat/SecondaryTriage/getsecondcheck',
  queryByCodeList: '/piat/SecondaryTriage/getsecondcheck',
  SecondaryTriageEcho: '/piat/SecondaryTriage/SecondaryTriageEcho'
}

export default api

// get
export function regDetails(id, parameter) {
  return request({
    url: api.regDetails + '/' + id,
    method: 'get',
    params: parameter
  })
}

// 查询二次分诊患者
export function QueryPatient(params) {
  return request({
    url: api.QueryPatient,
    method: 'post',
    data: params
  })
}

// 查询患者二次分诊记录
export function getsecondcheck(id, params) {
  return request({
    url: api.getsecondcheck + '?regid=' + id,
    method: 'post',
    data: params
  })
}

// 添加数据
export function addsecondcheck(params) {
  return request({
    url: api.addsecondcheck,
    method: 'post',
    data: params
  })
}

//查询就诊科室
export function queryByCodeList(params) {
  return request({
    url: api.queryByCodeList,
    method: 'post',
    data: params
  })
}

//查询就诊科室
export function SecondaryTriageEcho(id, type, params) {
  return request({
    url: api.SecondaryTriageEcho + '?id=' + id + '&type=' + type,
    method: 'post',
    data: params
  })
}
