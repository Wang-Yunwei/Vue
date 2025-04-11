/* eslint-disable */
import http from '@/utils/request'

const api = {
    getfirstAidList: 'gc/preview/getfirstAidList',
    getTriagePreview: '/gc/preview/getTriagePreview',
    getMedicationList: '/gc/preview/getMedicationList',
    getInspectList: '/gc/preview/getInspectList'
}

const accessApi = {
    // 获取急救患者信息
    getfirstAidList: function (emId, hospitalId) {
        return http({
            url: api.getfirstAidList + '?emId='+ emId + '&hospitalId=' + hospitalId,
            method: 'post'
        })
    },
    // 获取分诊病历信息
    getTriagePreview: function (emId, hospitalId) {
        return http({
            url: api.getTriagePreview + '?emId='+ emId + '&hospitalId=' + hospitalId,
            method: 'post'
        })
    },
    // 获取用药信息
    getMedicationList: function (emId, infoComingType, hospitalId) {
        return http({
            url: api.getMedicationList + '?emId='+ emId + '&infoComingType=' + infoComingType + '&hospitalId=' + hospitalId,
            method: 'post'
        })
    },
    // 获取检验-检查信息
    getInspectList: function (emId, infoComingType, hospitalId) {
        return http({
            url: api.getInspectList + '?emId='+ emId + '&infoComingType=' + infoComingType + '&hospitalId=' + hospitalId,
            method: 'post'
        })
    }
}

export default accessApi

