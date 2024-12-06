import request from '@utils/http/request'

const api = {
  queryList: '/piat/ClinicNotice/queryList',
  queryByCallTime: '/aid/first-aid/phepMissions/queryByCallTime'
}

export default api

export function queryList(params) {
  return request({
    url: api.queryList,
    method: 'post',
    data: params
  })
}

export function queryByCallTime(params) {
  return request({
    url: api.queryByCallTime,
    method: 'post',
    data: params
  })
}
