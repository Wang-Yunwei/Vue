/* eslint-disable space-before-function-paren */
import _ from 'lodash'

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
    hospitalAreaList: [],
    hospitalArea: '',
    dictionary: {}
  },
  mutations: {
    SET_HOSPITAL(state, hospital) {
      if (state.hospital && state.hospital !== hospital) {
        // 变更医院ID，清空院区和字典
        state.hospitalAreaList = []
        state.hospitalArea = ''
        state.dictionary = {}
      }
      state.hospital = hospital
    },
    SET_HOSPITAL_AREA_LIST(state, hospitalAreaList) {
      state.hospitalAreaList = hospitalAreaList
    },
    SET_HOSPITAL_AREA(state, hospitalArea) {
      state.hospitalArea = hospitalArea
      sessionStorage.setItem('hospitalArea', hospitalArea)
    },
    SET_DICTIONARY(state, item) {
      _.set(state.dictionary, item.Key, item.Value)
    }
  },
  actions: {
    /**
         * 获取字典对象
         * @param {*} param0
         * @param {Array|String} keys 字典码或字典码数组
         * @returns {Object} 字典对象
         */
    getDictionary({ commit, state }, keys) {
      return new Promise((resolve, reject) => {
        // 入参判断
        let _codeList = []
        if (keys && keys instanceof Array && keys.every((k) => typeof k === 'string' && k.constructor === String)) {
          _codeList = keys
        } else if (typeof keys === 'string' && keys.constructor === String) {
          _codeList.push(keys)
        }

        if (_codeList.length === 0) {
          reject(new Error('请传入正确的字典码！'))
          return
        }

        // 获取缓存字典
        const _cl = _codeList.filter((c) => !_.hasIn(state.dictionary, c))
        if (_cl.length === 0) {
          // 缓存中已全部存在
          resolve(convertToItem(state.dictionary, _codeList))
          return
        }

        // 查询字典接口
        this.$api.queryByCodeList({ codeList: _cl, hospitalId: state.hospital })
          .then((res) => {
            const result = res.result
            _cl.forEach((c) => commit('SET_DICTIONARY', { Key: c, Value: _.get(result, c) }))

            resolve(convertToItem(state.dictionary, _codeList))
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 医院
    setHospital({ commit }, hospitalId) {
      commit('SET_HOSPITAL', hospitalId)
    },
    // 当前选中院区
    setHospitalArea({ commit }, hospitalArea) {
      commit('SET_HOSPITAL_AREA', hospitalArea)
    }
  }
}

export default common
