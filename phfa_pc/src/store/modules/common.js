import { queryByCodeList, getHospitals } from '@/api' // 接口
import { queryRescuersList } from '@/api/personnel'
import { dicConstant as dic } from '@/constant/index'

const common = {
  namespaced: true,
  state: {
    // hospital: sessionStorage.getItem('hospital') || '', // 当前医院
    // hospitalArea: sessionStorage.getItem('hospitalArea') || '', // 当前院区
    // hospitalAreas: [],
    dictionary: JSON.parse(sessionStorage.getItem('dictionary') || '{}') || {},
    hospitalList: JSON.parse(sessionStorage.getItem('hospitalList') || '[]') || [], // 医院列表,不展开到院区
    hospitalAreaList: JSON.parse(sessionStorage.getItem('hospitalAreaList') || '[]') || [], // 医院列表,展开到院区
    doctorList: JSON.parse(sessionStorage.getItem('doctorList') || '[]') || [], // 医生列表
    nurseList: JSON.parse(sessionStorage.getItem('nurseList') || '[]') || [], // 护士列表
    driverList: JSON.parse(sessionStorage.getItem('driverList') || '[]') || [] // 司机列表
  },
  mutations: {
    // SET_HOSPITAL(state, hospital) {
    //   sessionStorage.setItem('hospital', hospital)
    //   state.hospital = hospital

    //   // 变更医院ID，清空院区和字典
    //   state.hospitalAreas = []
    //   state.dictionary = {}
    // },
    // SET_HOSPITAL_AREAS(state, hospitalAreas) {
    //   state.hospitalAreas = hospitalAreas
    // },
    // SET_HOSPITAL_AREA(state, hospitalArea) {
    //   sessionStorage.setItem('hospitalArea', hospitalArea)
    //   state.hospitalArea = hospitalArea
    // },
    SET_DICTIONARY(state, dictionary) {
      state.dictionary = dictionary
      sessionStorage.setItem('dictionary', JSON.stringify(dictionary))
    },
    SET_HOSPITAL_LIST(state, hospitalList) {
      state.hospitalList = hospitalList
      sessionStorage.setItem('hospitalList', JSON.stringify(hospitalList))
    },
    SET_HOSPITAL_AREA_LIST(state, hospitalAreaList) {
      state.hospitalAreaList = hospitalAreaList
      sessionStorage.setItem('hospitalAreaList', JSON.stringify(hospitalAreaList))
    },
    SET_DOCTOR_LIST(state, doctorList) {
      state.doctorList = doctorList
      sessionStorage.setItem('doctorList', JSON.stringify(doctorList))
    },
    SET_NURSE_LIST(state, nurseList) {
      state.nurseList = nurseList
      sessionStorage.setItem('nurseList', JSON.stringify(nurseList))
    },
    SET_DRIVER_LIST(state, driverList) {
      state.driverList = driverList
      sessionStorage.setItem('driverList', JSON.stringify(driverList))
    }
  },
  actions: {
    /**
     * 获取字典对象
     * @param {*} param0
     * @param {Array|String} keys 字典码或字典码数组
     * @returns {Object} 字典对象
     */
    async getDictionary({ commit, state, rootGetters }, keys) {
      // 查询字典接口
      const { body: result } = await queryByCodeList({ hospitalId: rootGetters.hospitalId }) || {}
      commit('SET_DICTIONARY', result)
      return result
    },
    setHospital({ commit }, hospitalId) {
      commit('SET_HOSPITAL', hospitalId)
    },
    // async getHospitalArea({ commit, state }) {
    //   if (state.hospitalAreas && state.hospitalAreas.length > 0) return state.hospitalAreas

    //   const { body: result } = await queryHospitalArea({ hospitalId: state.hospital }) || []
    //   const res = result.map(a => { return { areaId: a.id, areaName: a.name } })
    //   commit('SET_HOSPITAL_AREAS', res)
    //   commit('SET_HOSPITAL_AREA', res[0].areaName)
    //   return res
    // },
    getHospitals({ commit }, query) {
      return new Promise(async(resolve, reject) => {
        const res = await getHospitals(query)
        if (res && res.body) {
          // 筛掉没有院区的医院,正式数据必有院区
          const validHospitals = (res.body || []).filter(el => el.areaList?.length)
          const hospitalList = validHospitals.map(el => ({ ...el, label: el.name, value: el.sign, lat: el.latitude, lng: el.longitude }))
          // 按院区展开成列表
          const hospitalAreaList = validHospitals.reduce((arr, hos) =>
            arr.concat(hos.areaList.map(area => ({
              id: area.id,
              value: hos.sign + '_' + area.sign,
              label: hos.name + '(' + area.name + ')',
              get name() { return this.label },
              lat: area.latitude || hos.latitude,
              lng: area.longitude || hos.longitude,
              get latitude() { return this.lat },
              get longitude() { return this.lng }
            }))), [])
          resolve(hospitalList)
          commit('SET_HOSPITAL_LIST', hospitalList)
          commit('SET_HOSPITAL_AREA_LIST', hospitalAreaList)
        } else {
          reject(new Error('请求医院列表失败'))
          commit('SET_HOSPITAL_LIST', [])
          commit('SET_HOSPITAL_AREA_LIST', [])
        }
      })
    },
    getPersonnels({ commit, state, rootGetters }, query = {}) {
      return new Promise(async(resolve, reject) => {
        const res = await queryRescuersList(query)
        if (res?.body) {
          const allList = (res.body.records || []).map(el => ({ ...el, label: el.rescuerName, value: el.rescuerId }))
          const curHospitalArea = rootGetters.hospitalArea
          const curHospitalAreaRescuers = allList.filter(el => el.hospitalArea === curHospitalArea)
          resolve(curHospitalAreaRescuers)
          const personnelTypes = state.dictionary[dic.personnelType] || []
          const doctorType = personnelTypes.find(el => el.label === '医生')?.value
          const nurseType = personnelTypes.find(el => el.label === '护士')?.value
          const driverType = personnelTypes.find(el => ['司机', '驾驶员'].includes(el.label))?.value
          const doctorList = curHospitalAreaRescuers.filter(el => el.rescuerType === doctorType)
          const nurseList = curHospitalAreaRescuers.filter(el => el.rescuerType === nurseType)
          const driverList = curHospitalAreaRescuers.filter(el => el.rescuerType === driverType)

          commit('SET_DOCTOR_LIST', doctorList)
          commit('SET_NURSE_LIST', nurseList)
          commit('SET_DRIVER_LIST', driverList)
        } else {
          reject(new Error('请求医院列表失败'))
          commit('SET_DOCTOR_LIST', [])
          commit('SET_NURSE_LIST', [])
          commit('SET_DRIVER_LIST', [])
        }
      })
    }
  }
}

export default common
