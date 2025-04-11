<template>
  <div>
    <router-view />
    <!-- <van-tabbar class="tabIndex" :value="active">
      <van-tabbar-item name="detailEdit" @click="jump('/gc/preview/task')">
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-641' : 'iconlvtong-651'"
          />
        </template>
        病历编辑
      </van-tabbar-item>
      <van-tabbar-item name="timeline" @click="jump('/gc/preview/timeline')">
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-531' : 'iconlvtong-521'"
          />
        </template>
        时间轴
      </van-tabbar-item>
      <van-tabbar-item name="overview" @click="jump('/gc/preview/overview')">
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-701' : 'iconlvtong-711'"
          />
        </template>
        病历全览
      </van-tabbar-item>
    </van-tabbar> -->
  </div>
</template>

<script>
export default {
  name: 'Preview',
  data() {
    return {
      registId: this.$route.query.registId,
      infoComingType: this.$route.query.infoComingType,
      emId: this.$route.query.emId,
      regNo: this.$route.query.regNo,
      viewMode: this.$route.query.viewMode
    }
  },
  computed: {
    active() {
      switch (this.$route.path) {
        case '/gc/preview/task':
          return 'detailEdit'
        case '/gc/preview/timeline':
          return 'timeline'
        case '/gc/preview/overview':
          return 'overview'
        default:
          return 'detailEdit'
      }
    }
  },
  methods: {
    jump(path) {
      if (path === this.$route.path) return
      this.$router.push({
        path,
        query: {
          registId: this.registId,
          regNo: this.regNo,
          infoComingType: this.infoComingType,
          emId: this.emId,
          viewMode: this.viewMode
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
