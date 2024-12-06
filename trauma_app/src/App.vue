<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.$bridge.onBack(_ => {
      this.$backhelper.run()
    })

    if (document.getElementById('loading')) {
      document.getElementById('loading').remove()
    }
  },
  methods: {}
}
</script>

<style lang="less">
#app {
  height: 100%;
}
</style>
