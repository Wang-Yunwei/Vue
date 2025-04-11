import * as types from './mutations-types'
import storage from 'store'

export default {
  [types.SET_ACCESS_TOKEN](state, accessToken) {
    storage.set(types.SET_ACCESS_TOKEN, accessToken)
    state.accessToken = accessToken
  },
  [types.SET_PERMISSION](state, permission) {
    storage.set(types.SET_PERMISSION, JSON.stringify(permission))
    state.permission = permission
    storage.set('hospitalId', permission.user.hospitalId)
    state.hospitalId = permission.user.hospitalId
  },
  [types.SET_APP](state, app) {
    storage.set(types.SET_APP, JSON.stringify(app))
    state.app = app
  },
  [types.SET_RESOURCES](state, resources) {
    storage.set(types.SET_RESOURCES, JSON.stringify(resources))
    state.resources = resources
    const list = resources.hospitalAreaList.map((item, index) => {
      return {
        label: item.name,
        value: item.id
      }
    })
    storage.set('hospitalArea', JSON.stringify(list))
    state.hospitalArea = list
    let curHospitalArea = storage.get('curHospitalArea')
    if (resources.hospitalAreaList.length > 0) {
      if (
        !curHospitalArea ||
        !resources.hospitalAreaList.find(m => m.sign === curHospitalArea)
      ) {
        curHospitalArea = resources.hospitalAreaList[0]
        if (curHospitalArea) {
          storage.set('curHospitalArea', curHospitalArea.sign)
          state.curHospitalArea = curHospitalArea.sign
        }
      }
    }
    storage.set(types.SET_APP, JSON.stringify(resources.clientInfo))
    state.app = resources.clientInfo
    storage.set(types.SET_DICTIONARY, JSON.stringify(resources.dicData))
    state.dictionary = resources.dicData
    storage.set(types.SET_CONFIGURE, JSON.stringify(resources.configure))
    state.configure = resources.setConfigure
    storage.set(types.SET_SETTING, JSON.stringify(resources.configure))
    state.setting = resources.configure
  },
  [types.SET_HOSPITALID](state, hospitalId) {
    storage.set('hospitalId', hospitalId)
    state.hospitalId = hospitalId
  },
  [types.SET_HOSPITALAREA](state, hospitalArea) {
    storage.set('hospitalArea', hospitalArea)
    state.hospitalArea = hospitalArea
  },
  [types.SET_CURHOSPITALAREA](state, hospitalArea) {
    storage.set('curHospitalArea', hospitalArea)
    state.curHospitalArea = hospitalArea
  },
  [types.SET_LOCATION](state, location) {
    const gps = `${location.longitude},${location.latitude}`
    state.location = gps
  },
  [types.SET_SEARCHQUERYCPCLIST](state, queryFilter) {
    state.searchQueryCpcList = queryFilter
  },
  [types.SET_DOCTORS](state, doctors) {
    state.doctors = doctors
  }
}
