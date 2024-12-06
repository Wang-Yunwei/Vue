import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['codeList'])
  },
  methods: {
    getCodeListByKey(key) {
      const arr = key instanceof Array ? key : [key]
      const codeList = JSON.parse(this.codeList)
      const result = {}
      arr.forEach(el => {
        result[el] = codeList[el]
      })
      return result
    }
  }
}
