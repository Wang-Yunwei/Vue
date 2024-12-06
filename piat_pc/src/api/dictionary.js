import request from '@utils/http/request'

const api = {
    ddcSaveOrUpdate: '/piat/DataDictionaryController/v1/ddcSaveOrUpdate',
    ddcDelete: '/piat/DataDictionaryController/v1/ddcDelete',
    ddcListOrDetails: '/piat/DataDictionaryController/v1/ddcListOrDetails',
    ddcAddBatch: '/piat/DataDictionaryController/v1/ddcAddBatch',
    getDictByCodes: '/piat/DataDictionaryController/v1/getDictByCodes',
    getDictCode: '/piat/DataDictionaryController/v1/getDictCode'
}
export default api

//数据字典 - 保存or更新
export function ddcSaveOrUpdate(params) {
    return request({
        url: api.ddcSaveOrUpdate,
        method: 'post',
        data: params
    })
}
//数据字典 - 删除
export function ddcDelete(params) {
    return request({
        url: api.ddcDelete,
        method: 'post',
        data: params
    })
}
// 数据字典 - 列表or详情
export function ddcListOrDetails(params) {
    return request({
        url: api.ddcListOrDetails,
        method: 'post',
        data: params
    })
}
// 数据字典 - 批量添加
export function ddcAddBatch(params) {
    return request({
        url: api.ddcAddBatch,
        method: 'post',
        data: params
    })
}
// 数据字典 - 根据Codes获取枚举值
export function getDictByCodes(params) {
    return request({
        url: api.getDictByCodes,
        method: 'post',
        data: params
    })
}
// 数据字典 - 获取字典编码
export function getDictCode(params) {
    return request({
        url: api.getDictCode,
        method: 'post',
        data: params
    })
}