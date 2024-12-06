import http from '@/utils/request'

// 更新任务状态
export const updateStatus = params => {
  return http({
    url: '/phepMissions/updateStatus',
    method: 'post',
    data: params
  })
}
