const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  permissions: (state) => state.user.permissions,
  permission_routes: (state) => state.permission.routes,
  userInfo: (state) => state.user.info,
  roles: (state) => state.user.roles,
  user: (state) => state.user.info,
  hospitalId: (state) => state.common.hospital,
  hospitalAreaList: (state) => state.common.hospitalAreaList,
  hospitalArea: (state) => state.common.hospitalArea,

  receiveDept: (state) => state.receiveDept,// 接诊科室
  leaveLocationTime: (state) => state.leaveLocationTime,// 离开现场时间
  arriveDeptTime: (state) => state.arriveDeptTime,// 到达科室时间
  synchronize: (state) => state.synchronize,// 同步
  admittingDiagnosis: (state) => state.admittingDiagnosis,// 入院诊断
  phfaDeath: (state) => state.phfaDeath,// 院前急救死亡
  phfaDeathTime: (state) => state.phfaDeathTime,// 院前急救死亡时间
  piatDeath: (state) => state.piatDeath,// 预检分诊死亡
  rescueRoom: (state) => state.rescueRoom, // 预检分诊 - 抢救室
  operatingRoom: (state) => state.operatingRoom, // 院内诊疗 - 手术室
}
export default getters
