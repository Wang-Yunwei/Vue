import http from '@/utils/request'

export const queryByCodeList = params => {
  return http({
    url: '/DataDictionaryController/v1/getDictByCodes',
    method: 'post',
    data: params
  })
}
// 查询无任务车辆列表
export const queryNoTaskVehicleList = (params) => {
  return http({
    url: `/pc/MedicalRecordManageController/v1/getNoTaskEmergencyCar`,
    method: 'get',
    params
  })
}

// 获取医院
export const getHospitals = () => {
  return http({
    url: '/CommonController/v1/getHospitals',
    method: 'get'
  })
}

export const queryHospitalArea = params => {
  return http({
    url: '/resource/getHospitalArea',
    method: 'post',
    data: params
  })
}

export const getUUID = (number) => {
  return http({
    url: `/CommonController/v1/getUUID${number ? '?number=' + number : ''}`,
    method: 'get'
  })
}

// 根据petientId查询医院,院区,任务,病历id
export const getIDsByPatientId = patientId => {
  return http({
    url: '/OtherController/v1/oneForFour/' + patientId,
    method: 'get'
  })
}
