import http from '@/utils/request'

// 数据字典 - 保存or更新
export const ddcSaveOrUpdate = params => {
  return http({
    url: '/DataDictionaryController/v1/ddcSaveOrUpdate',
    method: 'post',
    data: params
  })
}
// 数据字典 - 删除
export const ddcDelete = params => {
  return http({
    url: '/DataDictionaryController/v1/ddcDelete',
    method: 'post',
    data: params
  })
}
// 数据字典 - 列表or详情
export const ddcListOrDetails = params => {
  return http({
    url: '/DataDictionaryController/v1/ddcListOrDetails',
    method: 'post',
    data: params
  })
}
// 数据字典 - 获取字典编码
export const getDictCode = params => {
  return http({
    url: '/DataDictionaryController/v1/getDictCode',
    method: 'post',
    data: params
  })
}
