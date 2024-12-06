import request from '@utils/http/request'

const api = {
  getReceptionStatistics: '/piat/triageStatistics/getReceptionStatistics',
  queryDetailList: '/piat/triageStatistics/queryDetailList',
  queryTimeCount: '/piat/triageStatistics/queryTimeCount',
  queryYearCount: '/piat/triageStatistics/queryYearCount',
  queryMonthCount: '/piat/triageStatistics/queryMonthCount',
  queryAgeCount: '/piat/triageStatistics/queryAgeCount',
  queryToHospitalCount: '/piat/triageStatistics/queryToHospitalCount',
  queryToHospitalDetail: '/piat/triageStatistics/queryToHospitalDetail',
  exportToHospital: '/piat/triageStatistics/exportToHospital',
  detailExport: '/piat/triageStatistics/exportToHospital'
}

export default api

// get
export function getReceptionStatistics(parameter) {
  return request({
    url: api.getReceptionStatistics,
    method: 'get',
    params: parameter
  })
}

// get
export function queryDetailList(parameter) {
  return request({
    url: api.queryDetailList,
    method: 'get',
    params: parameter
  })
}
// get
export function queryTimeCount(parameter) {
  return request({
    url: api.queryTimeCount,
    method: 'get',
    params: parameter
  })
}
// get
export function queryYearCount(parameter) {
  return request({
    url: api.queryYearCount,
    method: 'get',
    params: parameter
  })
}
// get
export function queryMonthCount(parameter) {
  return request({
    url: api.queryMonthCount,
    method: 'get',
    params: parameter
  })
}
// get
export function queryAgeCount(parameter) {
  return request({
    url: api.queryAgeCount,
    method: 'get',
    params: parameter
  })
}

// get
export function queryToHospitalCount(parameter) {
  return request({
    url: api.queryToHospitalCount,
    method: 'get',
    params: parameter
  })
}

// get
export function queryToHospitalDetail(parameter) {
  return request({
    url: api.queryToHospitalDetail,
    method: 'get',
    params: parameter
  })
}

// get
export function exportToHospital(parameter) {
  return request({
    url: api.exportToHospital,
    method: 'get',
    params: parameter
  })
}

// get
export function detailExport(parameter) {
  return request({
    url: api.detailExport,
    method: 'get',
    params: parameter
  })
}
