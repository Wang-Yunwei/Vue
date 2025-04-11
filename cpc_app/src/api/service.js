import axios from '@utils/http/api'
import constant from '@constant/dicConstant'
import * as types from '@/store/mutations/mutations-types'
import state from '@store/state/state'
import { store } from '@/permission'

/**
 * 保存患者信息新建空白病例
 * @param params
 * @returns {*}
 */
export const getClient = params => {
  const url = `/base/getClientInfo`
  return axios({
    url: url,
    method: 'get',
    data: params
  })
}

// 调用权限-获取院区
export const getHospitalArea = hospitalId => {
  const url = `/base/getHospitalArea?hospitalId=${hospitalId}`
  return axios({
    url: url,
    method: 'get'
  })
}

export const startup = params => {
  const url = `/base/startup`
  return axios({
    url: url,
    method: 'get',
    data: params
  })
}

export const regeo = coordinate => {
  const url = `/base/regeo?coordinate=${coordinate}`
  return axios({
    url: url,
    method: 'get'
  })
}

/**
 * 分页查询患者信息
 * @param params
 * @returns {*}
 */
export const getRegistPage = params => {
  const query = {
    ...params,
    hospitalId: store.getters.hospitalId
  }
  const url = `/regist/getRegistPage`
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/**
 * 保存患者信息新建空白病例
 * @param params
 * @returns {*}
 */
export const saveMedicalRecord = params => {
  const url = `/regist/saveMedicalRecord`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 获取接口患者列表
 * @param params
 * @returns {*}
 */
export const getQueryPatients = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId,
    sysId: 'CPC'
  }
  const url = '/regist/getPatientList'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/**
 * 获取患者填报明细数据
 * @param params
 * @returns {*}
 */
export const getFillInfoAggregate = registId => {
  const url = `/regist/getFillInfoAggregate/?registid=${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}

/**
 * 根据院前推送新建患者病历
 * @param params
 * @returns {*}
 */
export const createFromPreHospitalPush = params => {
  const url = '/regist/comeType/preHospitalPush'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者院前数据
 * @param params
 * @returns {*}
 */
export const savePhepInfo = params => {
  const url = '/prehospital/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者急诊分诊
 * @param params
 * @returns {*}
 */
export const saveAdmission = params => {
  const url = '/admission/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者检验检测
 * @param params
 * @returns {*}
 */
export const saveInspection = params => {
  const url = '/inspection/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者检验检测
 * @param params
 * @returns {*}
 */
export const saveDiagnosisTest = params => {
  const url = '/diagnosisTest/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者胸痛治疗
 * @param params
 * @returns {*}
 */
export const saveTreatment = params => {
  const url = '/treatment/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者影像学检查
 * @param params
 * @returns {*}
 */
export const saveScreenage = params => {
  const url = '/screenage/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者影像学检查
 * @param params
 * @returns {*}
 */
export const saveTreatmentPci = params => {
  const url = '/treatmentPci/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者影像学检查
 * @param params
 * @returns {*}
 */
export const saveTreatmentPciPart = params => {
  const url = '/treatmentPciPart/savebatch'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者心电图时间(批量)
 * @param params
 * @returns {*}
 */
export const saveEcgBatch = params => {
  const url = '/MedCpcEcg/savebatch'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 保存患者心电图时间
 * @param params
 * @returns {*}
 */
// export const saveEcg = params => {
//   const url = "/chestpain/MedCpcEcg/savebatch";
//   return axios({
//     url: url,
//     method: "post",
//     data: params
//   });
// };

/**
 * 删除患者心电图文件
 * @param params
 * @returns {*}
 */
export const deleteEcgFile = id => {
  const url = `/ecgFiles/delete/?id=${id}`
  return axios({
    url: url,
    method: 'get'
  })
}

/**
 * 根据类型获取患者院前院内心电图
 * @param params
 * @returns {*}
 */
export const getEcg = (registId, flag) => {
  const url = `/MedCpcEcg/getEcg/?registid=${registId}&flag=${flag}`
  return axios({
    url: url,
    method: 'get'
  })
}

export const queryRfId = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/regist/getRfids'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

export const bindRfId = (registId, rfId) => {
  const query = {
    registId: registId,
    tagId: rfId,
    type: '5',
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/regist/bindRfid'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 保存患者转归
 * @param params
 * @returns {*}
 */
export const saveDischarge = params => {
  const url = '/discharge/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存患者心电图时间
 * @param params
 * @returns {*}
 */
export const saveEcg = params => {
  const url = '/MedCpcEcg/saveEcg'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}
/*
 * 保存患者出院检查
 * @param params
 * @returns {*}
 */
export const saveDischargeTes = params => {
  const url = '/dischargeTest/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 获得接口号
 * @param params
 * @returns {*}
 */
export const getPatientNo = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/regist/getPatientNo'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/**
 * 查询患者是否存在
 * @param params
 * @returns {*}
 */
const getEmIdPatient = params => {
  const url = `/gc/thirdParty/getEmIdPatient`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

const getRelationEmIdPatient = params => {
  const url = `/regist/getRelationEmIdPatient `
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 获得接口数据
 * @param params
 * @returns {*}
 */
export const getPatientInfo = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/regist/getPatientInfo'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/**
 * 获取患者详情
 * @param regNo 急诊号(急诊分诊凭条)
 * @returns {*}
 */
const getPatientDetails = params => {
  const url = `/gc/thirdParty/getPatientDetails`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 删除患者信息
 * @param params
 * @returns {*}
 */
export const deletePatient = registId => {
  const query = {
    registId: registId,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/regist/deletePatient'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/**
 * 归档接口
 * @param params
 * @returns {*}
 */
export const archive = params => {
  const url = '/regist/archive'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 提交审核
 * @param params
 * @returns {*}
 */
export const submitAudit = params => {
  const url = '/regist/submitAudit'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 通过审核
 * @param params
 * @returns {*}
 */
export const passAudit = params => {
  const url = '/regist/passAudit'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 撤回审核
 * @param params
 * @returns {*}
 */
export const withdrawAudit = params => {
  const url = '/regist/withdrawAudit'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 驳回审核
 * @param params
 * @returns {*}
 */
export const rejectAudit = params => {
  const url = '/regist/rejectAudit'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 待归档驳回
 * @param params
 * @returns {*}
 */
export const rejectArchive = params => {
  const url = '/regist/rejectArchive'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 撤销归档
 * @param params
 * @returns {*}
 */
export const rescindArchive = params => {
  const url = '/regist/rescindArchive'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export const getReviewHistory = params => {
  return axios({
    url: '/log/getListByRegistId',
    method: 'get',
    params: params
  })
}

/*
 * 保存出院带药
 * @param params
 * @returns {*}
 */
export const saveDischargeDrugs = params => {
  const url = '/dischargeDrugs/saveBatch'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 保存住院期间用药
 * @param params
 * @returns {*}
 */
export const saveInnaiDrugs = params => {
  const url = '/innaiDrugs/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存肌钙蛋白信息
 * @param params
 * @returns {*}
 */
export const updateTn = params => {
  const url = `/creatinineprotein/save`
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 保存肌钙蛋白信息
 * @param params
 * @returns {*}
 */
export const deleteTnById = id => {
  const url = `/creatinineprotein/delete?id=${id}`
  return axios({
    url: url,
    method: 'get'
  })
}

/**
 * 获取字典
 * @param params
 * @returns {*}
 */
export const getDictionary = _ => {
  if (store.getters.resources.dicData) {
    return new Promise(function(resolve) {
      resolve(store.getters.resources.dicData)
    })
  } else {
    const params = {
      // codeList: '',
      hospitalId: store.getters.hospitalId
      //  appid: store.getters.appSign
    }
    const url = '/dict/getDicData'
    return new Promise(function(resolve, reject) {
      return axios({
        url: url,
        method: 'get',
        params: params
      })
        .then(({ result }) => {
          store.getters.resources.dicData = result
          resolve(store.getters.resources.dicData)
        })
        .catch(function(message) {
          reject(message)
        })
    })
  }
}

/*
 * 保存患者登记表
 * @param params
 * @returns {*}
 */
export const saveRegist = params => {
  const url = '/regist/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 上传文件
 * @param params
 * @returns {*}
 */
const upload = params => {
  const rVal = axios({
    headers: {
      AppId: 'chestpain'
    },
    method: 'post',
    url: '/files/base/file/upload',
    data: params
  })
  return rVal
}

const uploadWithThumb = params => {
  return axios({
    headers: {
      AppId: 'chestpain'
    },
    method: 'post',
    url: '/files/base/file/uploadWithThumb',
    data: params
  })
}

/*
 * 保存患者主表
 * @param params
 * @returns {*}
 */
export const saveMain = params => {
  const url = '/main/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 绑定
 * @param params
 * @returns {*}
 */
export const bindPatient = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/regist/bindPatient'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 关联急诊救门诊住院信息
 * @param params
 * @returns {*}
 */
export const relationPatient = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/regist/relationPatient'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 同步患者信息
 * @param params
 * @returns {*}
 */
export const syncPatient = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/regist/syncPatient'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 删除心电图
 * @param params
 * @returns {*}
 */
export const deleteEcg = id => {
  const url = `/MedCpcEcg/delete?id=${id}`
  return axios({
    url: url,
    method: 'get'
  })
}

/*
 * 保存Grace评估
 * @param params
 * @returns {*}
 */
export const saveGrace = params => {
  const url = '/grace/save'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 获取Grace
 * @param params
 * @returns {*}
 */
export const getGrace = registId => {
  const url = `/grace/get?registid=${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}

/*
 * 获取Grace
 * @param params
 * @returns {*}
 */
export const getGraceByid = registId => {
  const url = `/inspection/queryById/${registId}`
  return axios({
    url: url,
    method: 'get'
  })
}
/*
 * 报表数据概述-患者趋势图
 * @param params
 * @returns {*}
 */
export const getLineChart = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/stats/getLineChart'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表数据概述-统计患者数量
 * @param params
 * @returns {*}
 */
export const getMedicalRecordStats = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/stats/getMedicalRecordStats'
  return axios({
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
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/stats/getPicChart'
  return axios({
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
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/getQcIndex'
  return axios({
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
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/getIntelligentAnalysis'
  return axios({
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
export const getIndexAnalysisList = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/getIndexAnalysisList'
  return axios({
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
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/getPatientList'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 获取系统默认值
 * @param params
 * @returns {*}
 */
export const getSysSetting = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/sysSetting/query'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 质控-实时质控
 * @param params
 * @returns {*}
 */
export const getQcStandard = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/standard'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

export const getRzType = params => {
  const query = {
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
    // hospitalId: 'DDB57578-4665-4686-9051-7E4030D091AB'
  }
  const url = '/qcIndex/rztype'
  return axios({
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
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/stats/getNetHospitalStats'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表数据概述-随访统计
 * @param params
 * @returns {*}
 */
export const getFollowUpStats = params => {
  const query = {
    ...params,
    // hospitalArea: '16fb8fbc-0cba-4a9c-9c3a-b693aa3b2b92',
    // hospitalId: '16fb8fbc-0cba-4a9c-9c3a-b693aa3b2b92'
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/stats/getFollowUpStats'
  return axios({
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
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/stats/getDataFillingSituation'
  return axios({
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
    ...params,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/stats/getReperfusionStats'
  return axios({
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
export const saveFillInfoAggregate = params => {
  const url = '/regist/saveFillInfoAggregate'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 报表数据概述-质控指标
 * @param params
 * @returns {*}
 */
export const getKeyIndex = params => {
  const query = {
    start: params.start,
    end: params.end,
    scope: params.scope,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId
  }
  const url = '/qualityIndex/query'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 报表数据概述-质控指标明细
 * @param params
 * @returns {*}
 */
export const getKeyIndexDetail = params => {
  const query = {
    start: params.start,
    end: params.end,
    scope: params.scope,
    hospitalArea: store.getters.curHospitalArea,
    hospitalId: store.getters.hospitalId,
    type: params.core
  }
  // const query = {
  //   hospital: '浏阳市中医医院',
  //   start: '2022-01',
  //   end: '2022-03',
  //   type: 'ECGREMOTE'
  // }
  const url = '/qualityIndexDetail/queryIndexByType'
  return axios({
    url: url,
    method: 'post',
    data: query
  })
}

/*
 * 并发检测
 * @param params
 * @returns {*}
 */
export const checkTimeStamp = params => {
  const url = '/correspond/checkTimeStamp'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 并发更新
 * @param params
 * @returns {*}
 */
export const updateTimeStamp = params => {
  const url = '/correspond/updateTimeStamp'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 保存并发院前信息
 * @param params
 * @returns {*}
 */
export const saveForcePrehospital = params => {
  const url = '/prehospital/forcesave'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 保存并发主表信息
 * @param params
 * @returns {*}
 */
export const saveForceMain = params => {
  const url = '/main/forcesave'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 保存并发检查检测信息
 * @param params
 * @returns {*}
 */
export const saveForceInspection = params => {
  const url = '/inspection/forcesave'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/*
 * 保存并发检查检测信息
 * @param params
 * @returns {*}
 */
export const saveForceTreatment = params => {
  const url = '/treatment/forcesave'
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

/**
 * 质控指标-到期时间描述
 * @param params
 * @returns {*}
 */
export const getUpdateTime = _ => {
  const url = `/qualityIndex/updateTime`
  return axios({
    url: url,
    method: 'get'
  })
}

// 根据联盟编号 返回胸痛内部号
export const getRegisterIdByReportId = reportId => {
  const url = `/regist/getRegisterIdByReportId?reportId=${reportId}`
  return axios({
    url: url,
    method: 'get'
  })
}

// 默认全部倒出
export default {
  startup,
  getClient,
  getHospitalArea,
  getRegistPage,
  saveMedicalRecord,
  getQueryPatients,
  getFillInfoAggregate,
  createFromPreHospitalPush,
  savePhepInfo,
  saveAdmission,
  saveInspection,
  saveDiagnosisTest,
  saveTreatment,
  saveScreenage,
  saveTreatmentPci,
  saveTreatmentPciPart,
  saveEcg,
  deleteEcgFile,
  getEcg,
  saveEcgBatch,
  saveDischarge,
  saveDischargeTes,
  getPatientNo,
  getPatientInfo,
  saveInnaiDrugs,
  saveDischargeDrugs,
  deletePatient,
  archive,
  rescindArchive,
  // getDicData,
  getDictionary,
  saveMain,
  saveRegist,
  upload,
  uploadWithThumb,
  bindPatient,
  queryRfId,
  bindRfId,
  relationPatient,
  syncPatient,
  deleteEcg,
  saveGrace,
  getGrace,
  getGraceByid,
  submitAudit,
  passAudit,
  withdrawAudit,
  rejectAudit,
  rejectArchive,
  updateTn,
  deleteTnById,
  getLineChart,
  getMedicalRecordStats,
  getPicChart,
  getQcIndex,
  getIntelligentAnalysis,
  getIndexAnalysisList,
  regeo,
  getQcPatientList,
  getSysSetting,
  getQcStandard,
  getNetHospitalStats,
  getDataFillingSituation,
  saveFillInfoAggregate,
  getReperfusionStats,
  getFollowUpStats,
  getKeyIndex,
  getKeyIndexDetail,
  checkTimeStamp,
  updateTimeStamp,
  saveForcePrehospital,
  saveForceMain,
  saveForceInspection,
  saveForceTreatment,
  getUpdateTime,
  getRegisterIdByReportId,
  getReviewHistory,
  getRzType,
  getEmIdPatient,
  getRelationEmIdPatient,
  getPatientDetails
}
