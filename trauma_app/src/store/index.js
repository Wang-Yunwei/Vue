import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

export default () => {
  const store = new Vuex.Store({
    strict: true,
    state,
    mutations,
    actions,
    getters
  })
  return store
}
