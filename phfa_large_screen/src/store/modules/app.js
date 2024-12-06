import { getHospitals } from "../../api"

// 字典
const state = () => ({
    // hospitalId: localStorage.getItem('hospitalId') || '',  // hospitalSign
    hospitalList: JSON.parse(localStorage.getItem('hospitalList') || '[]') || [],
    hospitalAreaList: JSON.parse(localStorage.getItem('hospitalAreaList') || '[]') || [],
    // hospitalArea: '',
})

// getters
const getters = {
    // hospitalId: (state, getters, rootState) => {
    //     return state.hospitalId
    // },
    // 仅展开到医院这一层
    hospitalList: (state, getters, rootState) => {
        return state.hospitalList
    },
    // 展开到院区这一层
    hospitalAreaList: (state, getters, rootState) => {
        return state.hospitalAreaList
    },
    // hospitalArea: (state, getters, rootState) => {
    //     return state.hospitalArea
    // },
}

// mutations
const mutations = {
    // setHospitalId(state, id) {
    //     localStorage.setItem('hospitalId', id)
    //     state.hospitalId = id
    // },
    setHospitalList(state, list) {
        localStorage.setItem('hospitalList', JSON.stringify(list))
        state.hospitalList = list
    },
    setHospitalAreaList(state, list) {
        localStorage.setItem('setHospitalAreaList', JSON.stringify(list))
        state.setHospitalAreaList = list
    },
    // setHospitalArea(state, id) {
    //     state.hospitalArea = id
    // }
}

const actions = {
    getHospitalList({ commit }) {
        return new Promise((resolve, reject) => {
            getHospitals().then(res => {
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
                    commit('setHospitalList', hospitalList)
                    commit('setHospitalAreaList', hospitalAreaList)
                } else {
                    reject(new Error('请求医院列表失败'))
                    commit('setHospitalList', [])
                    commit('setHospitalAreaList', [])
                }
            })
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}