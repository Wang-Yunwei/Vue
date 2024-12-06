import http from '@/utils/request'

// 急救站 - 保存or更新
export const escSaveOrUpdate = params => {
  return http({
    url: '/pc/EmergencyStationController/v1/escSaveOrUpdate',
    method: 'post',
    data: params
  })
}
// 急救站 - 删除
export const escDelete = params => {
  return http({
    url: '/pc/EmergencyStationController/v1/escDelete',
    method: 'post',
    data: params
  })
}
// 急救站 - 分页列表
export const escPageList = params => {
  return http({
    url: '/pc/EmergencyStationController/v1/escPageList',
    method: 'post',
    data: params
  })
}
