import http from '@/utils/request'

// 患者交接 - 根据患者ID查询详情
export const queryShiftDetail = patientId => {
  return http({
    url: `/medPhepShiftRecord/queryDetail/${patientId}`,
    method: 'get'
  })
}

// 患者交接 - 新增or修改
export const saveOrUpdate = params => {
  return http({
    url: `/medPhepShiftRecord/saveOrUpdateShift`,
    method: 'post',
    data: params
  })
}
