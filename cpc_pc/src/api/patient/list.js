import http from '@/utils/request'

export const queryPatientList = (params) => {
  return http({
    url: 'regist/getRegistPage',
    method: 'post',
    data: params
  })
}

export const getQueryPatients = params => {
  const url = '/regist/getPatientList'
  return http({
    url: url,
    method: 'post',
    data: params
  })
}

export const getPatientNo = params => {
  const url = '/regist/getPatientNo'
  return http({
    url: url,
    method: 'post',
    data: params
  })
}

export const saveMedicalRecord = params => {
  const url = `/regist/saveMedicalRecord`
  return http({
    url: url,
    method: 'post',
    data: params
  })
}

export const getPatientInfo = params => {
  const url = '/regist/getPatientInfo'
  return http({
    url: url,
    method: 'post',
    data: params
  })
}

export const deletePatient = params => {
  return http({
    url: '/regist/deletePatient',
    method: 'post',
    data: params
  })
}

export const deletePatientInBatches = params => {
  return http({
    url: '/regist/deletePatientInBatches',
    method: 'post',
    data: params
  })
}

export const recoverPatient = params => {
  return http({
    url: '/regist/recoverPatient',
    method: 'post',
    data: params
  })
}

export const completelyDeletePatient = params => {
  return http({
    url: '/regist/completelyDeletePatient',
    method: 'post',
    data: params
  })
}

export const getRfTags = params => {
  return http({
    url: '/regist/getRfTagList',
    method: 'get',
    params: params
  })
}

export const setRfTagId = params => {
  return http({
    url: '/regist/bindRfid',
    method: 'post',
    data: params
  })
}
