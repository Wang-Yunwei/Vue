import http from '@/utils/request'

export const getTimeline = (params) => {
  return http({
    url: `timeManagement/getTimeAxis/${params.registid}`,
    method: 'get',
    params: null
  })
}
