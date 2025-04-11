import http from '@/utils/request'

/*
 * 报表数据概述-统计患者数量
 * @param params
 * @returns {*}
 */
export const getMedicalRecordStats = params => {
  const query = {
    ...params
    //   hospitalArea: store.getters.curHospitalArea,
    //   hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/stats/getMedicalRecordStats'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表数据概述-发病12小时以内STEMI患者再灌注策略
 * @param params
 * @returns {*}
 */
export const getReperfusionStats = params => {
  const query = {
    ...params
    //   hospitalArea: store.getters.curHospitalArea,
    //   hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/stats/getReperfusionStats'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表数据概述-网络医院统计
 * @param params
 * @returns {*}
 */
export const getNetHospitalStats = params => {
  const query = {
    ...params
    //   hospitalArea: store.getters.curHospitalArea,
    //   hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/stats/getNetHospitalStats'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表数据概述-数据填报管理执行情况
 * @param params
 * @returns {*}
 */
export const getDataFillingSituation = params => {
  const query = {
    ...params
    //   hospitalArea: store.getters.curHospitalArea,
    //   hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/stats/getDataFillingSituation'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表数据概述-患者趋势图
 * @param params
 * @returns {*}
 */
export const getLineChart = params => {
  const query = {
    ...params
    // hospitalArea: store.getters.curHospitalArea,
    // hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/stats/getLineChart'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表数据概述-胸痛患者病例统计
 * @param params
 * @returns {*}
 */
export const getPicChart = params => {
  const query = {
    ...params
    // hospitalArea: store.getters.curHospitalArea,
    // hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/stats/getPicChart'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表智能分析首页
 * @param params
 * @returns {*}
 */
export const getIntelligentAnalysis = params => {
  const query = {
    ...params
    // hospitalArea: store.getters.curHospitalArea,
    // hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/getIntelligentAnalysis'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表智能-指标详情
 * @param params
 * @returns {*}
 */
export const getIndexAnalysisList = params => {
  const query = {
    ...params
    // hospitalArea: store.getters.curHospitalArea,
    // hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/getIndexAnalysisList'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表数据概述-认证指标
 * @param params
 * @returns {*}
 */
export const getQcIndex = params => {
  const query = {
    ...params
    // hospitalArea: store.getters.curHospitalArea,
    // hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/getQcIndex'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表明细人数
 * @param params
 * @returns {*}
 */
export const getQcPatientList = params => {
  const query = {
    ...params
    // hospitalArea: store.getters.curHospitalArea,
    // hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/getPatientList'
  return http({
    url: url,
    method: 'post',
    data: query
  })
}
