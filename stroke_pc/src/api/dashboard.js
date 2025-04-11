/* eslint-disable */
import http from '@/utils/request'

const dashboardApi = {
    // 获取首页图表数据
    getRecordDashboard: function () {
        return http({
            url: `stat/dashboard`,
            method: 'get'
        })
    },
}

export default dashboardApi
