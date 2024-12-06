const state = {
  info: {}
}

const mutations = {
  SET_PATIENTINFO: (state, info) => {
    state.info = info
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
