const commonMixin = {
  filters: {
    convert: function(value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find((v) => v.value === value) || { label: '' }).label
    }
  },
  methods: {
  }
}

export { commonMixin }
