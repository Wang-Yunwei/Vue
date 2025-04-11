import http from '@/utils/request'

export const genQRCode = () => {
  return http({
    url: 'apk/getAppQrCode',
    method: 'get'
  })
}

export const queryByCodeList = params => {
  return http({
    url: 'base/getDicData',
    method: 'post',
    data: params
  })
}

export const queryHospitalArea = params => {
  return http({
    url: '/base/getHospitalArea',
    method: 'get',
    params: params
  })
}

export const startup = params => {
  const url = `/base/startup`
  return http({
    url: url,
    method: 'get',
    data: params
  })
}
