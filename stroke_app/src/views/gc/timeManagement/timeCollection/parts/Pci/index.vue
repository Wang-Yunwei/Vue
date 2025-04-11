<template>
  <div class="task-basic-info-wrapper">
    <div class="task-part-title">
      <span class="solid" />
      <span>介入</span>
    </div>
    <van-cell-group>
      <med-fast-date-field
        v-model="times.cure.crActiveTime"
        label="激活导管室时间"
        clearable
      />
      <med-fast-date-field
        v-model="times.cure.crEnterTime"
        label="进入导管室时间"
        clearable
      />
      <med-fast-date-field
        v-model="times.cure.crLeaveTime"
        label="离开导管室时间"
        clearable
      />
      <med-fast-date-field
        required
        v-model="times.cure.pciAdmissionTime"
        label="介入医生接诊时间"
      />
      <med-fast-date-field
        required
        v-model="times.cure.pciTalkStartTime"
        label="介入开始谈话时间"
        clearable
      />
      <med-radio-button-field
        name="isPciInformedArgee"
        v-model="times.cure.isPciInformedArgee"
        label="介入知情同意"
        required
        :select-options="InformedConsent"
      />
      <!-- <van-cell required title="介入知情同意">
        <van-radio-group
          class="flex-c-s radio-btn-type"
          v-model="times.cure.isPciInformedArgee"
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
        v-if="times.cure.isPciInformedArgee === '0'"
        required
        v-model="times.cure.pciTalkEndTime"
        label="介入谈话结束时间"
        clearable
      />
      <med-fast-date-field
        v-if="times.cure.isPciInformedArgee === '1'"
        required
        v-model="times.cure.pciInformedSignTime"
        label="介入家属签字时间"
        clearable
      />
      <!-- <med-fast-date-field
        v-if="times.cure.isPciInformedArgee === '1'"
        required
        v-model="times.cure.femoralArteryStartTime"
        label="股动脉穿刺开始时间"
        clearable
      /> -->
      <med-fast-date-field
        v-if="times.cure.isPciInformedArgee === '1'"
        v-model="times.cure.femoralArteryFinishTime"
        label="完成动脉穿刺时间"
        clearable
      />
      <!-- <med-fast-date-field
        required
        v-model="times.cure.bloodVesselsTime"
        label="首次血管造影开始时间"
        clearable
      /> -->
      <med-fast-date-field
        v-if="times.cure.isPciInformedArgee === '1'"
        required
        v-model="times.cure.pciReFinishTime"
        label="完成造影评估时间"
        clearable
      />
      <med-fast-date-field
        v-if="times.cure.isPciInformedArgee === '1'"
        v-model="times.cure.thrombectomyStartTime"
        label="开始取栓时间"
        clearable
      />
      <med-fast-date-field
        v-if="times.cure.isPciInformedArgee === '1'"
        required
        v-model="times.cure.pciFroTime"
        label="首次血管再通时间"
        clearable
      />
      <med-fast-date-field
        v-if="times.cure.isPciInformedArgee === '1'"
        v-model="times.cure.pciLroTime"
        label="末次血管再通时间"
        clearable
      />
      <med-fast-date-field
        v-if="times.cure.isPciInformedArgee === '1'"
        v-model="times.cure.pciAdeTime"
        label="介入不良事件时间"
        clearable
      />
    </van-cell-group>
  </div>
</template>
<script>
import dateMixin from '@mixins/dateMixin'
import { GcCure } from '@model/commonModel'
import { throttle } from 'lodash'
import { validateTimeSequence } from '@/utils/validate'

const timeout = 2000

export default {
  name: 'timeCollection_pci',
  mixins: [dateMixin],
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
    this.getPciTime()
  },
  methods: {
    // 保存介入
    timeCollection: throttle(function() {
      this.$api.cure.timeCollectionForPci(this.times.cure).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),

    getPciTime() {
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
    'times.cure.isPciInformedArgee': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.times.cure.isPciInformedArgee === '0') {
          this.$set(this.times.cure, 'pciInformedSignTime', '')
          this.$set(this.times.cure, 'pciAdaptation', '')
          this.$set(this.times.cure, 'isPci', '')
          this.$set(this.times.cure, 'pciRefuseReason', '')
          this.$set(this.times.cure, 'pciNihssBeforeId', '')
          this.$set(this.times.cure, 'femoralArteryStartTime', '')
          this.$set(this.times.cure, 'femoralArteryFinishTime', '')
          this.$set(this.times.cure, 'bloodVesselsTiciLevel', '')
          this.$set(this.times.cure, 'pciReFinishTime', '')
          this.$set(this.times.cure, 'pciStrategy', '')
          this.$set(this.times.cure, 'thrombectomyStartTime', '')
          this.$set(this.times.cure, 'pciFroTiciLevel', '')
          this.$set(this.times.cure, 'pciFroTime', '')
          this.$set(this.times.cure, 'pciLroTiciLevel', '')
          this.$set(this.times.cure, 'pciLroTime', '')
          this.$set(this.times.cure, 'pciNihssAfterId', '')
          this.$set(this.times.cure, 'isPciAde', '')
          this.$set(this.times.cure, 'pciAdeTime', '')
          this.$set(this.times.cure, 'pciAdeType', '')
        }
      },
      deep: true
    },
    'times.cure': {
      immediate: false,
      handler(newVal, olcVal) {
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
