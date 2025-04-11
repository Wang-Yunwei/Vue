/* eslint-disable */
import http from '@/utils/request'

const api = {
  updateIsDeleteCompletedReportBatch: `/desktop/gc/updateIsDeleteCompletedReportBatch`,
  deletePatient: `/desktop/gc/deleteAllByRegistId`,
  queryPatientPage: '/desktop/gc/basic/page',
  getTimeline: '/desktop/gc/getTimeline',
  getHospitals: '/desktop/gc/getHospitals',
  getGcPatientDetail: `/desktop/gc/patient/detail/registId`,
  setGcPatientDetail: `/desktop/gc/patient/setDetail`,
  getRfTagList: `/desktop/gc/getRfTagList`,
  setRfTagId: `/desktop/gc/setRfTagId`,
  getDoctors: `/gc/thirdParty/getDoctorList`,
  queryPatients: '/gc/thirdParty/queryPatients',
  queryNoFillPatients: '/desktop/gc/getNoFillPatientList',
  insertBasicInformation: `/gc/basicInformation/insertBasicInformation`,
  addPatientDetails: `/gc/thirdParty/addPatientDetails`,
  getPatientDetails: `/gc/thirdParty/getPatientDetails`,
  getEmIdPatient: `/gc/thirdParty/getEmIdPatient`,
  initWithDepartment: `/gc/thirdParty/init/dept`,
  bindWithDepartment: `/gc/thirdParty/bind/dept`
}

const patientApi = {
  //  根据医院部门绑定visitId
  bindWithDepartment(parameter) {
    return http({
      url: api.bindWithDepartment,
      method: 'post',
      data: parameter
    })
  },
  // 把患者空白病历关联到医院部门系统中
  initWithDepartment(parameter) {
    return http({
      url: api.initWithDepartment,
      method: 'post',
      data: parameter
    })
  },
  getEmIdPatient(params) {
    return http({
      url: api.getEmIdPatient,
      method: 'post',
      data: params
    })
  },
  // 获取时间轴
  getTimeline: function (registId, parameter) {
    return http({
      url: api.getTimeline + '/' + registId,
      method: 'get',
      params: parameter
    })
  },

  // 修改上报状态
  updateIsDeleteStatusReportStatusBatch: function (params) {
    return http({
      url: api.updateIsDeleteCompletedReportBatch,
      method: 'post',
      data: params
    })
  },

  deletePatient: function (params) {
    return http({
      url: api.deletePatient,
      method: 'post',
      data: params
    })
  },

  // 建档患者列表
  queryPatientPage: function (params) {
    return http({
      url: api.queryPatientPage,
      method: 'post',
      data: params
    })
  },

  // 获取医院
  getHospitals: function (parameter) {
    return http({
      url: api.getHospitals,
      method: 'get',
      params: parameter
    })
  },

  // 获取患者详情
  getGcPatientDetail: function (parameter) {
    return http({
      url: api.getGcPatientDetail,
      method: 'get',
      params: parameter
    })
  },

  // 保存患者详情
  setGcPatientDetail: function (parameter) {
    return http({
      url: api.setGcPatientDetail,
      method: 'post',
      data: parameter
    })
  },

  // 获取腕带数据
  getRfTags: function (parameter) {
    return http({
      url: api.getRfTagList,
      method: 'get',
      params: parameter
    })
  },

  // 绑定腕带数据
  setRfTagId: function (parameter) {
    return http({
      url: api.setRfTagId,
      method: 'post',
      data: parameter
    })
  },

  // 获取医生信息列表
  getDoctors: function (parameter) {
    return http({
      url: api.getDoctors,
      method: 'post',
      data: parameter
    })
  },

  // 查询绿通急救患者列表
  getThirdPartyPatients: function (parameter) {
    return http({
      url: api.queryPatients,
      method: 'post',
      data: parameter
    })
  },

  getNoFillPatientList: function (parameter) {
    return http({
      url: api.queryNoFillPatients,
      method: 'post',
      data: parameter
    })
  },

  //新增空白病历或修改基本信息
  insertBasicInformation: function (parameter) {
    return http({
      url: api.insertBasicInformation,
      method: 'post',
      data: parameter
    })
  },

  // 外部接口-添加
  addPatientDetails: function (parameter) {
    return http({
      url: api.addPatientDetails,
      method: 'post',
      data: parameter
    })
  },

  // 获取患者详情
  getPatientDetails: function (parameter) {
    return http({
      url: api.getPatientDetails,
      method: 'post',
      data: parameter
    })
  },

  //  手动同步患者病历
  syncPatientDetailManually: function (registId) {
    return http({
      url: `/gc/thirdParty/patient/detail/sync/registId/${registId}`,
      method: 'put'
    })
  }
}

export default patientApi
