export default {
  methods: {
    /**
     * 时间格式化
     * @param date
     * @returns {*}
     */
    formatDate(date) {
      return this.$moment(date).isValid()
        ? this.$moment(date).format('YYYY-MM-DD HH:mm')
        : ''
    }
  }
}
