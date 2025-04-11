/* eslint-disable */
import http from '@/utils/request'

const settingsApi = {
  // 获取场景数据
  getRrCodePage: function (data) {
    return http({
      url: '/desktop/qr/page',
      method: 'post',
      data
    })
  },
  // 保存场景数据
  saveRrCodePage: function (data) {
    return http({
      url: '/desktop/qr/batch',
      method: 'post',
      data
    })
  },
  // 分页获取字典数据
  dictionaryPage: function (data) {
    return http({
      url: '/dic/page',
      method: 'post',
      data
    })
  },
  // 保存字典数据
  dictionarySave: function (data) {
    return http({
      url: '/dic/save',
      method: 'post',
      data
    })
  },
  // 修改字典数据
  dictionaryUpdate: function (data) {
    return http({
      url: '/dic/update',
      method: 'post',
      data
    })
  },
  // 删除字典数据
  dictionaryDelete: function (data) {
    return http({
      url: '/dic/delete',
      method: 'get',
      params: data
    })
  },
  // 分页获取评分模板数据
  ratingscalePage: function (data) {
    return http({
      url: '/ratingscale/page',
      method: 'post',
      data
    })
  },
  // 保存评分模板数据
  ratingscaleSave: function (data) {
    return http({
      url: '/ratingscale/save',
      method: 'post',
      data
    })
  },
  // 修改评分模板数据
  ratingscaleUpdate: function (data) {
    return http({
      url: '/ratingscale/update',
      method: 'post',
      data
    })
  },
  // 删除评分模板数据
  ratingscaleDelete: function (data) {
    return http({
      url: '/ratingscale/delete',
      method: 'get',
      params: data
    })
  },
  // 分页获取评分模板明细数据
  ratingscaleItemPage: function (data) {
    return http({
      url: '/ratingscaleItem/page',
      method: 'post',
      data
    })
  },
  // 保存评分模板明细数据
  ratingscaleItemSave: function (data) {
    return http({
      url: '/ratingscaleItem/save',
      method: 'post',
      data
    })
  },
  // 修改评分模板明细数据
  ratingscaleItemUpdate: function (data) {
    return http({
      url: '/ratingscaleItem/update',
      method: 'post',
      data
    })
  },
  // 删除评分模板明细数据
  ratingscaleItemDelete: function (data) {
    return http({
      url: '/ratingscaleItem/delete',
      method: 'get',
      params: data
    })
  },
  // 获取评分模板名称数据
  ratingscaleList: function (data) {
    return http({
      url: '/ratingscale/list',
      method: 'post',
      data
    })
  }
}

export default settingsApi
