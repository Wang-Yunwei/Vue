<template>
  <div class="task-basic-info-wrapper">
    <van-cell-group>
      <med-fast-date-field
        v-model="times.firstAid.callTime"
        label="呼救时间"
        clearable
      />
      <med-fast-date-field
        v-model="times.firstAid.arrivePatientSideTime"
        label="医生到达现场时间"
        clearable
      />
      <med-fast-date-field
        v-model="times.firstAid.fmcTime"
        label="首次医疗接触时间"
        clearable
      />
      <med-fast-date-field
        v-model="times.preEcg.ecgTime"
        label="院前心电图完成时间"
        clearable
      />
      <med-fast-date-field
        v-model="times.firstAid.openveinTime"
        label="开通静脉通道时间"
        clearable
      />
    </van-cell-group>
  </div>
</template>

<script>
import dateUtil from '@utils/dateUtil'
import dateMixin from '@mixins/dateMixin'
import { GcFirstAid, Ecg } from '@model/commonModel'
import { throttle } from 'lodash'
import { validateTimeSequence } from '@/utils/validate'

const timeout = 2000

export default {
  name: 'timeCollection_preHospital',
  mixins: [dateMixin],
  data() {
    return {
      dateUtil,
      list: [],
      show: false,
      dateTimeShow: false,
      registId: this.$route.query.registId,
      times: {
        firstAid: { ...GcFirstAid(), registId: this.$route.query.registId },
        // 院前心电图
        preEcg: {
          ...Ecg(),
          registId: this.$route.query.registId,
          ecgType: '2'
        }
      }
    }
  },
  created() {
    this.getTimeManagement()
  },
  methods: {
    // 保存急救信息
    saveFirstAid: throttle(function() {
      const req = { ...this.times.firstAid }
      this.$api.firstAid.timeCollection(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    // 时间管理获取院前急救时间
    getTimeManagement() {
      this.$api.timeManagement
        .getTimeManagement(this.registId, '1')
        .then(({ result }) => {
          this.$preventWatch(() => {
            this.times = { ...this.times, ...result }
          })
        })
    },
    // 更新心电图完成时间
    updateEcg: throttle(function(data) {
      const req = { ...data }
      this.$api.ecg.timeCollection(req).then(res => {
        if (res.status === 200) {
          if (res.result) {
            // 设置心电图的id主键
            this.$preventWatch(() => {
              this.$set(this.times.preEcg, 'id', res.result)
            })
          }
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout)
  },
  watch: {
    'times.firstAid': {
      immediate: false,
      handler(newVal, oldVal) {
        this.saveFirstAid()
      },
      deep: true
    },
    'times.preEcg': {
      immediate: false,
      handler(newVal, oldVal) {
        this.updateEcg(newVal)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
