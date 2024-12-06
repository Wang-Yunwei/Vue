
import http from '@/utils/request'

export const getPath = params => {
  return http({
    url: '/SpecialtyMapController/v1/smcListOrDetail',
    method: 'post',
    data: params
  })
}
