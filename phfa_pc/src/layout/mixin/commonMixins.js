import store from '@/store'
import { dicConstant } from '@/constant'
import { get } from 'lodash'
import moment from 'moment'

const commonMixin = {
  filters: {
    convert: function (value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find((v) => v.value === value) || { label: '' }).label
    }
  },
  methods: {
    $moment: moment,
    getDictionary() {
      return store.dispatch('common/getDictionary', Object.values(dicConstant))
    },
    _get(obj, path) {
      if (!path) return ''
      return get(obj, path)
    }
  }
}

export { commonMixin }
