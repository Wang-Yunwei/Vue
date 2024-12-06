import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import defaultState from './state'
import mutations from './mutations'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  state: defaultState,
  modules,
  getters,
  mutations
})

export default store
