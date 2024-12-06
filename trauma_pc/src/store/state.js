export default {
  permission: null,
  info: {},
  hospitalId: '', // 医院id
  hospitalAreaList: [], // 医院院区列表
  hospitalArea: '', // 当前医院院区
  receiveDept: '', // 急救科室
  leaveLocationTime: '',// 离开现场时间
  arriveDeptTime: '', // 到达科室时间
  synchronize: false, // 同步
  admittingDiagnosis: '', // 入院诊断
  phfaDeath: false, // 院前急救死亡
  phfaDeathTime: '', // 院前急救死亡时间
  piatDeath: false, // 预检分诊死亡
  rescueRoom: {}, // 预检分诊 - 抢救室
  operatingRoom: {}, // 院内诊疗 - 手术室
}
