import request from '@utils/http/request'
import { status } from 'nprogress'

const api = {
  selectCheckListByRegId: '/piat/CardNumberManage/selectCheckListByRegId',
  selectListHis: '/piat/CardNumberManage/selectListHis',
  selectHis: '/piat/CardNumberManage/selectHis',
  bindingCard: '/piat/CardNumberManage/bindingCard',
  selectCardInfoByRegId: '/piat/CardNumberManage/selectCardInfoByRegId'
}

export default api

// post
export function selectCheckListByRegId(id, params) {
  return request({
    url: api.selectCheckListByRegId + '/' + id,
    method: 'get',
    data: params
  })
}

// post
export function selectListHis(params) {
  return request({
    url: api.selectListHis,
    method: 'post',
    data: params
  })
}

// post
export function selectHis(params) {
  return request({
    url: api.selectHis,
    method: 'post',
    data: params
  })
}

// post
export function bindingCard(params, status) {
  return request({
    url: api.bindingCard + '/' + status,
    method: 'post',
    data: params
  })
}

// post
export function selectCardInfoByRegId(id, params) {
  return request({
    url: api.selectCardInfoByRegId + '/' + id,
    method: 'get',
    data: params
  })
}
