<template>
  <div class="time-content-wrapper">
    <van-cell-group>
      <med-title title="介入" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatmentPci.activateConduitTime"
        label="导管室激活"
        :disabled="disabled"
        @confirm="onPciChanged"
      />
      <med-fast-date-field
        v-model="treatmentPci.patientArrivalTime"
        label="患者到达导管室"
        :disabled="disabled"
        @confirm="onPciChanged"
      />
      <med-fast-date-field
        v-model="treatmentPci.startPunctureTime"
        label="开始穿刺"
        :disabled="disabled"
        @confirm="onPciChanged"
      />
      <med-fast-date-field
        v-model="treatmentPci.startRadiographyTime"
        label="造影开始"
        :disabled="disabled"
        @confirm="onPciChanged"
      />
      <med-fast-date-field
        v-model="treatmentPci.anticoagulationTime"
        label="术中抗凝给药"
        :disabled="disabled"
        @confirm="onPciChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="treatmentPci.endOperationTime"
        label="手术结束"
        :disabled="disabled"
        @confirm="onPciChanged"
      />
      <med-fast-date-field
        v-model="treatmentPci.gwPassageTime"
        label="导丝通过"
        :disabled="disabled"
        @confirm="onPciChanged"
      />
    </van-cell-group>
  </div>
</template>
<script>
import dateMixin from '@mixins/dateMixin'
import { debounce } from 'lodash'
export default {
  name: 'addInformation',
  mixins: [dateMixin],
  props: {
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      list: [],
      registId: this.$route.query.registId,
      treatment: {
        registId: '',
        startPciTime: ''
      },
      treatmentPci: {
        registId: '',
        startConduitTime: '',
        activateConduitTime: '',
        patientArrivalTime: '',
        startPunctureTime: '',
        startRadiographyTime: '',
        anticoagulationTime: '',
        endOperationTime: '',
        gwPassageTime: ''
      }
    }
  },
  // 钩子方法
  created() {
    this.getTimeManagement()
  },
  methods: {
    onPciChanged() {
      this.updateTreatmentPci()
    },
    // 保存急救信息
    updateTreatmentPci: debounce(function() {
      this.treatmentPci.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcTreatmentPci: this.treatmentPci,
          editFlag: 'treatmentPci'
        })
        .then(res => {
          if (res.status === 200) {
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    onChanged() {
      this.updateTreatment()
    },
    // 保存急救信息
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
    getTimeManagement() {
      this.$api.timeManagement
        .getTimeManagement(this.registId, '4')
        .then(res => {
          if (res.result.simpleCpcTreatmentPci) {
            this.treatmentPci.startConduitTime =
              res.result.simpleCpcTreatmentPci.startConduitTime
            this.treatmentPci.activateConduitTime =
              res.result.simpleCpcTreatmentPci.activateConduitTime
            this.treatmentPci.patientArrivalTime =
              res.result.simpleCpcTreatmentPci.patientArrivalTime
            this.treatmentPci.startPunctureTime =
              res.result.simpleCpcTreatmentPci.startPunctureTime
            this.treatmentPci.startRadiographyTime =
              res.result.simpleCpcTreatmentPci.startRadiographyTime
            this.treatmentPci.endOperationTime =
              res.result.simpleCpcTreatmentPci.endOperationTime
            this.treatmentPci.anticoagulationTime =
              res.result.simpleCpcTreatmentPci.anticoagulationTime
            this.treatmentPci.gwPassageTime =
              res.result.simpleCpcTreatmentPci.gwPassageTime
          }

          if (res.result.simpleCpcTreatment) {
            this.treatment.startPciTime =
              res.result.simpleCpcTreatment.startPciTime
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
