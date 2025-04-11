import Vue from 'vue'
import Vuex from 'vuex'

import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

Vue.use(Vuex)

export default () => {
  const store = new Vuex.Store({
    strict: true, // 是否能直接修改state值，而不通过mutations
    state: defaultState,
    mutations,
    actions,
    getters
  })

  return store
}
