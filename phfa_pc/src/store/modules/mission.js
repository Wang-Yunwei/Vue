const state = {
  info: {}
}

const mutations = {
  SET_MISSION: (state, info) => {
    state.info = info
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
