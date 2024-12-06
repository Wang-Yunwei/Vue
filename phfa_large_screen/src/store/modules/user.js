import { getAuthToken, getBusinessToken } from '@/api'
import { message } from 'ant-design-vue';

// 用户登录
const state = () => ({
    businessToken: localStorage.getItem('businessToken') || '', // 业务token,用于业务接口header携带
    userId: localStorage.getItem('userId') || '',
    hospitalId: localStorage.getItem('hospitalId') || '',
    hospitalArea: localStorage.getItem('hospitalArea') || '',
})

// getters
const getters = {
    businessToken: (state) => {
        return state.businessToken
    },
    userId: (state) => {
        return state.userId
    },
    hospitalId: (state) => {
        return state.hospitalId
    },
    hospitalArea: (state) => {
        return state.hospitalArea || ''
    },
}

// mutations
const mutations = {
    setBusinessToken(state, businessToken) {
        localStorage.setItem('businessToken', businessToken)
        state.businessToken = businessToken
    },
    setUserId(state, id) {
        localStorage.setItem('userId', id)
        state.userId = id
    },
    setHospitalId(state, id) {
        localStorage.setItem('hospitalId', id)
        state.hospitalId = id
    },
    setHospitalArea(state, hospitalArea) {
        localStorage.setItem('hospitalArea', hospitalArea || '')
        state.hospitalArea = hospitalArea
    }
}

const actions = {
    // 用户名密码获取授权令牌
    getAuthToken({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            if (payload.password && payload.username) {
                const res = await getAuthToken(payload)
                if (res.body?.jwt_token) {
                    resolve(res.body.jwt_token)
                } else {
                    reject(new Error('登录失败! ' + res.message))
                }
            } else {
                reject(new Error('请填写用户名和密码'))
            }
        })
    },
    // 授权令牌换业务令牌
    getBusinessToken({ commit }, authJwtToken) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await getAuthToken({ authJwtToken })
                if (res.code === '000000') {
                    const token = res.body?.businessToken?.jwt_token || ''
                    const userInfo = res.body?.loginUserInfo?.user || {}
                    const userId = userInfo.id || ''
                    const hospitalId = userInfo.hospitalId || ''
                    const hospitalArea = (userInfo.userHospitalAreaDtoList || [])[0]?.sign
                    resolve(token)
                    commit('setHospitalArea', hospitalArea)
                    commit('setBusinessToken', token)
                    commit('setHospitalId', hospitalId)
                    commit('setUserId', userId)
                } else {
                    message.error('登录失败!' + res.message)
                    reject(new Error('用户登录失败!'))
                    commit('setBusinessToken', '')
                }
            } catch (err) {
                console.log('登录出错', err)
                reject(new Error(err))
            }
        })
    },
    logout({ commit }) {
        commit('setBusinessToken', '')
        commit('setHospitalId', '')
        commit('setUserId', '')
        localStorage.clear()
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}