<template>
  <div>
    <van-tabbar class="tabIndex" :value="active">
      <van-tabbar-item
        name="detailTask"
        icon="home-o"
        @click="jump('/patient/document/detail')"
      >
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-641' : 'iconlvtong-651'"
          />
        </template>
        病历编辑
      </van-tabbar-item>
      <van-tabbar-item
        name="timeCollection"
        icon="search"
        @click="jump('/patient/document/detail/timeManagement/timeCollection')"
        v-if="showTimeAcquisition"
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
        @click="jump('/patient/document/detail/timeManagement/timeline')"
      >
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-531' : 'iconlvtong-521'"
          />
        </template>
        时间轴
      </van-tabbar-item>
      <van-tabbar-item
        name="qualityControl"
        @click="jump('/patient/document/detail/qc')"
        v-if="_resources.mrQc()"
      >
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-661' : 'iconlvtong-671'"
          />
        </template>
        病例分析
      </van-tabbar-item>
    </van-tabbar>
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
        case '/patient/document/detail':
          return 'detailTask'
        case '/patient/document/detail/timeManagement/timeline':
          return 'timeline'
        case '/patient/document/detail/timeManagement/timeCollection':
          return 'timeCollection'
        case '/patient/document/detail/qc':
          return 'qualityControl'
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
