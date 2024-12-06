import http from '@/utils/request'

// 病历管理 - 保存or修改
export const mrmSaveOrUpdate = params => {
  return http({
    url: '/pc/MedicalRecordManageController/v1/mrmSaveOrUpdate',
    method: 'post',
    data: params
  })
}
// 病历管理 - 删除
export const mrmDelete = params => {
  return http({
    url: '/pc/MedicalRecordManageController/v1/mrmDelete',
    method: 'post',
    data: params
  })
}
// 病历管理 - 详情
export const mrmDetails = params => {
  return http({
    url: '/pc/MedicalRecordManageController/v1/mrmDetails',
    method: 'post',
    data: params
  })
}
// 病历管理 - 列表
export const mrmPageList = params => {
  return http({
    url: '/pc/MedicalRecordManageController/v1/mrmPageList',
    method: 'post',
    data: params
  })
}

// 病历管理-时间轴
export const getTimeAxis = (missionId) => {
  return http({
    url: `/pc/MedicalRecordManageController/v1/timeAxis/${missionId}`,
    method: 'get'
  })
}

// 病历管理-时间轴编辑
export const updateTimeAxis = params => {
  return http({
    url: `/pc/MedicalRecordManageController/v1/timeAxisUpdate`,
    method: 'post',
    data: params
  })
}

// 根据患者ID病历新增or修改
export const updateByPatientId = params => {
  return http({
    url: '/medPhepMedicalRecords/updateByPatientId',
    method: 'post',
    data: params
  })
}
