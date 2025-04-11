<template>
  <med-view-container @return="toFileList" title="时间轴" wide>
    <patient-info
      :viewMode="true"
      :dic="dicData"
      v-bind="patientInformation"
      @changed="onPatientInfoChange"
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
</template>

<script>
import Timeline from './Timeline'
import PatientInfo from '@/views/gc/detail/task/components/PatientInfo'
import timeDiffMixin from '@mixins/timeDiffMixin'
import basicInfoMixin from '@mixins/basicInfoMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'timeline',
  components: { Timeline, PatientInfo },
  mixins: [timeDiffMixin, basicInfoMixin],
  data() {
    return {
      time: 200000,
      active: 0,
      registId: this.$route.query.registId,
      details: {},
      countdown: {}
    }
  },
  computed: {
    ...mapGetters(['dicData'])
  },
  async created() {
    this.dataRefreh()
    //    倒计时数据
    this.getCountdown()
    // 基本信息数据
    this.getBasicInfo(
      this.$route.query.registId,
      false,
      this.startTimerIfNotComplete
    )
  },
  destroyed() {
    // 在页面销毁后，清除计时器
    this.clear()
  },
  methods: {
    onPatientInfoChange() {
      this.getBasicInfo(this.registId, false)
      //  更新时间轴
      const timeLineRef = this.$refs.timeLine
      if (timeLineRef) {
        timeLineRef.getDiagnosisTime()
        timeLineRef.getCountdown()
      }
    },
    /**
     * 未完成则开始定时器
     */
    startTimerIfNotComplete() {
      if (!this.isArchived) {
        this.startTimer()
      }
    },
    // 定时任务试试刷新距最后正常时间
    dataRefreh() {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        this.getCountdown()
      }, 60000)
    },
    // 停止定时器
    clear() {
      clearInterval(this.intervalId)
      this.intervalId = null
    },
    // 倒计时数据
    getCountdown() {
      this.$api.timeManagement.getCountdown(this.registId).then(res => {
        this.countdown = res.result
      })
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
