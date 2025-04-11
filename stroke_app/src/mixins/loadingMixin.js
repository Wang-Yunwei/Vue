export default {
  methods: {
    loading(duration = 0) {
      this.$toast.loading({
        message: '加载中',
        forbidClick: true,
        duration: duration // 值为 0 时，loading 不会消失
      })
    },
    hideLoading() {
      this.$toast.clear()
    }
  }
}
