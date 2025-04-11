export default {
  watch: {
    form: {
      handler(nVal) {
        console.log('form变化：', nVal)
      },
      deep: true
    }
  }
}
