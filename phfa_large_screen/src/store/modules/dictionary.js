import dicConstant from '@/constant'
import { getDictByCodes } from '@/api'
import { message } from 'ant-design-vue';

// 字典
const state = () => ({
    dicMap: {},
})

// getters
const getters = {
    dicMap: (state, getters, rootState) => {
        return state.dicMap
    },
}

// mutations
const mutations = {
    setDicMap(state, map) {
        state.dicMap = map
    },
}

const actions = {
    async getDicList(context, param) {
        const res = await getDictByCodes(param)
        if (res.code === '000000') {
            // 将code转化成别名方便使用 如 PHFA_0001 -> gender
            const map = {}
            const data = res.body || {}
            const entries = Object.entries(dicConstant)
            Object.keys(data).forEach(code => {
                const [aliasKey] = (entries.find(arr => arr[1] === code) || [code])
                if (aliasKey) {
                    map[aliasKey] = data[code]
                }
            })
            context.commit('setDicMap', map)
        } else {
            message.error('初始化字典失败! ' + res.message)
        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}