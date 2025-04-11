<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    this.$bridge.onBack(_ => {
      this.$backhelper.run()
    })
    if (document.getElementById('loading')) {
      document.getElementById('loading').remove()
    }
  }
}
</script>
<style lang="less" scoped>
#app {
  height: 100%;
}
</style>
