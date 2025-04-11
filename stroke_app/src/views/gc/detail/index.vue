<template>
  <div>
    <div class="scroll-box">
      <router-view />
    </div>
    <van-tabbar class="tabIndex" :value="active">
      <van-tabbar-item
        name="detailEdit"
        icon="home-o"
        @click="jump('/gc/detail/task')"
      >
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-641' : 'iconlvtong-651'"
          />
        </template>
        病历编辑
      </van-tabbar-item>
      <van-tabbar-item
        v-if="showTimeCollection"
        name="timeCollection"
        icon="home-o"
        @click="jump('/gc/detail/timeCollection')"
      >
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-541' : 'iconlvtong-551'"
          />
        </template>
        时间采集
      </van-tabbar-item>
      <van-tabbar-item
        name="timeline"
        icon="search"
        @click="jump('/gc/detail/timeline')"
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
import emrStatus from '@constant/emrStatus'
import { mapGetters } from 'vuex'
import { resetTimeValidationData } from '@/utils/validate'
export default {
  name: 'Detail',
  data() {
    return {
      registId: this.$route.query.registId,
      infoComingType: this.$route.query.infoComingType,
      emId: this.$route.query.emId,
      regNo: this.$route.query.regNo,
      viewMode: this.$route.query.viewMode
    }
  },
  created() {
    resetTimeValidationData()
  },
  computed: {
    ...mapGetters(['patientInfo']),
    showTimeCollection() {
      return (
        this.$entitled('mr-add') &&
        emrStatus.filling === this.patientInfo.status
      )
    },
    active() {
      switch (this.$route.path) {
        case '/gc/detail/task':
          return 'detailEdit'
        case '/gc/detail/timeCollection':
          return 'timeCollection'
        case '/gc/detail/timeline':
          return 'timeline'
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
@import './index.less';
</style>
