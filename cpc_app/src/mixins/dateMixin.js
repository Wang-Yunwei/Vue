export default {
  methods: {
    formatDate(date) {
      if (!date) return ''
      return this.$moment(date).format('YYYY-MM-DD HH:mm')
    },
    formatOnlyDate(date) {
      if (!date) return ''
      return this.$moment(date).format('YYYY-MM-DD')
    },
    formatMMDDHHmm(date) {
      if (!date) return ''
      return this.$moment(date).format('MM-DD HH:mm')
    }
  }
}
