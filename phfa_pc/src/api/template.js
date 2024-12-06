import http from '@/utils/request'

// 病历模板查询
export const queryTempList = tempType => {
  return http({
    url: `/medPhepTemplate/queryList/${tempType}`,
    method: 'get'
  })
}
