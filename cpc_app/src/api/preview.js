import axios from '@utils/http/api'

// 绿通病历全览
const getPreviewList = registId => {
  const url = `/gc/preview/registId/${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}

// 急救病历全览
const getfirstAidList = (emId, infoComingType, hospitalId) => {
  const url = `/gc/preview/getfirstAidList?emId=${emId}&infoComingType=${infoComingType}&hospitalId=${hospitalId}`
  return axios({
    url: url,
    method: 'post'
  })
}

// 病历预览-分诊预览
const getTriagePreview = (emId, infoComingType, hospitalId) => {
  const url = `/gc/preview/getTriagePreview?emId=${emId}&infoComingType=${infoComingType}&hospitalId=${hospitalId}`
  return axios({
    url: url,
    method: 'post'
  })
}
// 病历全览-检查/检验
const getInspectList = (emId, infoComingType, hospitalId) => {
  const url = `/gc/preview/getInspectList?emId=${emId}&infoComingType=${infoComingType}&hospitalId=${hospitalId}`
  return axios({
    url: url,
    method: 'post'
  })
}

// 病历全览-检查/用药
const getMedicationList = (emId, infoComingType, hospitalId) => {
  const url = `/gc/preview/getMedicationList?emId=${emId}&infoComingType=${infoComingType}&hospitalId=${hospitalId}`
  return axios({
    url: url,
    method: 'post'
  })
}

export default {
  getPreviewList,
  getTriagePreview,
  getInspectList,
  getMedicationList,
  getfirstAidList
}
