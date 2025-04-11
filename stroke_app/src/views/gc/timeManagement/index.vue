<template>
  <div>
    <router-view />
    <van-tabbar v-model="active" class="tabIndex">
      <van-tabbar-item
        v-if="$entitled('mr-add')"
        name="timeCollection"
        icon="home-o"
        @click="toTimeCollection()"
      >
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-541' : 'iconlvtong-551'"
          />
        </template>
        时间采集
      </van-tabbar-item>
      <van-tabbar-item name="timeline" icon="search" @click="toTimeline()">
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-531' : 'iconlvtong-521'"
          />
        </template>
        时间轴
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'TimeEdit',
  data() {
    return {
      registId: this.$route.query.registId,
      active: 'timeCollection'
    }
  },
  methods: {
    // 跳转时间轴页面
    toTimeline() {
      if (this.$route.path !== '/gc/timeManagement/timeline') {
        this.$router.push({
          path: '/gc/timeManagement/timeline',
          query: { registId: this.registId }
        })
      }
    },
    // 跳转时间采集页面
    toTimeCollection() {
      if (this.$route.path !== '/gc/timeManagement/timeCollection') {
        this.$router.push({
          path: '/gc/timeManagement/timeCollection',
          query: { registId: this.registId }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
