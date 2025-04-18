import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

import permission from './modules/permission'

import getters from './getters'
import preExamScore from './modules/pre-exam-score'
import preExamMsg from './modules/pre-exam-msg'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    preExamScore,
    preExamMsg
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
