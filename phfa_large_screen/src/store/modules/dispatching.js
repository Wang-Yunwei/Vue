import { firstAidDetails } from '@/api'
import { message, Modal, Spin } from 'ant-design-vue';
// 调度
const state = () => ({
    missions: [],
    curMissionId: '',
    missionDetails: {}
})

// getters
const getters = {
    missions: (state, getters, rootState) => {
        return state.missions
    },
    curMissionId: (state, getters, rootState) => {
        return state.curMissionId
    },
    curMission: (state, getters, rootState) => {
        const missions = state.missions || []
        return missions.find(m => m.missionId === state.curMissionId)
    },
    curMissionDetail: (state, getters, rootState) => {
        return state.missionDetails[state.curMissionId] || {}
    },
}

// mutations
const mutations = {
    setMissions(state, missions) {
        state.missions = missions
    },
    setCurMissionId(state, curMissionId) {
        if (curMissionId === state.curMissionId) {
            return
        }
        this.dispatch('getMissionDetail', curMissionId)
        state.curMissionId = curMissionId
    },
    setMissonDetails(state, missionDetails) {
        state.missionDetails = missionDetails
    },
}

const actions = {
    async getMissionDetail(context, missionId) {
        let forceRefresh = true  // 控制是否强制获取最新的
        let missionDetails = { ...context.state.missionDetails }
        if (!forceRefresh && missionDetails[missionId]) {
            // forceRefresh === false 时使用缓存
            // return missionDetails[missionId]
        } else {
            Modal.info({
                width: 240,
                icon: 'loading',
                title: '正在加载任务详情',
                centered: true,
                maskClosable: false,
                class: 'loading-modal'
            });
            const res = await firstAidDetails({ missionId })
            Modal.destroyAll()
            if (res.code === '000000') {
                missionDetails[missionId] = (res.body || {})
                context.commit('setMissonDetails', missionDetails)
            } else {
                message.error('获取任务详情失败!' + res.message)
            }
        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}