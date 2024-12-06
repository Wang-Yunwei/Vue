import store from '@/store'
import { get } from 'lodash'
import moment from 'moment'

const commonMixin = {
  methods: {
    $moment: moment,
    getHospitalArea() {
      return store.dispatch('common/getHospitalArea')
    },
    _get(obj, path) {
      if (!path) return ''
      return get(obj, path)
    }
  }
}

export { commonMixin }
