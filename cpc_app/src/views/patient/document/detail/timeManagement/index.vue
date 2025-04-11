<template>
  <div>
    <router-view />
    <van-tabbar class="tabIndex" v-model="active">
      <van-tabbar-item
        name="timeCollection"
        icon="search"
        @click="jump('/patient/detail/timeManagement/timeCollection')"
      >
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-551' : 'iconlvtong-541'"
          />
        </template>
        时间采集
      </van-tabbar-item>
      <van-tabbar-item
        name="timeline"
        icon="search"
        @click="jump('/patient/detail/timeManagement/timeline')"
      >
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
  name: 'TimeManagementIndex',
  data() {
    return {
      registId: this.$route.query.registId,
      type: this.$route.query.type,
      active: 'timeCollection'
    }
  },
  methods: {
    jump(path) {
      if (path === this.$route.path) return
      this.$router.push({
        path,
        query: {
          registId: this.registId,
          type: this.type
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/assets/styles/common/document/edit.less";
/deep/ .van-tabs {
  .van-tabs__content {
    height: calc(100vh - 584px);
  }
}
</style>
