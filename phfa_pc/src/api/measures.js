import http from '@/utils/request'
// 治疗方式 - 保存
export const saveMeasures = params => {
  return http({
    url: '/medPhepMeasures/saveMeasures',
    method: 'post',
    data: params
  })
}

// 治疗方式 - 删除
export const deleteMeasures = id => {
  return http({
    url: `/medPhepMeasures/deleteMeasures/${id}`,
    method: 'delete'
  })
}

// 治疗方式 - 查询
export const queryMeasures = id => {
  return http({
    url: `/medPhepMeasures/queryByPatientId/${id}`,
    method: 'get'
  })
}
