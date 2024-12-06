import http from '@/utils/request'

// 质控管理 - 病种分类统计
export const qcDiseaseEntities = params => {
  return http({
    url: '/pc/QualityController/v1/qcDiseaseEntities',
    method: 'post',
    data: params
  })
}

// 质控管理 - 出车统计
export const qcOutCar = params => {
  return http({
    url: '/pc/QualityController/v1/qcOutCar',
    method: 'post',
    data: params
  })
}

// 质控管理 - 患者趋势
export const qcPatient = () => {
  return http({
    url: '/pc/QualityController/v1/qcPatient',
    method: 'get'
  })
}

// 质控管理 - 平均反应时间
export const qcMeanResponseTime = params => {
  return http({
    url: '/pc/QualityController/v1/qcMeanResponseTime',
    method: 'post',
    data: params
  })
}

// 质控管理 - 各时段出车统计
export const qcTimeIntervalOutCar = params => {
  return http({
    url: '/pc/QualityController/v1/qcTimeIntervalOutCar',
    method: 'post',
    data: params
  })
}

// 质控管理 - 各时段出车统计
export const qcMeanOutCarTime = params => {
  return http({
    url: '/pc/QualityController/v1/qcMeanOutCarTime',
    method: 'post',
    data: params
  })
}

// 质控管理 - 病历完成率
export const qcMedicalRecordEfficiency = params => {
  return http({
    url: '/pc/QualityController/v1/qcMedicalRecordEfficiency',
    method: 'post',
    data: params
  })
}

// 质控管理 - 急救措施统计
export const qcEmergencyTreatment = params => {
  return http({
    url: '/pc/QualityController/v1/qcEmergencyTreatment',
    method: 'post',
    data: params
  })
}
