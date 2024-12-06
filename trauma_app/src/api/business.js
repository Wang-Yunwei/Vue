import http from '@utils/http'

export default {
  // 档案 - 卡片列表
  queryByPage: data => {
    return http({
      url: '/patient/queryByPage',
      method: 'post',
      data
    })
  },
  // 档案 - 卡片列表 - 删除
  deleteByRegistId: registId => {
    return http({
      url: `/patient/deleteByRegistId/${registId}`,
      method: 'post',
    })
  },
  // 档案 -添加患者 - 患者列表
  queryThirdPatientsByPage: data => {
    return http({
      url: '/patient/queryThirdPatientsByPage',
      method: 'post',
      data
    })
  },
  // 档案 -添加患者 - 新增空白页
  addBasePatient: data => {
    return http({
      url: '/patient/addBasePatient',
      method: 'post',
      data
    })
  },
  // 档案 -添加患者 - 获取无名氏
  getPatientName: () => {
    return http({
      url: '/patient/genPatientName',
      method: 'get'
    })
  },
  // 档案 -添加患者 - 验证患者是否已经存在
  checkExistByEmId: data => {
    return http({
      url: '/patient/checkExistByEmId',
      method: 'post',
      data
    })
  },
  // 档案 -添加患者 - 获取患者详情
  getPatientBaseInfo: data => {
    return http({
      url: '/patient/base/info',
      method: 'post',
      data
    })
  },
  // 档案 -病历编辑 - 查详情
  detail: data => {
    return http({
      url: '/patient/detail',
      method: 'post',
      data
    })
  },
  // 档案 -基本信息 - 更新
  updatePatient: data => {
    return http({
      url: '/patient/updatePatient',
      method: 'post',
      data
    })
  },
  // 档案 -上传文件
  uploadFile: data => {
    return http({
      url: '/file/upload',
      method: 'post',
      data
    })
  },
  // 档案 -新增心电图
  addEcg: data => {
    return http({
      url: '/patient/addEcg',
      method: 'post',
      data
    })
  },
  // 病历编辑 - 删除心电图
  deleteEcgById: id => {
    return http({
      url: `/patient/deleteEcgById/${id}`,
      method: 'post'
    })
  },
  // 档案 -删除 ICU
  deleteICUById: id => {
    return http({
      url: `/patient/deleteICUById/${id}`,
      method: 'post'
    })
  },
  // 档案 -查询时间轴
  selectTimeAxis: params => {
    return http({
      url: '/timeAxis/selectTimeAxis',
      method: 'get',
      params
    })
  },
  // 档案 -修改时间轴时间
  updateTimeAxis: data => {
    return http({
      url: '/timeAxis/updateTimeAxis',
      method: 'post',
      data
    })
  },
  // 评分 - 删除
  gradeDelete: id => {
    return http({
      url: `/grade/delete/${id}`,
      method: 'post'
    })
  },
  // 评分 - 保存or更新
  gradeUpdate: data => {
    return http({
      url: '/grade/update',
      method: 'post',
      data
    })
  },
  // 评分 - 查询
  groupGrades: registId => {
    return http({
      url: `/grade/groupGrades/${registId}`,
      method: 'get'
    })
  },
  // 评分 - IssAis数据模板
  issAis: () => {
    return http({
      url: '/grade/getIssSetting',
      method: 'get'
    })
  },
  // 院前推送 - 列表
  pushList: data => {
    return http({
      url: '/prehospitalPush/list',
      method: 'post',
      data
    })
  },
  // 院前推送 - 急救详情
  phfaDetails: data => {
    return http({
      url: '/prehospitalPush/phfa/detail',
      method: 'post',
      data
    })
  },
  // 院前推送 - 分诊详情
  piatDetails: data => {
    return http({
      url: '/prehospitalPush/piat/detail',
      method: 'post',
      data
    })
  },
  // 更新单据状态
  submitApprove: data => {
    return http({
      url: '/patient/submitApprove',
      method: 'post',
      data
    })
  },
  // 编辑病历 - 右上角绑定
  initDept: data => {
    return http({
      url: '/patient/init/dept',
      method: 'post',
      data
    })
  },
  // 编辑病历 - tabs中绑定
  bindDept: data => {
    return http({
      url: '/patient/bind/dept',
      method: 'post',
      data
    })
  },
  // 编辑病历 - 同步数据
  synchrodata: registId => {
    return http({
      url: `/patient/sync/detail/${registId}`,
      method: 'post',
    })
  },
  // 编辑病历 - 获取患者详情
  getPatientDetail: registId => {
    return http({
      url: `/patient/detail/${registId}`,
      method: 'post',
    })
  },
  // 编辑病历 - 操作日志
  operationLogs: registId => {
    return http({
      url: `/op/registId/${registId}`,
      method: 'get'
    })
  },
  // 编辑病历 - 腕带列表
  getRfTagList: params => {
    return http({
      url: '/patient/getRfTagList',
      method: 'post',
      params
    })
  },
  // 编辑病历 - 腕带绑定
  bindRfTagId: data => {
    return http({
      url: '/patient/bindRfTagId',
      method: 'post',
      data
    })
  },
  // 编辑病历 - 解除腕带绑定
  unBindRfTagId: data => {
    return http({
      url: '/patient/unBindRfTagId',
      method: 'post',
      data
    })
  },
  // 编辑病历 - 腕带信息
  getTagInfo: registId => {
    return http({
      url: `/patient/getRfTimes/${registId}`,
      method: 'post'
    })
  },
  // 编辑病历 - 导入腕带时间
  importWristTime: data => {
    return http({
      url: '/patient/importTime',
      method: 'post',
      data
    })
  },
  // 腕带 - 校验是否已绑定
  checkWrist: tagId => {
    return http({
      url: `/patient/checkBinding/${tagId}`,
      method: 'get'
    })
  },
  // 调阅 - 急救病历
  getfirstAidList: params => {
    return http({
      url: '/preview/getfirstAidList',
      method: 'post',
      params
    })
  },
  //调阅 - 预检分诊
  getTriagePreview: params => {
    return http({
      url: '/preview/getTriagePreview',
      method: 'post',
      params
    })
  },
  //调阅 - 检查
  getExamineList: params => {
    return http({
      url: '/preview/getExamineList',
      method: 'post',
      params
    })
  },
  //调阅 - 检验
  getInspectList: params => {
    return http({
      url: '/preview/getInspectList',
      method: 'post',
      params
    })
  },
  //调阅 - 用药
  getMedicationList: params => {
    return http({
      url: '/preview/getMedicationList',
      method: 'post',
      params
    })
  },
  // 数据字典 - 根据Codes获取枚举值
  getDictByCodes: data => {
    return http({
      url: '/DataDictionaryController/v1/getDictByCodes',
      method: 'post',
      data
    })
  }
}
