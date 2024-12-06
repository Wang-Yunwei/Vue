import http from '@/utils/request'

// 流调表 - 根据患者ID查询详情
export const queryDetail = patientId => {
  return http({
    url: `/medPhepEpidemiological/queryByPatientId/${patientId}`,
    method: 'get'
  })
}

// 流调表 - 新增or修改
export const saveOrUpdate = params => {
  return http({
    url: `/medPhepEpidemiological/saveOrUpdate`,
    method: 'post',
    data: params
  })
}
