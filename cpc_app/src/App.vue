<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import Vue from 'vue'
// import { Dialog } from 'vant'
// import parseJson from 'parse-json'
// import { mapMutations } from 'vuex'
// import * as types from '@/store/mutations/mutations-types'
export default {
  data() {
    return {}
  },
  mounted() {
    this.$bridge.onBack(_ => {
      this.$backhelper.run()
    })

    // this.$bridge.onLocation(data => {
    //   const json = parseJson(data)

    //   this[types.SET_LOCATION](json)
    // })

    if (document.getElementById('loading')) {
      document.getElementById('loading').remove()
    }
  },
  methods: {
    // ...mapMutations([types.SET_LOCATION])
  }
}
</script>
<style lang="less">
#app {
  height: 100%;
}
</style>
