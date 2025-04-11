import storage from 'store'

export default {
  accessToken(state) {
    return state.accessToken
  },
  permission(state) {
    return state.permission
  },
  hospitalId(state) {
    if (state.hospitalId && state.hospitalId !== '') {
      return state.hospitalId
    }
    return storage.get('hospitalId')
  },
  hospitalArea(state) {
    if (state.hospitalArea && state.hospitalArea !== '') {
      return state.hospitalArea
    }
    return storage.get('hospitalArea')
  },

  curHospitalArea(state) {
    if (state.curHospitalArea && state.curHospitalArea !== '') {
      return state.curHospitalArea
    }
    return storage.get('curHospitalArea')
  },
  app(state) {
    return state.app
  },
  appSign(state) {
    if (!state.app) return ''
    return state.app.sign
  },
  appName(state) {
    if (!state.app) return ''
    return state.app.name
  },
  resources(state) {
    if (!state.resources) return {}
    return state.resources
  },
  configure(state) {
    if (!state.configure) return {}
    return state.configure
  },
  location(state) {
    return state.location
  },
  hospitalCertifiedStatus(state) {
    let setting = state.setting
    if (!setting) {
      setting = storage.get('SET_SETTING')
    }
    if (setting && setting.hospital && setting.hospital.hosCertStatus) {
      return setting.hospital.hosCertStatus
    }
    return '1'
  },
  dictionary(state) {
    if (state.dictionary) {
      return state.dictionary
    }
    return storage.get('SET_DICTIONARY')
  },
  searchQueryCpcList(state) {
    return state.searchQueryCpcList
  },
  doctorsSetting(state) {
    return state.doctors
  }
}
