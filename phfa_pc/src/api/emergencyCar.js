import http from '@/utils/request'

// 急救车 - 保存or更新
export const eccSaveOrUpdate = params => {
  return http({
    url: '/pc/EmergencyCarController/v1/eccSaveOrUpdate',
    method: 'post',
    data: params
  })
}
// 急救车 - 删除
export const eccDelete = params => {
  return http({
    url: '/pc/EmergencyCarController/v1/eccDelete',
    method: 'post',
    data: params
  })
}
// 急救车 - 分页列表
export const eccPageList = params => {
  return http({
    url: '/pc/EmergencyCarController/v1/eccPageList',
    method: 'post',
    data: params
  })
}
