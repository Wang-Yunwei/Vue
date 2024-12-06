import http from '@utils/http'

export default {
    // 公共 - 获取UUID
    getUUID: () => {
        return http({
            url: '/CommonController/v1/getUUID',
            method: 'get'
        })
    },
    // IM - 给某个用户或者一些用户发送实时通知
    sendNotice: data => {
        return http({
            url: '/CommonController/v1/sendNotice',
            method: 'post',
            data: data
        })
    },
    // 公共 - 推送数据到DAS
    pushDataToDas: missionId => {
        return http({
            url: `/CommonController/v1/pushDataToDas/${missionId}`,
            method: 'get'
        })
    },
    // SSE - 建立连接
    connectSSE: sseId => {
        return http({
            url: `/CommonController/v1/connectSSE/${sseId}`,
            method: 'get'
        })
    },
    // SSE - 推送数据
    pushDataToSSE: data => {
        return http({
            url: '/CommonController/v1/pushDateToSSE',
            method: 'post',
            data: data
        })
    },
    // Auth - 获取医院所有部门
    getDepartments: hospitalId => {
        return http({
            url: `/CommonController/v1/getDepartments/${hospitalId}`,
            method: 'get'
        })
    },
    // 公共 - 获取医院
    getHospitals: () => {
        return http({
            url: '/CommonController/v1/getHospitals',
            method: 'get'
        })
    },
    // 公共 - 获取所有用户
    getAllUser: () => {
        return http({
            url: '/CommonController/v1/getSomeUser',
            method: 'get'
        })
    },
    // 数据字典 - 列表or详情(注: 主键ID有值,则默认查详情)
    ddcPageListOrDetail: data => {
        return http({
            url: '/DataDictionaryController/v1/ddcPageListOrDetail',
            method: 'post',
            data: data
        })
    },
    // 数据字典 - 根据Codes获取枚举值
    getDictByCodes: data => {
        return http({
            url: '/DataDictionaryController/v1/getDictByCodes',
            method: 'post',
            data: data
        })
    },
    // 查询车辆
    eccPageList: data => {
        return http({
            url: '/pc/EmergencyCarController/v1/eccPageList',
            method: 'post',
            data: data
        })
    },
    // 查询模板
    mptQueryList: tempType => {
        return http({
            url: `/medPhepTemplate/queryList/${tempType}`,
            method: 'get'
        })
    },
    // 辅助检查 - 新增or更新
    supSaveOrUpdate: data => {
        return http({
            url: '/SupplementaryExaminationController/v1/supSaveOrUpdate',
            method: 'post',
            data: data
        })
    },
    // 辅助检查 - 详情
    supDetails: patientId => {
        return http({
            url: `/SupplementaryExaminationController/v1/supDetails/${patientId}`,
            method: 'get'
        })
    },
    // 急救站 - 分页列表
    escPageList: data => {
        return http({
            url: '/pc/EmergencyStationController/v1/escPageList',
            method: 'post',
            data: data
        })
    },
    // 专科地图 - 记录轨迹
    recordTrack: data => {
        return http({
            url: '/SpecialtyMapController/v1/recordTrack',
            method: 'post',
            data: data
        })
    },
    // 保存or更新
    smcSaveOrUpdate: data => {
        return http({
            url: '/SpecialtyMapController/v1/smcSaveOrUpdate',
            method: 'post',
            data: data
        })
    },
    // 科地图 - 移除
    smcRemove: data => {
        return http({
            url: '/SpecialtyMapController/v1/smcRemove',
            method: 'post',
            data: data
        })
    },
    // 专科地图 - 列表or详情
    smcListOrDetail: data => {
        return http({
            url: '/SpecialtyMapController/v1/smcListOrDetail',
            method: 'post',
            data: data
        })
    },
    // Redis - 根据MissionId删除
    redisRemoveByMissionId: missionId => {
        return http({
            url: `/SpecialtyMapController/v1/redisRemoveByMissionId/${missionId}`,
            method: 'get'
        })
    },
    // 人员 - 列表
    getPersonList: data => {
        return http({
            url: `/pc/RescuersController/v1/pageListOrDetails`,
            method: 'post',
            data: data
        })
    },
    // 保存
    ppSave: data => {
        return http({
            url: '/phepPatients/save',
            method: 'post',
            data: data
        })
    },
    // 更新
    ppUpdate: data => {
        return http({
            url: '/phepPatients/update',
            method: 'post',
            data: data
        })
    },
    // 查询患者信息
    ppQueryByPatientId: patientId => {
        return http({
            url: `/phepPatients/queryByPatientId/${patientId}`,
            method: 'get'
        })
    },
    // 修改or新增
    mpcSaveOrUpdate: data => {
        return http({
            url: '/medPhepConsents/saveOrUpdate',
            method: 'post',
            data: data
        })
    },
    // 查询详情
    mpcQueryDetailByPatientId: patientId => {
        return http({
            url: `/medPhepConsents/queryDetailByPatientId/${patientId}`,
            method: 'get'
        })
    },
    // 根据患者ID查询急救措施
    mpmQueryByPatientId: patientId => {
        return http({
            url: `/medPhepMeasures/queryByPatientId/${patientId}`,
            method: 'get'
        })
    },
    mpmDeleteMeasures: id => {
        return http({
            url: `/medPhepMeasures/deleteMeasures/${id}`,
            method: 'get'
        })
    },
    mpmSaveMeasures: data => {
        return http({
            url: '/medPhepMeasures/saveMeasures',
            method: 'post',
            data: data
        })
    },
    // 新增or修改
    mpeSaveOrUpdate: data => {
        return http({
            url: '/medPhepEpidemiological/saveOrUpdate',
            method: 'post',
            data: data
        })
    },
    // 查询信息
    mpeQueryByPatientId: patientId => {
        return http({
            url: `/medPhepEpidemiological/queryByPatientId/${patientId}`,
            method: 'get'
        })
    },
    // 历史任务 - 列表
    htcList: data => {
        return http({
            url: '/HistoryTaskController/v1/htcList',
            method: 'post',
            data: data
        })
    },
    // 体格检查 - 新增or更新
    genSaveOrUpdate: data => {
        return http({
            url: '/GeneralInspectionsController/v1/genSaveOrUpdate',
            method: 'post',
            data: data
        })
    },
    // 体格检查 - 删除
    genRemove: data => {
        return http({
            url: '/GeneralInspectionsController/v1/genRemove',
            method: 'post',
            data: data
        })
    },
    // 体格检查 - 详情
    genDetails: id => {
        return http({
            url: `/GeneralInspectionsController/v1/genDetails/${id}`,
            method: 'get'
        })
    },
    // 体格检查 - 列表
    genList: data => {
        return http({
            url: '/GeneralInspectionsController/v1/genList',
            method: 'post',
            data: data
        })
    },
    saveOrUpdateShift: data => {
        return http({
            url: '/medPhepShiftRecord/saveOrUpdateShift',
            method: 'post',
            data: data
        })
    },
    saveOrUpdateGeneral: data => {
        return http({
            url: '/medPhepShiftRecord/saveOrUpdateGeneral',
            method: 'post',
            data: data
        })
    },
    mpsrQueryDetail: patientId => {
        return http({
            url: `/medPhepShiftRecord/queryDetail/${patientId}`,
            method: 'get'
        })
    },
    printShiftRecord: patientId => {
        return http({
            url: `/medPhepShiftRecord/printShiftRecord/${patientId}`,
            method: 'post'
        })
    },
    // 急救交接单 - 打印交接记录
    printDeliveryRecord: patientId => {
        return http({
            url: `/medPhepShiftRecord/printDeliveryRecord/${patientId}`,
            method: 'get'
        })
    },
    // 移动会诊 - 保存or更新
    mccSaveOrUpdate: data => {
        return http({
            url: '/MobileConsultationController/v1/mccSaveOrUpdate',
            method: 'post',
            data: data
        })
    },
    // 移动会诊 - 列表
    mccList: data => {
        return http({
            url: '/MobileConsultationController/v1/mccList',
            method: 'post',
            data: data
        })
    },
    // 查询药品
    drugPageList: data => {
        return http({
            url: '/pc/DrugController/v1/drugPageList',
            method: 'Post',
            data: data
        })
    },
    // 添加用药
    mpeoSaveOrUpdate: data => {
        return http({
            url: '/medPhepEmergencyOrders/saveOrUpdate',
            method: 'Post',
            data: data
        })
    },
    // 查询患者用药信息
    mpeoQueryByPatientId: patientId => {
        return http({
            url: `/medPhepEmergencyOrders/queryByPatientId/${patientId}`,
            method: 'get'
        })
    },
    // 根据用药ID修改用药信息状态
    deleteEmergencyOrdersById: orderId => {
        return http({
            url: `/medPhepEmergencyOrders/deleteEmergencyOrdersById/${orderId}`,
            method: 'Post'
        })
    },
    // 病历新增or修改
    mpmrSaveOrUpdate: data => {
        return http({
            url: '/medPhepMedicalRecords/saveOrUpdate',
            method: 'post',
            data: data
        })
    },
    // 病历查询
    mpmrQueryById: patientId => {
        return http({
            url: `/medPhepMedicalRecords/queryById/${patientId}`,
            method: 'get'
        })
    },
    // 根据患者ID病历新增or修改
    mpmrUpdateByPatientId: data => {
        return http({
            url: '/medPhepMedicalRecords/updateByPatientId',
            method: 'post',
            data: data
        })
    },
    // 查询病历详情
    mpmrDetail: patientId => {
        return http({
            url: `/medPhepMedicalRecords/queryById/${patientId}`,
            method: 'get'
        })
    },
    // 根据车牌查询当前任务
    queryByLicensePlate: data => {
        return http({
            url: '/medPhepMedicalRecords/queryByLicensePlate',
            method: 'post',
            data: data
        })
    },
    // 病历管理-时间轴
    getTimeAxis: missionId => {
        return http({
            url: `/pc/MedicalRecordManageController/v1/timeAxis/${missionId}`,
            method: 'get'
        })
    },
    // 病历管理-时间轴编辑
    updateTimeAxis: data => {
        return http({
            url: `/pc/MedicalRecordManageController/v1/timeAxisUpdate`,
            method: 'post',
            data: data
        })
    },
    // 任务初始化
    init: data => {
        return http({
            url: '/phepMissions/init',
            method: 'post',
            data: data
        })
    },
    // 保存任务
    pmSave: data => {
        return http({
            url: '/phepMissions/save',
            method: 'post',
            data: data
        })
    },
    // 保存任务
    pmUpdate: data => {
        return http({
            url: '/phepMissions/update',
            method: 'post',
            data: data
        })
    },
    // 查询任务详情
    pmDetail: data => {
        return http({
            url: '/phepMissions/detail',
            method: 'post',
            data: data
        })
    },
    // 根据车牌查询当前任务
    pmQueryByLicensePlate: data => {
        return http({
            url: '/phepMissions/queryByLicensePlate',
            method: 'post',
            data: data
        })
    },
    // 更新任务状态
    pmUpdateStatus: data => {
        return http({
            url: '/phepMissions/updateStatus',
            method: 'post',
            data: data
        })
    }

}