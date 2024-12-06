import http from '@/utils/request'

// 患者知情同意书 - 根据患者ID查询详情
export const queryConsentsDetail = patientId => {
  return http({
    url: `/medPhepConsents/queryDetailByPatientId/${patientId}`,
    method: 'get'
  })
}

// 患者知情同意书 - 新增or修改
export const saveOrUpdate = params => {
  return http({
    url: `/medPhepConsents/saveOrUpdate`,
    method: 'post',
    data: params
  })
}
