/* eslint-disable */
import http from '@/utils/request'

export default {
    // 医院列表
    getHospitals: () => {
        return http({
            url: '/CommonController/v1/getHospitals',
            method: 'GET'
        })
    },
    // 修改密码
    changePassword: data => {
        return http({
            url: 'CommonController/v1/change/password',
            method: 'POST',
            data
        })
    },
    // 字典 - 保存or更新
    dicSaveOrUpdate: data => {
        return http({
            url: '/pc/dictionary/saveOrUpdate',
            method: 'POST',
            data
        })
    },
    // 字典 - 删除
    dicDelete: id => {
        return http({
            url: `/pc/dictionary/deleteById/${id}`,
            method: 'POST'
        })
    },
    // 字典 - 获取字典码
    getDicCode: data => {
        return http({
            url: '/DataDictionaryController/v1/getDictCode',
            method: 'POST',
            data
        })
    },
    // 字典 - 根据字典码查询字典
    queryByCodeList: data => {
        return http({
            url: 'pc/dictionary/getDictByCodes',
            method: 'POST',
            data
        })
    },
    // 数据管理 - 分页列表
    queryByPage: data => {
        return http({
            url: '/pc/patient/queryByPage',
            method: 'POST',
            data
        })
    },
    // 数据管理 - 详情
    detail: data => {
        return http({
            url: '/pc/patient/detail',
            method: 'POST',
            data
        })
    },
    // 数据管理 - 批量删除
    deleteByBatch: data => {
        return http({
            url: '/pc/patient/deleteByBatch',
            method: 'POST',
            data
        })
    },
    // 数据管理 - 批量恢复
    batchRecoverDelete: data => {
        return http({
            url: '/pc/patient/batchRecoverDelete',
            method: 'POST',
            data
        })
    },
    // 数据管理 - 批量彻底删除
    batchForeverDelete: data => {
        return http({
            url: '/pc/patient/batchForeverDelete',
            method: 'POST',
            data
        })
    },
    // 数据管理 - 更新
    updatePatient: data => {
        return http({
            url: '/pc/patient/updatePatient',
            method: 'POST',
            data
        })
    },
    // 数据管理 - 时间轴
    selectTimeAxis: params => {
        return http({
            url: '/pc/timeAxis/selectTimeAxis',
            method: 'GET',
            params
        })
    },
    // 数据管理 - 单据状态更新
    submitApprove: data => {
        return http({
            url: '/pc/patient/submitApprove',
            method: 'POST',
            data
        })
    },
    // 数据管理 - 导出
    exportPatients: data => {
        return http({
            url: '/pc/patient/exportPatients',
            method: 'POST',
            responseType: 'blob',
            data
        })
    },
    // 数据管理 - 同步
    synchrodata: registId => {
        return http({
            url: `/pc/patient/sync/detail/${registId}`,
            method: 'POST'
        })
    },
    // 新增病历 - 列表
    queryThirdPatientsByPage: data => {
        return http({
            url: '/pc/patient/queryThirdPatientsByPage',
            method: 'POST',
            data
        })
    },
    // 新增病历 - 详情
    getPatientBaseInfo: data => {
        return http({
            url: '/patient/base/info',
            method: 'POST',
            data
        })
    },
    // 新增病历 - 新增
    addBasePatient: data => {
        return http({
            url: '/pc/patient/addBasePatient',
            method: 'POST',
            data
        })
    },
    // 心电图 - 新增
    addEcg: data => {
        return http({
            url: '/pc/patient/addEcg',
            method: 'POST',
            data
        })
    },
    // 心电图 - 删除
    deleteEcgById: id => {
        return http({
            url: `/pc/patient/deleteEcgById/${id}`,
            method: 'POST'
        })
    },
    // 心电图 - 列表
    ecgList: registId => {
        return http({
            url: `/pc/patient/ecg/list/${registId}`,
            method: 'POST'
        })
    },
    // 评分 - 新增or更新
    scoreUpdate: data => {
        return http({
            url: '/pc/grade/update',
            method: 'POST',
            data
        })
    },
    // 评分 - 删除
    scoreDelete: id => {
        return http({
            url: `/grade/delete/${id}`,
            method: 'POST'
        })
    },
    // 评分 - IssAis数据模板
    issAis: () => {
        return http({
            url: '/grade/getIssSetting',
            method: 'GET'
        })
    },
    // 腕带 - 列表
    getRfTagList: params => {
        return http({
            url: 'pc/patient/getRfTagList',
            method: 'POST',
            params
        })
    },
    // 腕带 - 绑定
    bindRfTagId: data => {
        return http({
            url: '/pc/patient/bindRfTagId',
            method: 'POST',
            data
        })
    },
    // 腕带 - 解除腕带绑定
    unBindRfTagId: data => {
        return http({
            url: '/pc/patient/unBindRfTagId',
            method: 'POST',
            data
        })
    },
    // 腕带 - 腕带信息
    getTagInfo: registId => {
        return http({
            url: `/pc/patient/getRfTimes/${registId}`,
            method: 'POST'
        })
    },
    // 腕带 - 导入腕带时间
    importWristTime: data => {
        return http({
            url: '/pc/patient/importTime',
            method: 'POST',
            data
        })
    },
    // 腕带 - 校验是否已绑定
    checkWrist: tagId => {
        return http({
            url: `/pc/patient/checkBinding/${tagId}`,
            method: 'GET'
        })
    },
    // ICU - 删除
    deleteICUById: id => {
        return http({
            url: `/pc/patient/deleteICUById/${id}`,
            method: 'POST'
        })
    },
    // 调阅 - 院前急救
    getfirstAidList: params => {
        return http({
            url: '/pc/preview/getfirstAidList',
            method: 'POST',
            params
        })
    },
    // 调阅 - 预检分诊
    getTriagePreview: params => {
        return http({
            url: '/pc/preview/getTriagePreview',
            method: 'POST',
            params
        })
    },
    // 调阅 - 检验
    getInspect: params => {
        return http({
            url: '/pc/preview/getInspectList',
            method: 'POST',
            params
        })
    },
    // 调阅 - 检查
    getCheck: params => {
        return http({
            url: '/pc/preview/getExamineList',
            method: 'POST',
            params
        })
    },
    // 调阅 - 用药
    getMedicate: params => {
        return http({
            url: '/pc/preview/getMedicationList',
            method: 'POST',
            params
        })
    },
    // 病历编辑 - 初始绑定
    initDept: data => {
        return http({
            url: '/patient/init/dept',
            method: 'POST',
            data
        })
    },
    // 病历编辑 - 页签绑定
    bindDept: data => {
        return http({
            method: 'POST',
            url: '/patient/bind/dept',
            data
        })
    },
    // 病历编辑 - 获取无名氏
    genPatientName: () => {
        return http({
            url: 'pc/patient/genPatientName',
            method: 'GET'
        })
    },
    // 文件下载
    download: (url, method, body, fileName) => {
        http({
            url: url,
            method: method,
            data: body,
            responseType: 'blob',
        }).then(res => {
            // 新建一个Blob对象
            const blob = new Blob([res])
            // 创建一个URL对象，指向Blob对象
            const url = window.URL.createObjectURL(blob)
            // 创建一个隐藏的a标签
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            // a.setAttribute('download', fileName)
            // 将a标签添加到文档中，但不显示它
            // document.body.appendChild(a)
            // 模拟点击a标签来触发下载
            a.click()
            // 清理: 从文档中移除a标签,并释放URL对象
            // document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        })
    },
    // 统计 - 获取首页数据
    getRecordDashboard: data => {
        return http({
            url: 'pc/stat/home',
            method: 'POST',
            data
        })
    },
    // 获取场景数据
    getRrCodePage: data => {
        return http({
            url: '/pc/qr/page',
            method: 'POST',
            data
        })
    },
    // 保存场景数据
    saveRrCodePage: data => {
        return http({
            url: '/pc/qr/batch',
            method: 'POST',
            data
        })
    },
    queryList: data => {
        return http({
            url: '/pc/quality/list',
            method: 'POST',
            data
        })
    },
    statByPointerType: data => {
        return http({
            url: '/pc/quality/statByPointerType',
            method: 'POST',
            data
        })
    },
    fileApi: data => {
        return http({
            url: '/file/upload',
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data
        })
    },
    meetingQueryByPage: data => {
        return http({
            url: '/pc/meeting/queryByPage',
            method: 'POST',
            data
        })
    },
    meetingGetDetailById: id => {
        return http({
            url: `/pc/meeting/getDetailById/${id}`,
            method: 'GET'
        })
    },
    meetingSaveOrUpdate: data => {
        return http({
            url: '/pc/meeting/saveOrUpdate/',
            method: 'POST',
            data
        })
    },
    meetingDeleteById: id => {
        return http({
            url: `/pc/meeting/deleteById/${id}`,
            method: 'POST'
        })
    },
    meetingDeleteFileById: id => {
        return http({
            url: `/pc/meeting/deleteFileById/${id}`,
            method: 'POST'
        })
    }
}