<template>
  <div class="time-content-wrapper">
    <van-cell-group>
      <med-title title="初始药物" />
      <med-fast-date-field
        v-model="treatment.aspirinTime"
        label="抗血小板给药"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />
      <med-fast-date-field
        v-model="treatment.anticoagulationTime"
        label="抗凝给药"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />

      <med-title title="溶栓" style="margin-top: 4px;" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatment.rsStartAgreeTime"
        label="开始知情同意"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatment.rsSignAgreeTime"
        label="签署知情同意"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatment.rsStartTime"
        label="开始溶栓"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatment.rsEndTime"
        label="溶栓结束"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />

      <med-title title="直接PCI" style="margin-top: 4px;" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatment.decisionPciTime"
        label="决定介入手术"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatment.startPciTime"
        label="启动导管室"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatment.pciStartAgreeTime"
        label="开始知情同意"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatment.pciSignAgreeTime"
        label="签署知情同意"
        :disabled="disabled"
        @confirm="onTreatmentChanged"
      />
    </van-cell-group>
  </div>
</template>
<script>
import dateMixin from '@mixins/dateMixin'
import { debounce } from 'lodash'

let saveTimer
export default {
  name: 'addInformation',
  props: {
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      dateTimeShow: false,
      registId: this.$route.query.registId,
      treatment: {
        registId: '',
        aspirinTime: '',
        anticoagulationTime: '',

        rsStartAgreeTime: '',
        rsSignAgreeTime: '',
        rsStartTime: '',
        rsEndTime: '',
        decisionPciTime: '',
        startPciTime: '',
        pciStartAgreeTime: '',
        pciSignAgreeTime: ''
      },
      InformedConsent: [
        { label: '是', name: '是否知情同意', value: '1' },
        { label: '否', name: '是否知情同意', value: '0' }
      ]
    }
  },
  created() {
    this.getTimeManagement()
  },
  methods: {
    onTreatmentChanged() {
      this.updateTreatment()
    },
    // 胸痛治疗
    updateTreatment: debounce(function() {
      this.treatment.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcTreatment: this.treatment,
          editFlag: 'treatment'
        })
        .then(res => {
          if (res.status === 200) {
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    // 获取胸痛治疗
    getTimeManagement() {
      this.$api.timeManagement
        .getTimeManagement(this.registId, '3')
        .then(res => {
          if (res.result.simpleCpcTreatment) {
            this.treatment.aspirinTime =
              res.result.simpleCpcTreatment.aspirinTime
            this.treatment.anticoagulationTime =
              res.result.simpleCpcTreatment.anticoagulationTime
            this.treatment.rsStartAgreeTime =
              res.result.simpleCpcTreatment.rsStartAgreeTime
            this.treatment.rsSignAgreeTime =
              res.result.simpleCpcTreatment.rsSignAgreeTime
            this.treatment.rsStartTime =
              res.result.simpleCpcTreatment.rsStartTime
            this.treatment.rsEndTime = res.result.simpleCpcTreatment.rsEndTime
            this.treatment.decisionPciTime =
              res.result.simpleCpcTreatment.decisionPciTime
            this.treatment.startPciTime =
              res.result.simpleCpcTreatment.startPciTime
            this.treatment.startRadiographyTime =
              res.result.simpleCpcTreatment.startRadiographyTime
            this.treatment.pciStartAgreeTime =
              res.result.simpleCpcTreatment.pciStartAgreeTime
            this.treatment.pciSignAgreeTime =
              res.result.simpleCpcTreatment.pciSignAgreeTime
          }
        })
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
