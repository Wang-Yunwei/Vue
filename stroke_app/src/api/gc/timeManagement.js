import axios from '@utils/http/api'

// 时间管理-急救-获取时间列表
export const getTimeManagement = (registId, type) => {
  const url = `/gc/timeManagement/${registId}/${type}`
  return axios({
    url: url,
    method: 'get'
  })
}
// 时间管理-时间轴查询
export const getTimeline = registId => {
  const url = `/gc/timeManagement/getTimeline?registId=${registId}`
  return axios({
    url: url,
    method: 'post'
  })
}

// 时间管理-倒计时查询
export const getCountdown = registId => {
  const url = `/gc/timeManagement/getCountdown?registId=${registId}`
  return axios({
    url: url,
    method: 'post'
  })
}

// 时间管理-时间轴修改
export const updateTimeline = params => {
  const url = `/gc/timeManagement/updateTimeline`
  return axios({
    url: url,
    method: 'POST',
    data: params
  })
}

// 默认全部倒出
export default {
  getTimeManagement,
  updateTimeline,
  getTimeline,
  getCountdown
}
