<template>
  <div class="task-basic-info-wrapper">
    <div class="task-part-title">
      <span class="solid" />
      <span>溶栓</span>
    </div>
    <van-cell-group>
      <med-fast-date-field
        required
        v-model="times.cure.rsAdmissionTime"
        label="溶栓医生接诊时间"
        clearable
      />
      <med-fast-date-field
        required
        v-model="times.cure.rsTalkStartTime"
        label="溶栓开始谈话时间"
        clearable
      />
      <med-radio-button-field
        name="isRsInformedArgee"
        v-model="times.cure.isRsInformedArgee"
        label="溶栓知情同意"
        required
        :select-options="InformedConsent"
      />
      <!-- <van-cell required title="溶栓知情同意">
        <van-radio-group
          class="flex-c-s radio-btn-type"
          v-model="times.cure.isRsInformedArgee"
        >
          <van-radio
            v-for="item in InformedConsent"
            :key="item.value"
            :name="item.value"
          >
            {{ item.label }}
          </van-radio>
        </van-radio-group>
      </van-cell> -->
      <med-fast-date-field
        v-if="times.cure.isRsInformedArgee === '0'"
        required
        v-model="times.cure.rsTalkEndTime"
        label="溶栓谈话结束时间"
        clearable
      />
      <med-fast-date-field
        v-if="times.cure.isRsInformedArgee === '1'"
        required
        v-model="times.cure.rsInformedSignTime"
        label="溶栓家属签字时间"
        clearable
      />
      <med-fast-date-field
        v-if="times.cure.isRsInformedArgee === '1'"
        required
        v-model="times.cure.firstPharmacyTime"
        label="首剂给药时间"
        clearable
      />
      <med-fast-date-field
        v-if="times.cure.isRsInformedArgee === '1'"
        v-model="times.cure.rsAdeTime"
        label="溶栓不良事件时间"
        clearable
      />
    </van-cell-group>
  </div>
</template>
<script>
import { GcCure } from '@model/commonModel'
import { throttle } from 'lodash'
import { validateTimeSequence } from '@/utils/validate'

const timeout = 2000
export default {
  name: 'timeCollection_thrombolysis',
  data() {
    return {
      registId: this.$route.query.registId,
      times: {
        cure: { ...GcCure(), registId: this.$route.query.registId }
      },
      InformedConsent: [
        { label: '同意', name: '是否知情同意', value: '1' },
        { label: '拒绝', name: '是否知情同意', value: '0' }
      ]
    }
  },
  // 钩子方法
  created() {
    // 根据患者id查询溶栓记录
    this.getCure()
  },
  methods: {
    // 保存溶栓信息
    timeCollection: throttle(function() {
      this.$api.cure.timeCollectionForRs(this.times.cure).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    // 获取溶栓时间数据
    getCure() {
      this.$api.timeManagement
        .getTimeManagement(this.registId, '3')
        .then(({ result }) => {
          result.cure.registId = this.registId
          this.$preventWatch(() => {
            if (result.cure) {
              this.times = { ...this.times, ...result }
            }
          })
          validateTimeSequence(result.cure, 'cure')
        })
    }
  },
  watch: {
    'times.cure.isRsInformedArgee': {
      immediate: false,
      handler(newVal, oleVal) {
        if (this.times.cure.isRsInformedArgee === '0') {
          this.$set(this.times.cure, 'isRsInformed', '')
          this.$set(this.times.cure, 'rsInformedSignTime', '')
          this.$set(this.times.cure, 'rsCostTime', '')
          this.$set(this.times.cure, 'sRsVein', '')
          this.$set(this.times.cure, 'rsRefuseReason', '')
          this.$set(this.times.cure, 'rsNihssBeforeId', '')
          this.$set(this.times.cure, 'firstPharmacyTime', '')
          this.$set(this.times.cure, 'bodyWeight', undefined)
          this.$set(this.times.cure, 'rsDrugs', '')
          this.$set(this.times.cure, 'rsDose', '')
          this.$set(this.times.cure, 'rsDoseActual', '')
          this.$set(this.times.cure, 'rsUrokinaseDose', '')
          this.$set(this.times.cure, 'rsOtherDrug', '')
          this.$set(this.times.cure, 'rsOthers', '')
          this.$set(this.times.cure, 'rsNihssAfterId', '')
          this.$set(this.times.cure, 'isRsAde', '')
          this.$set(this.times.cure, 'rsAdeTime', '')
          this.$set(this.times.cure, 'rsAdeType', '')
          this.$set(this.times.cure, 'rsAdeIhType', '')
          this.$set(this.times.cure, 'rsAdeIhSeverity', '')
          this.$set(this.times.cure, 'isRsAdeIahr', '')
          this.$set(this.times.cure, 'rsAdeOther', '')
        }
      },
      deep: true
    },
    'times.cure': {
      immediate: false,
      handler(newVal, oleVal) {
        const isTimeValid = validateTimeSequence(this.times.cure, 'cure')
        this.timeCollection()
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
