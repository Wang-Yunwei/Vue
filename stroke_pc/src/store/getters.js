const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  userInfo: (state) => state.user.info,
  permissions: (state) => state.user.permissions,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes,
  errorLogs: (state) => state.errorLog.logs,
  user: (state) => state.user.info,
  hospitalId: (state) => state.common.hospital,
  hospitalArea: (state) => state.common.hospitalArea,
  curHospitalArea: (state) => state.common.curHospitalArea,
  gradingTemps: (state) => state.common.gradingTemps,
  gradingScales: (state) => state.common.gradingScales,
  gradingResults: (state) => state.common.gradingResults,
  dicData: (state) => state.dicData
}
export default getters
