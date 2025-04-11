<template>
  <div>
    <med-view-container @return="jumpToDetails" title="时间轴" wide>
      <patient-info
        :view-mode="isViewMode"
        v-bind="patientInformation"
        :dic="dicData"
        @rfTagIdChange="rfTagIdChange"
      >
        <template #thirdLeft v-if="fromLastHealthyTime">
          <div style="color: #5e74fe">
            {{ fromLastHealthyTime }}
          </div>
        </template>
      </patient-info>
      <div class="scroll-view">
        <Timeline ref="timeLine" />
      </div>
    </med-view-container>
    <van-popup
      v-model="timeCollectionShow"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <TimelineCollection @backClick="backClick" />
    </van-popup>
  </div>
</template>

<script>
import Timeline from '@views/gc/timeManagement/timeline/Timeline'
import TimelineCollection from '@views/gc/timeManagement/timeCollection/index'
import PatientInfo from '@/views/gc/detail/task/components/PatientInfo'
import timeDiffMixin from '@mixins/timeDiffMixin'
import basicInfoMixin from '@mixins/basicInfoMixin'
import { emrStatus } from '@constant/commonConstant'
import { mapGetters } from 'vuex'
import * as types from '@/store/mutations/mutations-types'

export default {
  name: 'detailTimeline',
  components: { Timeline, TimelineCollection, PatientInfo },
  mixins: [timeDiffMixin, basicInfoMixin],
  data() {
    return {
      time: 200000,
      active: 0,
      registId: this.$route.query.registId,
      timeCollectionShow: false,
      details: {}
    }
  },
  computed: {
    ...mapGetters(['dicData']),
    isViewMode() {
      return (
        this.$route.query?.viewMode || this.details.status !== emrStatus.filling || !this.$entitled('mr-add')
      )
    }
  },
  async created() {
    // 基本信息数据
    this.getBasicInfo(
      this.$route.query.registId,
      false,
      this.startTimerIfNotComplete
    )
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
    rfTagIdChange(id) {
      // 腕带号变化
      this.$set(this.details, 'rfTagId', id)
      this[types.SET_PATIENT_INFO]({ ...this.details })
    },
    jumpToDetails() {
      this.$router.push({
        path: '/gc',
        query: { registId: this.registId }
      })
    },
    openTimeCollection() {
      this.timeCollectionShow = true
    },
    backClick() {
      this.timeCollectionShow = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
