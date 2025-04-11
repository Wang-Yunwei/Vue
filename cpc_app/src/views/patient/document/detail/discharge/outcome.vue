<template>
  <div class="mini">
    <med-number-field
      v-model="data.hod"
      :disabled="disabled"
      label="住院天数"
      unit="天"
      @confirm="onChanged"
      required
      v-int="{ min: 0, max: 9999 }"
      :rules="[{ required: true, message: '请填写住院天数' }]"
    >
    </med-number-field>
    <med-number-field
      v-model="data.totalCost"
      :disabled="disabled"
      label="总费用"
      unit="元"
      @confirm="onChanged"
      required
      :maxlength="11"
      v-float="{ scale: 2, min: 0, max: 99999999 }"
      :rules="[{ required: true, message: '请填写总费用' }]"
    >
    </med-number-field>
    <med-radio-select-field
      v-model="data.outcomeCode"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写出院或30天转归' }]"
      label="出院或30天转归"
      :select-options="strOutcomeCodeDic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-check-select-field
      v-model="data.education"
      v-if="
        data.outcomeCode == 1 || data.outcomeCode == 2 || data.outcomeCode == 3
      "
      @confirm="onChanged"
      label="离院宣教"
      :disabled="disabled"
      :select-options="strEducationDic"
      non-code="0"
    ></med-check-select-field>
    <med-date-picker
      v-if="data.outcomeCode == 1"
      v-model="data.leaveTime"
      label="出院时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写出院时间' }]"
    />
    <med-radio-select-field
      v-model="data.treatmentResult"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写治疗结果' }]"
      label="治疗结果"
      :select-options="strTreatmentResultDic"
      v-if="data.outcomeCode == 1"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-date-picker
      v-if="data.outcomeCode == 2"
      v-model="data.handTime"
      label="离开本院大门时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '远程离开本院大门时间' }]"
    />
    <med-text-field
      v-if="data.outcomeCode == 2"
      v-model="data.hospitalName"
      :disabled="disabled"
      label="医院名称"
      @confirm="onChanged"
    >
    </med-text-field>
    <med-radio-button-field
      v-model="data.isNetHospital"
      :disabled="disabled"
      label="是否是网络医院"
      :select-options="yesOrNoDic"
      v-if="data.outcomeCode == 2"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isTransPci"
      :disabled="disabled"
      label="是否转运PCI"
      :select-options="yesOrNoDic"
      v-if="data.outcomeCode == 2"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isDirectCatheter"
      :disabled="disabled"
      label="直达导管室"
      :select-options="yesOrNoDic"
      v-if="data.outcomeCode == 2 && data.isTransPci == 1"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <med-date-picker
      v-if="data.outcomeCode == 2 && data.isTransPci == 1"
      v-model="data.decisionOperationTime"
      label="实际介入手术开始时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-date-picker
      v-if="data.outcomeCode == 2 && data.isTransPci == 1"
      v-model="data.balloonExpansionTime"
      label="导丝通过时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-radio-select-field
      v-model="data.transEcg"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写远程心电图传输' }]"
      label="远程心电图传输"
      :select-options="strTransEcgDic"
      v-if="data.outcomeCode == 2"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-date-picker
      v-if="data.outcomeCode == 2 && data.transEcg == 1"
      v-model="data.transEcgTime"
      label="传输心电图至协作单位时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-radio-select-field
      v-model="data.transWay"
      :disabled="disabled"
      label="传输方式"
      :select-options="strTransWayDic"
      v-if="data.outcomeCode == 2 && data.transEcg == 1"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-date-picker
      v-if="data.outcomeCode == 3"
      v-model="data.deptTransferTime"
      label="转科时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-text-field
      v-if="data.outcomeCode == 3"
      v-model="data.admissionDept"
      label="接诊科室"
      :disabled="disabled"
      @confirm="onChanged"
    >
    </med-text-field>
    <med-text-field
      v-if="data.outcomeCode == 3"
      v-model="data.deptTransferReason"
      :disabled="disabled"
      label="转科原因描述"
      @confirm="onChanged"
    >
    </med-text-field>
    <med-date-picker
      v-if="data.outcomeCode == 4"
      v-model="data.deathTime"
      label="死亡时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写死亡时间' }]"
    />
    <med-radio-select-field
      v-model="data.deathCause"
      :disabled="disabled"
      label="死亡原因"
      :select-options="strDeathCauseDic"
      v-if="data.outcomeCode == 4"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写死亡原因' }]"
    >
    </med-radio-select-field>
    <med-text-field
      v-if="data.outcomeCode == 4"
      v-model="data.deathCauseDesc"
      :disabled="disabled"
      label="死亡描述"
      maxlength="120"
      @confirm="onChanged"
    >
    </med-text-field>
    <med-radio-button-field
      v-model="data.afterThrombolysisRadiography"
      :disabled="disabled"
      label="溶栓后24h内造影"
      :select-options="yesOrNoDic"
      v-if="showRs && data.outcomeCode === '2'"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写溶栓后24h内造影' }]"
    >
    </med-radio-button-field>
    <med-date-picker
      v-if="
        showRs &&
          data.afterThrombolysisRadiography === '1' &&
          data.outcomeCode === '2'
      "
      v-model="data.startRadiographyTime"
      label="造影开始时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写造影开始时间' }]"
    />
    <med-text-field
      v-model="data.remarks"
      :disabled="disabled"
      label="患者情况备注"
      @confirm="onChanged"
    >
    </med-text-field>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'

export default {
  name: 'Outcome',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataTreatment: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      yesOrNoDic: [],
      strOutcomeCodeDic: [],
      strEducationDic: [],
      strTreatmentResultDic: [],
      strTransEcgDic: [],
      strTransWayDic: [],
      strDeathCauseDic: []
    }
  },
  computed: {
    showRs() {
      if (
        this.dataTreatment.isReperfusion === '1' &&
        (this.dataTreatment.reperfusionMeasure === '1' ||
          (this.dataTreatment.reperfusionMeasure === '2' &&
            this.dataTreatment.rsStrategy === null) ||
          this.dataTreatment.reperfusionMeasure === '3' ||
          this.dataTreatment.reperfusionMeasure === '4')
      ) {
        return true
      }
      return false
    }
  },
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
        this.strOutcomeCodeDic = result[dicConstant.patientOutComeCode]
        this.strEducationDic = result[dicConstant.dischargeEducationCode]
        this.strTreatmentResultDic = result[dicConstant.treatmentResultCode]
        this.strTransEcgDic = result[dicConstant.ecgTransferCode]
        this.strTransWayDic = result[dicConstant.remoteEcgtranWayCode]
        this.strDeathCauseDic = result[dicConstant.deathCauseCode]
      })
    },
    onChanged() {
      console.log('outcome changed')
      this.$emit('change', 'discharge')
    }
  }
}
</script>
<style lang="less" scoped></style>
