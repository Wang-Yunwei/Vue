import http from '@/utils/request'

// 绿通病历全览
export const getPreviewList = registId => {
  const url = `/gc/preview/registId/${registId}`
  return http({
    url: url,
    method: 'get'
  })
}

// 急救病历全览
export const getfirstAidList = (emId, infoComingType, hospitalId) => {
  const url = `/gc/preview/getfirstAidList?emId=${emId}&infoComingType=${infoComingType}&hospitalId=${hospitalId}`
  return http({
    url: url,
    method: 'post'
  })
}

// 病历预览-分诊预览
export const getTriagePreview = (emId, infoComingType, hospitalId) => {
  const url = `/gc/preview/getTriagePreview?emId=${emId}&infoComingType=${infoComingType}&hospitalId=${hospitalId}`
  return http({
    url: url,
    method: 'post'
  })
}
// 病历全览-检查/检验
export const getInspectList = (emId, infoComingType, hospitalId) => {
  const url = `/gc/preview/getInspectList?emId=${emId}&infoComingType=${infoComingType}&hospitalId=${hospitalId}`
  return http({
    url: url,
    method: 'post'
  })
}

// 病历全览-检查/用药
export const getMedicationList = (emId, infoComingType, hospitalId) => {
  const url = `/gc/preview/getMedicationList?emId=${emId}&infoComingType=${infoComingType}&hospitalId=${hospitalId}`
  return http({
    url: url,
    method: 'post'
  })
}
