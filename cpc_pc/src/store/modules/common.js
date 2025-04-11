import { queryByCodeList, queryHospitalArea, startup } from '@/api' // 接口
import { querySetting } from '@/api/setting'
import { basicConstant } from '@/constant'
import _ from 'lodash'
import storage from 'store'

const convertToItem = (dictionary, keys) => {
  var items = {}
  keys.forEach((k) => {
    _.set(items, k, _.get(dictionary, k))
  })

  return items
}

const common = {
  namespaced: true,
  state: {
    hospital: '',
    hospitalArea: [],
    currentHospitalArea: '',
    dictionary: {},
    configure: {},
    app: null,
    medicalworkers: [],
    rfTags: []
  },
  mutations: {
    SET_CURRENT_HOSPITAL_AREA(state, hospitalArea) {
      state.currentHospitalArea = hospitalArea
    },
    SET_RESOURCES(state, resources) {
      storage.set('RESOURCES', JSON.stringify(resources))
      state.resources = resources
      const list = resources.hospitalAreaList.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
      storage.set('HOSPITALAREA', JSON.stringify(list))
      state.hospitalArea = list
      storage.set('APP', JSON.stringify(resources.clientInfo))
      state.app = resources.clientInfo
      storage.set('DICTIONARY', JSON.stringify(resources.dicData))
      state.dictionary = resources.dicData
      storage.set('CONFIGURE', JSON.stringify(resources.configure))
      state.configure = resources.setConfigure
    },
    SET_HOSPITAL(state, hospital) {
      storage.set('HOSPITALID', hospital)
      state.hospital = hospital

      // 变更医院ID，清空院区和字典
      state.hospitalArea = []
      state.dictionary = {}
    },
    SET_HOSPITAL_AREA(state, hospitalArea) {
      state.hospitalArea = hospitalArea
    },
    SET_DICTIONARY(state, item) {
      _.set(state.dictionary, item.Key, item.Value)
    },
    SET_MEDICAL_WORKERS(state, workers) {
      storage.set('MEDICALWORKERS', workers)
      state.medicalworkers = workers
    },
    SET_RF_TAGS(state, rfTags) {
      storage.set('RFTAGS', rfTags)
      state.rfTags = rfTags
    }
  },
  actions: {
    async startup({ commit }) {
      const { result } = await startup()
      commit('SET_RESOURCES', result)
      return result
    },
    async getDictionary({ commit, state }, keys) {
      // 入参判断
      let _codeList = []
      if (keys && keys instanceof Array && keys.every((k) => typeof k === 'string' && k.constructor === String)) {
        _codeList = keys
      } else if (typeof keys === 'string' && keys.constructor === String) {
        _codeList.push(keys)
      }

      if (_codeList.length === 0) {
        throw new Error('请传入正确的字典码！')
      }

      // 获取缓存字典
      const _cl = _codeList.filter((c) => !_.hasIn(state.dictionary, c))
      if (_cl.length === 0) {
        // 缓存中已全部存在
        return convertToItem(state.dictionary, _codeList)
      }

      // 查询字典接口
      const { result } = await queryByCodeList({ codeList: _cl, hospitalId: state.hospital }) || {}
      _cl.forEach((c) => commit('SET_DICTIONARY', { Key: c, Value: _.get(result, c) }))
      return convertToItem(state.dictionary, _codeList)
    },
    setHospital({ commit }, hospitalId) {
      commit('SET_HOSPITAL', hospitalId)
    },
    async getHospitalArea({ commit, state }) {
      if (state.hospitalArea && state.hospitalArea.length > 0) return state.hospitalArea

      const { result } = await queryHospitalArea({ hospitalId: state.hospital }) || []
      const res = result.map(a => { return { areaId: a.id, areaName: a.name } })
      commit('SET_HOSPITAL_AREA', res)
      return res
    },
    async getMedicalWorkers({ commit, state }) {
      const { result } = await querySetting({ code: basicConstant.MEDICALWORKERS, hospitalId: state.hospital })
      if (result) {
        commit('SET_MEDICAL_WORKERS', JSON.parse(result.value).filter(s => s.isEnabled).map(s => Object.assign({ value: s.name }, s)))
      } else {
        commit('SET_MEDICAL_WORKERS', [])
      }
    }
  }
}

export default common
