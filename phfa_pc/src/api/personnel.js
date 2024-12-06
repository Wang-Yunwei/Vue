import http from '@/utils/request'

// 保存更新人员
export const saveOrUpdateRescuers = params => {
  return http({
    url: '/pc/RescuersController/v1/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 删除人员
export const deleRescuers = params => {
  return http({
    url: '/pc/RescuersController/v1/batchDeletion',
    method: 'post',
    data: params
  })
}

// 查询人员列表
export const queryRescuersList = (params) => {
  return http({
    url: `/pc/RescuersController/v1/pageListOrDetails`,
    method: 'post',
    data: params
  })
}

// 查询人员详情
export const queryRescuersDetail = (rescuerId) => {
  return http({
    url: `/pc/RescuersController/v1/pageListOrDetails`,
    method: 'post',
    data: { rescuerId }
  })
}
