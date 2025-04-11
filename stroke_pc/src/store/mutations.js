import * as types from '@/store/mutation-types'
import storage from 'store'

export default {
  [types.SET_DICDATA](state, dicData) {
    storage.set('dicData', dicData)
    state.dicData = dicData
  }
}
