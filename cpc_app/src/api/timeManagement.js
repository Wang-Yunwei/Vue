import axios from '@utils/http/api'

// 时间管理-急救-获取时间列表
export const getTimeManagement = (registId, type) => {
  const url = `/timeManagement/getTimeManagement?registId=${registId}&type=${type}`
  return axios({
    url: url,
    method: 'post'
  })
}
// 时间管理-时间轴查询
export const getTimeline = registId => {
  const url = `/timeManagement/queryList/` + registId
  return axios({
    url: url,
    method: 'get'
  })
}

// 时间管理-倒计时查询
export const getCountdown = registId => {
  const url = `/timeManagement/getCountdown?registId=${registId}`
  return axios({
    url: url,
    method: 'post'
  })
}

// 时间管理-倒计时查询
export const getTimeAxis = registId => {
  const url = `/timeManagement/getTimeAxis/` + registId
  return axios({
    url: url,
    method: 'get'
  })
}

// 时间管理-时间轴修改
export const updateTimeline = params => {
  const url = `/timeManagement/updateTimeline`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

// 时间管理-修改
export const updateTimeManagement = params => {
  const url = `/timeManagement/updateTimeManagement`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

// 默认全部倒出
export default {
  getTimeManagement,
  updateTimeline,
  getTimeline,
  getCountdown,
  getTimeAxis,
  updateTimeManagement
}
