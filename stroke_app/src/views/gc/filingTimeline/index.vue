<template>
  <div>
    <router-view />
    <van-tabbar style="z-index: 2" :value="active">
      <van-tabbar-item name="timeline" icon="search" @click="toTimeline()">
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-531' : 'iconlvtong-521'"
          />
        </template>
        时间轴
      </van-tabbar-item>
      <van-tabbar-item
        name="overview"
        icon="home-o"
        @click="toTimeCollection()"
      >
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-701' : 'iconlvtong-711'"
          />
        </template>
        病历预览
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      regNo: this.$route.query.regNo
    }
  },
  computed: {
    registId() {
      return this.$route.query.registId
    },
    active() {
      switch (this.$route.path) {
        case '/gc/filingTimeline/timeline':
          return 'timeline'
        case '/gc/filingTimeline/overview':
          return 'overview'
        default:
          return 'timeline'
      }
    }
  },
  methods: {
    // 已归档-时间轴页面
    toTimeline() {
      if (this.$route.path !== '/gc/filingTimeline/timeline') {
        this.$router.push({
          path: '/gc/filingTimeline/timeline',
          query: { registId: this.registId }
        })
      }
    },
    // 已归档-病历预览页面
    toTimeCollection() {
      if (this.$route.path !== '/gc/filingTimeline/overview') {
        this.$router.push({
          path: '/gc/filingTimeline/overview',
          query: { registId: this.registId, regNo: this.regNo }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
