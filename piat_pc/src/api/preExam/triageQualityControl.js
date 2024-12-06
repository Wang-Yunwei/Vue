import request from '@utils/http/request'

const api = {
  queryPatientProportionReport: '/piat/triageQualityControl/queryPatientProportionReport',
  queryPatientProportionDetailReport: '/piat/triageQualityControl/queryPatientProportionDetailReport',
  queryMonthProportionReport: '/piat/triageQualityControl/queryMonthProportionReport',
  queryByArea: '/piat/medClinicMedicalNumber/queryByArea',
  queryList: '/piat/medClinicMedicalNumber/queryList',
  saveOrUpdateByKey: '/piat/medClinicMedicalNumber/saveOrUpdateByKey',
  getHospitals: '/piat/resource/getHospitals',
  patientDetailExport: '/piat/triageQualityControl/patientDetailExport',
  queryTriageWrongRatioDetail: '/piat/triageQualityControl/queryTriageWrongRatioDetail',
  queryTriageWrongRatio: '/piat/triageQualityControl/queryTriageWrongRatio',
  queryTriageWrongMonthRatio: '/piat/triageQualityControl/queryTriageWrongMonthRatio',
  queryTriageWrongDetailExport: '/piat/triageQualityControl/queryTriageWrongDetailExport'
}

export default api

// get
export function queryPatientProportionReport(parameter) {
  return request({
    url: api.queryPatientProportionReport,
    method: 'get',
    params: parameter
  })
}

// get
export function queryPatientProportionDetailReport(parameter) {
  return request({
    url: api.queryPatientProportionDetailReport,
    method: 'get',
    params: parameter
  })
}

// get
export function queryMonthProportionReport(parameter, status) {
  return request({
    url: api.queryMonthProportionReport + '/' + status,
    method: 'get',
    params: parameter
  })
}

// get
export function queryByArea(parameter) {
  return request({
    url: api.queryByArea,
    method: 'get',
    params: parameter
  })
}

// post
export function queryList(parameter) {
  return request({
    url: api.queryList,
    method: 'post',
    data: parameter
  })
}

// post
export function saveOrUpdateByKey(parameter) {
  return request({
    url: api.saveOrUpdateByKey,
    method: 'post',
    data: parameter
  })
}
// 获取医院
export function getHospitals(parameter) {
  return request({
    url: api.getHospitals,
    method: 'post',
    data: {
      clientSign: 'firstAid',
      clientSecret: 'xiangmu3'
    }
  })
}
// post
export function patientDetailExport(parameter) {
  return request({
    url: api.patientDetailExport,
    method: 'post',
    data: parameter
  })
}

// get
export function queryTriageWrongRatioDetail(parameter) {
  return request({
    url: api.queryTriageWrongRatioDetail,
    method: 'get',
    params: parameter
  })
}

// get
export function queryTriageWrongRatio(parameter) {
  return request({
    url: api.queryTriageWrongRatio,
    method: 'get',
    params: parameter
  })
}

// get
export function queryTriageWrongMonthRatio(parameter, status) {
  return request({
    url: api.queryTriageWrongMonthRatio + '/' + status,
    method: 'get',
    params: parameter
  })
}

// get
export function queryTriageWrongDetailExport(parameter) {
  return request({
    url: api.queryTriageWrongDetailExport,
    method: 'get',
    params: parameter
  })
}
