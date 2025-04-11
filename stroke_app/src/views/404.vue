<template>
  <div class="no-permission-wrapper">
    {{ msg }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '授权错误，关闭重试！'
    }
  },
  created() {
    this.msg = this.$route.query.message
  }
}
</script>

<style lang="less" scoped>
.no-permission-wrapper {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}
</style>
