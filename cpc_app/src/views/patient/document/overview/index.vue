<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Detection',
  components: {},
  data() {
    return {
      registId: this.$route.query.registId,
      isLock: this.$route.query.isLock,
      status: this.$route.query.status,
      type: this.$route.query.type,
      openUrl: this.$route.query.openUrl
    }
  },
  computed: {
    active() {
      switch (this.$route.path) {
        case '/patient/document/overview/detail':
          return 'detailTask'
        case '/patient/document/overview/timeline':
          return 'timeline'
        case '/patient/document/overview/main':
          return 'overview'
        default:
          return 'detailTask'
      }
    },
    showTimeAcquisition() {
      if (this.isLock === '1') {
        return false
      }
      return !this.status || this.status.slice(0, 1) === '1'
    }
  },
  created() {},
  methods: {
    jump(path) {
      if (path === this.$route.path) return
      this.$router.push({
        path,
        query: {
          registId: this.registId,
          type: this.type,
          openUrl: this.openUrl
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/common/document/edit.less';
/deep/ .van-tabs {
  .van-tabs__content {
    height: calc(100vh - 584px);
  }
}
</style>
