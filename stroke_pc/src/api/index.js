import http from '@/utils/request'

export const queryByCodeList = params => {
  return http({
    url: '/dic/queryByCodeList',
    method: 'post',
    data: params
  })
}

// export const queryHospitalArea = params => {
//   return http({
//     url: '/resource/getHospitalArea',
//     method: 'post',
//     data: params
//   })
// }

// 字典表参数请求(score/modal)
export const queryScoreList = (params) => {
  return http({
    url: '/ratingscaleItem/queryList',
    method: 'post',
    data: params
  })
}
