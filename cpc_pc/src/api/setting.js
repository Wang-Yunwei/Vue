import http from '@/utils/request'

export const querySetting = data => {
  return http({
    url: '/sysSetting/query',
    method: 'post',
    data
  })
}

export const saveDefaultSetting = data => {
  return http({
    url: '/sysSetting/save',
    method: 'post',
    data
  })
}

export const getRedirectUrl = data => {
  return http({
    url: '/authInfo/getJumpRbacInfo',
    method: 'get',
    params: data
  })
}

export const getLogList = () => {
  return http({
    url: '/log/list',
    method: 'get'
  })
}

export const logDownload = fname => {
  return http({
    url: `/log/download?fname=${fname}`,
    method: 'get',
    responseType: 'blob',
    timeout: 60000
  })
}
