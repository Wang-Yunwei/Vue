import storage from 'store'

const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  userInfo: (state) => state.user.info,
  permissions: (state) => state.user.permissions,
  roles: (state) => state.user?.roles || storage.get('ROLES'),
  permission_routes: (state) => state.permission.routes,
  errorLogs: (state) => state.errorLog.logs,
  user: (state) => {
    if (state.user.info) {
      return state.user.info
    }
    return storage.get('USER')
  },
  hospitalId: (state) => {
    if (state.common.hospital) {
      return state.common.hospital
    }
    return storage.get('HOSPITALID')
  },
  hospitalArea(state) {
    if (state.common.hospitalArea) {
      return state.common.hospitalArea
    }
    return storage.get('HOSPITALAREA')
  },
  currentHospitalArea(state) {
    return state.common.currentHospitalArea
  },
  app(state) {
    if (state.common.app) {
      return state.common.app
    }
    return storage.get('APP')
  },
  resources(state) {
    if (state.common.resources) {
      return state.common.resources
    }
    return storage.get('RESOURCES')
  },
  configure(state) {
    if (state.common.configure) {
      return state.common.configure
    }
    return storage.get('CONFIGURE')
  },
  dictionary(state) {
    if (state.common.dictionary) {
      return state.common.dictionary
    }
    return storage.get('DICTIONARY')
  },
  medicalWorkers(state) {
    if (state.common.medicalworkers) {
      return state.common.medicalworkers
    }
    return storage.get('MEDICALWORKERS')
  },
  simplePwd(state) {
    return state.user.simplePwd
  },
  rfTags(state) {
    // return state.common.rfTags
    if (state.common.rfTags) {
      return state.common.rfTags
    }
    return storage.get('RFTAGS')
  }
}
export default getters
