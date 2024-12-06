import * as types from '@/store/mutation-types'
import storage from 'store'

export default {
    [types.SET_INFO](state, info) {
        storage.set(types.SET_INFO, info)
        state.info = info
    },
    [types.SET_HOSPITAL_AREA_LIST](state, hospitalAreaList) {
        storage.set(types.SET_HOSPITAL_AREA_LIST, hospitalAreaList)
        state.hospitalAreaList = hospitalAreaList
    },
    [types.SET_RECEIVE_DEPT](state, receiveDept) {
        // 接诊科室
        storage.set(types.SET_RECEIVE_DEPT, receiveDept)
        state.receiveDept = receiveDept
    },
    [types.SET_LEAVE_LOCATION_TIME](state, leaveLocationTime) {
        // 离开现场时间
        storage.set(types.SET_LEAVE_LOCATION_TIME, leaveLocationTime)
        state.leaveLocationTime = leaveLocationTime
    },
    [types.SET_ARRIVE_DEPT_TIME](state, arriveDeptTime) {
        // 到达科室时间
        storage.set(types.SET_ARRIVE_DEPT_TIME, arriveDeptTime)
        state.arriveDeptTime = arriveDeptTime
    },
    [types.SET_SYNCHRONIZE](state, synchronize) {
        // 同步
        storage.set(types.SET_SYNCHRONIZE, synchronize)
        state.synchronize = synchronize
    },
    [types.SET_ADMITTING_DIAGNOSIS](state, admittingDiagnosis) {
        // 入院诊断
        storage.set(types.SET_ADMITTING_DIAGNOSIS, admittingDiagnosis)
        state.admittingDiagnosis = admittingDiagnosis
    },
    [types.SET_PHFA_DEATH](state, phfaDeath) {
        // 院前急救死亡
        storage.set(types.SET_PHFA_DEATH, phfaDeath)
        state.phfaDeath = phfaDeath
    },
    [types.SET_PHFA_DEATH_TIME](state, phfaDeathTime) {
        // 院前急救死亡时间
        storage.set(types.SET_PHFA_DEATH_TIME, phfaDeathTime)
        state.phfaDeathTime = phfaDeathTime
    },
    [types.SET_PIAT_DEATH](state, piatDeath) {
        // 预检分诊死亡
        storage.set(types.SET_PIAT_DEATH, piatDeath)
        state.piatDeath = piatDeath
    },
    [types.SET_RESCUE_ROOM](state, rescueRoom) {
        // 预检分诊 - 抢救室
        storage.set(types.SET_RESCUE_ROOM, rescueRoom)
        state.rescueRoom = rescueRoom
    },
    [types.SET_OPERATING_ROOM](state, operatingRoom) {
        // 院内诊疗 - 手术室
        storage.set(types.SET_OPERATING_ROOM, operatingRoom)
        state.operatingRoom = operatingRoom
    },
}
