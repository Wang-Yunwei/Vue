import http from '@/utils/request'

export const getThirdPartyPatients = params => {
  return http({
    url: '/gc/thirdParty/queryPatients',
    method: 'post',
    data: params
  })
}

export const getEmIdPatient = params => {
  return http({
    url: '/gc/thirdParty/getEmIdPatient',
    method: 'post',
    data: params
  })
}

export const syncPatientDetailManually = registId => {
  return http({
    url: `/gc/thirdParty/patient/detail/sync/registId/${registId}`,
    method: 'put'
  })
}
