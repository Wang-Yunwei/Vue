/* eslint-disable */
import http from '@/utils/request'

const qualityApi = {
  // 获取首页图表数据
  getRecordQuality: function(params) {
    return http({
      url: 'stat/qc',
      method: 'post',
      data: params
    })
  },
  // 获取达标率分页数据
  getRatePage: function(params) {
    return http({
      url: 'stat/qc/rate/page',
      method: 'post',
      data: params
    })
  }
}

export default qualityApi
