export default {
  hospitalList: [], // 医院下拉列表
  hospitalAreaList: [], // 医院展开到院区下拉列表
  businessToken: '', // 业务token,用于业务接口header携带
  // dicToken: '',
  // permission: null,
  aidForm: {},
  currentNav: '',
  patientId: '',
  hospitalId: '', // 当前医院
  hospitalArea: '', // 当前院区
  recordId: '',
  missionId: '',
  patientInfo: {},
  missionInfo: {},
  missionStatus: '',
  medicalStatus: '01', // 病历状态
  curpage: 'ambulances',
  licensePlate: '',
  codeList: {},
  toHospitalName: '', // 送往医院
  toHospitalId: '', // 送往医院ID
  currentPosition: null, // 当前设备位置
  endPoint: null, // 目的地
  chiefComplaint: '', // 主诉
  diagnosis: '', // 初步诊断
  conditionGrade: '', // 病情判断
  medicalHistory: {}, // 病史
  userId: '', // 用户ID
  userInfo: null,
  isHandedOver: false, // 已经交接完成
  diseaseCategory: '' // 疾病类别
}
