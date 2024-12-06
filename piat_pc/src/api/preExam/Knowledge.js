import request from '@utils/http/request'

const api = {
  knowledgeBase: '/piat/knowledgebase/getKnowledgeBase',
  getOftenKnowledgeBase: '/piat/knowledgebase/getOftenKnowledgeBase',
  searchknowledgebase: '/piat/knowledgebase/searchknowledgebase'
}

export default api

// get
export function regDetails(id, parameter) {
  return request({
    url: api.regDetails + '/' + id,
    method: 'get',
    params: parameter
  })
}

// 查询知识库
export function knowledgeBase(type, medicinetype, params) {
  return request({
    url: api.knowledgeBase + '?type=' + type + '&medicinetype=' + medicinetype,
    method: 'post',
    data: params
  })
}

// 常用主诉查询
export function getOftenKnowledgeBase(type, medicinetype, params) {
  return request({
    url: api.getOftenKnowledgeBase + '?type=' + type + '&medicinetype=' + medicinetype,
    method: 'post',
    data: params
  })
}

// 知识库搜索
export function searchknowledgebase(knowledgeName, medicinetype, params) {
  return request({
    url: api.searchknowledgebase + '?knowledgeName=' + knowledgeName + '&medicinetype=' + medicinetype,
    method: 'post',
    data: params
  })
}
