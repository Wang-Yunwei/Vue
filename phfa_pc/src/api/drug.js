import http from '@/utils/request'
// 药品 - 保存or更新
export const drugSaveOrUpdate = params => {
  return http({
    url: '/pc/DrugController/v1/drugSaveOrUpdate',
    method: 'post',
    data: params
  })
}
// 药品 - 删除
export const drugDelete = params => {
  return http({
    url: '/pc/DrugController/v1/drugDelete',
    method: 'post',
    data: params
  })
}
// 药品分组列表
export const getDrugGroupedList = () => {
  return http({
    url: '/pc/DrugController/v1/drugGroupByList',
    method: 'get'
  })
}
// 新增/修改患者用药
export const saveOrUpdatePatientDrug = (params) => {
  return http({
    url: '/medPhepEmergencyOrders/saveOrUpdate',
    method: 'post',
    data: params
  })
}
// 删除患者用药
export const deletePatientDrug = (orderId) => {
  return http({
    url: `/medPhepEmergencyOrders/deleteEmergencyOrdersById/${orderId}`,
    method: 'Post'
  })
}
// 患者用药信息
export const queryDrugByPatientId = (patientId) => {
  return http({
    url: `/medPhepEmergencyOrders/queryByPatientId/${patientId}`,
    method: 'get'
  })
}
// 药品
export const queryDrugsList = () => {
  return http({
    url: '/medPhepDrugs/queryDrugsList',
    method: 'get'
  })
}
// 查询患者用药信息
export const queryByPatientId = patientId => {
  return http({
    url: '/medPhepEmergencyOrders/queryByPatientId/' + patientId,
    method: 'get'
  })
}
// 药品 - 分页列表
export const drugPageList = params => {
  return http({
    url: '/pc/DrugController/v1/drugPageList',
    method: 'post',
    data: params
  })
}
// 药品 - 专科对应类别
export const specialistCategory = params => {
  return http({
    url: '/pc/DrugController/v1/specialistCategory',
    method: 'post',
    data: params
  })
}
