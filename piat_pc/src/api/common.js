import request from '@utils/http/request'

const api = {
    getUUID: '/piat/CommonController/v1/getUUID',
    dasQuery: '/piat/CommonController/v1/dasQuery'
}

export default api

export function getUUID() {
    return request({
        url: api.getUUID,
        method: 'get'
    })
}

export function dasQuery(params) {
    return request({
        url: api.dasQuery,
        method: 'post',
        data: params
    })
}