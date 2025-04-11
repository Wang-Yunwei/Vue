export default {
  methods: {
    loading() {
      this.$toast.loading({
        message: '加载中',
        forbidClick: true
      })
    },
    hideLoading() {
      this.$toast.clear()
    }
  }
}
