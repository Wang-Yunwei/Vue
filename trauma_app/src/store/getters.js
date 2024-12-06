class Getters {
  constructor() {
    // 生成简单getter
    Object.keys(this).forEach(
      key => this[key] ?? (this[key] = state => state[key])
    )
  }
  // 列出简单getter的name
  accessToken;
  jwtToken;
  dictionary;// 字典
  loginUserInfo;// 登录用户信息
  hospitalList;// 医院列表
  hospitalId;// 医院ID
  hospitalAreaList;// 院区列表
  hospitalArea;// 院区
  registId;// 病历ID
  readOnly;// 只读
  receiveDept;// 接诊科室
  leaveLocationTime;// 离开现场时间
  patientName;// 患者姓名
  emId;
  visitType;// 来院方式
  isPickRead;// 是否调阅
  diagnosis;// 病情判断
  arrivalTime;// 到达急诊或门诊时间
  admittingDiagnosis;// 入院诊断
  attackTime;// 发病时间
  arriveHospitalTime;// 到院时间
  arriveHospitalConnect;// 到院交接
  binding;// 绑定
  phfaDeath;// 院前急救死亡
  phfaDeathTime;// 院前急救死亡时间
  piatDeath;// 预检分诊死亡
}

export default new Getters()
