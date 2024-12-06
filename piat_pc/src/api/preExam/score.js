import request from '@utils/http/request'

const api = {
  queryList: '/dic/base/Iaaceegilmnrstt/queryList',
  queryScoreList: '/piat/RegistrationInfoController/v1/getScoreList',
  querySingleScore: '/piat/RegistrationInfoController/v1/getScoreDetails',
  removeSingleScore: '/piat/RegistrationInfoController/v1/scoRemove'
}

export default api

export function queryList(params) {
  return request({
    url: api.queryList,
    method: 'post',
    data: params
  })
}

export function queryScoreList(regId, vulnusType) {
  return request({
    url: api.queryScoreList + '/' + regId + '/' + vulnusType,
    method: 'get'
  })
}

export function querySingleScore(vdId) {
  return request({
    url: api.querySingleScore + '/' + vdId,
    method: 'get'
  })
}

export function removeSingleScore(params) {
  return request({
    url: api.removeSingleScore,
    method: 'post',
    data: params
  })
}
