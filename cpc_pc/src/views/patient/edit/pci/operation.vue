<template>
  <div class="mini">
    <med-subtitle title="介入手术" />
    <el-row :gutter="24">
      <!-- <el-col :span="6">
        <med-datetime-field
          v-model="data.startConduitTime"
          form-prop="treatmentPci.startConduitTime"
          label="启动导管室时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col> -->
      <el-col :span="6">
        <med-datetime-field
          v-model="data.activateConduitTime"
          form-prop="treatmentPci.activateConduitTime"
          label="导管室激活时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写导管室激活时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.patientArrivalTime"
          form-prop="treatmentPci.patientArrivalTime"
          label="患者到达导管室时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="6">
        <med-autocomplete-field
          v-model="data.interventionPerson"
          :suggestion="medicalWorkers"
          :disabled="disabled"
          label="介入医师"
          form-prop="treatmentPci.interventionPerson"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.startPunctureTime"
          form-prop="treatmentPci.startPunctureTime"
          label="开始穿刺时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.startRadiographyTime"
          form-prop="treatmentPci.startRadiographyTime"
          label="造影开始时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="12">
        <med-radio-field
          v-model="data.timi"
          form-prop="treatmentPci.timi"
          :disabled="disabled"
          label="TIMI血流等级"
          :select-options="dictionary.timiLevelDict"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.anticoagulationTime"
          form-prop="treatmentPci.anticoagulationTime"
          label="术中抗凝给药时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-model="data.anticoagulationDrug"
          form-prop="treatmentPci.anticoagulationDrug"
          :disabled="disabled"
          label="术中抗凝药物"
          :select-options="dictionary.anticoagulationDrugDict"
        />
      </el-col>
      <el-col :span="6">
        <med-unit-field
          v-model="anticoagulation"
          form-prop="treatmentPci.anticoagulationDose"
          :disabled="disabled"
          label="术中抗凝药物剂量"
          :unit-options="dictionary.anticoagulationUnitDict"
          @change="onAnticoagulationConfirm"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.endOperationTime"
          form-prop="treatmentPci.endOperationTime"
          label="手术结束时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写手术结束时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.isDelay"
          form-prop="treatmentPci.isDelay"
          :disabled="disabled"
          label="是否延误"
          :select-options="dictionary.yesOrNoDict"
        />
      </el-col>
      <el-col :span="6">
        <med-text-field
          v-model="D2W"
          label="D2W时间"
          :readonly="true"
          placeholder="自动生成"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-if="data.isDelay === '1'"
          v-model="data.delayReason"
          display-type="check"
          form-prop="treatmentPci.delayReason"
          label="延误原因"
          :disabled="disabled"
          :select-options="dictionary.delayReasonDict"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'Operation',
  components: {},
  props: {
    registId: {
      type: String,
      require: true,
      default: ''
    },
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    },
    dataPciPart: {
      required: true,
      type: Array,
      default: () => []
    },
    dataAdmission: {
      required: true,
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      active: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      doctors: [
        { label: 'doctor1', value: '1' },
        { label: 'doctor2', value: '2' },
        { label: 'doctor3', value: '3' }
      ]
      // anticoagulation: {
      //   value: '',
      //   unit: ''
      // }
    }
  },
  computed: {
    ...mapGetters([
      'dictionary',
      'medicalWorkers'
    ]),
    D2W() {
      // let hasValue = false
      // if (
      //   this.dataAdmission.arrivedHospitalTime != null &&
      //   this.data.cagPosition != null &&
      //   this.data.cagPosition.length > 0
      // ) {
      //   for (var i = 0; i < this.dataPciPart.length; i++) {
      //     const part = this.dataPciPart[i]
      //     if (JSON.stringify(this.data.cagPosition).indexOf(part.partId) >= 0) {
      //       if (part.isPci === '1' && part.gwPassageTime != null) {
      //         hasValue = true
      //         return moment(part.gwPassageTime)
      //           .diff(
      //             moment(this.dataAdmission.arrivedHospitalTime),
      //             'minute'
      //           )
      //           .toString()
      //       }
      //     }
      //   }
      // }
      // if (!hasValue) {
      //   return null
      // }
      // return '0'

      let hasValue = false
      const tempData = [...this.dataPciPart]
      const lst = tempData.sort((a, b) => {
        if (a.gwPassageTime === null && b.gwPassageTime !== null) {
          return -1
        }
        if (a.gwPassageTime !== null && b.gwPassageTime === null) {
          return 1
        }
        return moment(a.gwPassageTime).isAfter(b.gwPassageTime) ? 1 : -1
      })

      if (
        this.data.cagPosition != null &&
        this.data.cagPosition.length > 0
      ) {
        for (var i = 0; i < lst.length; i++) {
          const part = lst[i]
          if (JSON.stringify(this.data.cagPosition).indexOf(part.partId) >= 0) {
            if (part.isPci === '1') {
              this.$set(this.data, 'gwPassageTime', part.gwPassageTime)
              if (part.gwPassageTime && this.dataAdmission.arrivedHospitalTime != null) {
                hasValue = true
                return moment(part.gwPassageTime)
                  .diff(
                    moment(this.dataAdmission.arrivedHospitalTime),
                    'minute'
                  )
                  .toString()
              }
            }
          }
        }
      }
      if (!hasValue) {
        return null
      }
      return '0'
    },
    anticoagulation() {
      return {
        value: this.data.anticoagulationDose,
        unit: this.data.anticoagulationUnit
      }
    }
  },
  created() {

  },
  mounted() {
    // this.anticoagulation.value = this.data.anticoagulationDose
    // this.anticoagulation.unit = this.data.anticoagulationUnit
  },
  methods: {
    onAnticoagulationChanged(val) {
      if (!val) return
      this.data.AnticoagulationDose = val.value
      this.data.AnticoagulationUnit = val.unit.value
    },
    onAnticoagulationConfirm() {
      this.data.anticoagulationDose = this.anticoagulation.value
      this.data.anticoagulationUnit = this.anticoagulation.unit
      this.data.registId = this.registId
    }
  }
}
</script>

<style lang="scss" scoped></style>
