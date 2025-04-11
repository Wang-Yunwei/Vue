import http from '@/utils/request'

// 删除心电图
export const removeEcg = (id) => {
  const url = `/ecg/id/${id}`
  return http({
    url: url,
    method: 'get'
  })
}
export const saveEcg = (params) => {
  const url = `/gc/medswmecg/saveElectrocardiogram`
  return http({
    url: url,
    method: 'post',
    data: params
  })
}
