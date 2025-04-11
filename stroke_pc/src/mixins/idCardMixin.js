export default {
  methods: {
    isIdcard(idcard) {
      if (idcard === '') return false
      if (idcard.length !== 15 && idcard.length !== 18) return false
      if (idcard.match(/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/) == null) {
        return false
      }
      return true
    },
    getBirthday(idcard) {
      if (!this.isIdcard(idcard)) return ''
      if (idcard.length === 18) {
        // 处理18位的身份证号码从号码中得到生日和性别代码
        return (
          idcard.substr(6, 4) +
          '-' +
          idcard.substr(10, 2) +
          '-' +
          idcard.substr(12, 2)
        )
      }
      return (
        '19' +
        idcard.substr(6, 2) +
        '-' +
        idcard.substr(8, 2) +
        '-' +
        idcard.substr(10, 2)
      )
    },
    getSex(idcard) {
      if (!this.isIdcard(idcard)) return ''
      const flag = idcard.slice(idcard.length - 2, idcard.length - 1)
      return parseInt(flag) % 2 === 0 ? '2' : '1'
    },
    toBirthday(source) {
      if (!source || source.length < 8) return ''
      try {
        const year = source.substr(0, 4)
        const month = source.substr(4, 2)
        const day = source.substr(6, 2)
        const date = new Date(year, parseInt(month) - 1, day)
        if (this.$moment(date).isValid()) {
          return date
        }
        return ''
      } catch (exception) {
        return ''
      }
    },
    calcAge(source) {
      if (!source) return undefined
      const current = this.$moment()
      const months = current.diff(source, 'months')
      const birthSpan = {
        year: Math.floor(months / 12),
        month: Math.floor(months) % 12,
        day: Math.round((months % 1) * current.daysInMonth(), 0)
      }
      let age = birthSpan.year - 1
      if (birthSpan.month >= 0 || birthSpan.day >= 0) age++
      return age
    }
  }
}
