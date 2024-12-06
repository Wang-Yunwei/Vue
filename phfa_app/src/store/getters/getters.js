// 简单getter直接列出name即可
class Getters {
  aidForm;
  businessToken;
  chiefComplaint; // 患者主诉
  codeList;
  conditionGrade; // 病情判断
  curpage;
  currentNav;
  currentPosition; // 当前位置
  diagnosis; // 初步诊断
  endPoint;
  hospitalArea; // 院区sign
  hospitalId; // 医院sign
  hospitalList; // 医院列表
  hospitalAreaList; // 院区列表
  isHandedOver; // 是否已交接
  licensePlate; // 车牌
  medicalHistory; // 病史
  medicalStatus;
  missionId;
  missionInfo;
  missionStatus;
  patientId;
  patientInfo;
  recordId;
  toHospitalName;
  toHospitalId; // 医院sign_院区sign
  userId;
  userInfo;
  diseaseCategory;
}

// 生成简单getter
const g = new Getters()
Object.keys(g).forEach(k => g[k] ?? (g[k] = state => state[k]))

export default g
