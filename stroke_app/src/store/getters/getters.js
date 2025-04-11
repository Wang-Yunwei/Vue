// 简单getter直接列出name即可
class Getters {
  jwtToken;
  accToken;
  permissions;
  hospitalId;
  hospitalArea;
  curHospitalArea;
  registId;
  gradingTemps;
  gradingScales;
  gradingResults;
  comingType;
  dispose;
  dicData;
  patientInfo;
  sharedData;
  basicInfo;
  userInfo;
  firstNihssId;
}

// 生成简单getter
const g = new Getters()
Object.keys(g).forEach(k => g[k] ?? (g[k] = state => state[k]))

export default g
