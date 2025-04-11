<template>
  <med-view-container @return="toFileList" title="时间轴" wide>
    <patient-info
      :viewMode="true"
      :dic="dicData"
      v-bind="patientInformation"
      @changed="getBasicInfo(registId, false)"
    >
      <template #thirdLeft v-if="fromLastHealthyTime">
        <div style="color: #5e74fe">
          {{ fromLastHealthyTime }}
        </div>
      </template>
    </patient-info>
    <div :class="{ 'scroll-view': true, 'view-mode': isViewMode }">
      <Timeline />
    </div>
  </med-view-container>
</template>

<script>
import Timeline from '../../timeManagement/timeline/Timeline'
import PatientInfo from '@/views/gc/detail/task/components/PatientInfo'
import timeDiffMixin from '@mixins/timeDiffMixin'
import basicInfoMixin from '@mixins/basicInfoMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'FilingTimeline',
  components: { PatientInfo, Timeline },
  mixins: [timeDiffMixin, basicInfoMixin],
  computed: {
    ...mapGetters(['dicData']),
    isViewMode() {
      return this.$route.query.viewMode
    }
  },
  data() {
    return {
      time: 200000,
      active: 0,
      registId: this.$route.query.registId,
      details: {}
    }
  },
  created() {
    // 基本信息数据
    // this.getBasicInfo(this.$route.query.registId, false, this.startTimerIfNotComplete)
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(v) {
        if (v === '/gc/filingTimeline/timeline') {
          this.getBasicInfo(
            this.$route.query.registId,
            false,
            this.startTimerIfNotComplete
          )
        }
      }
    }
  },
  methods: {
    /**
     * 未完成则开始定时器
     */
    startTimerIfNotComplete() {
      if (!this.isArchived) {
        this.startTimer()
      }
    },
    toFileList() {
      this.$router.push({
        path: '/gc'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
