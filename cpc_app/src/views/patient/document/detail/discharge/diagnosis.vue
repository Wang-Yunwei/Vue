<template>
  <div class="mini">
    <div v-if="configure.dockingWay === '1'">
      <med-hint-field
        v-model="dataMain.admissionNo"
        label="住院号"
        :readonly="true"
        link
        maxlength="16"
        v-char
        @click="showimport"
        :disabled="disabled || !dataRegist.emId"
        @confirm="onMainChanged"
      >
      </med-hint-field>
    </div>
    <med-radio-select-field
      v-model="data.diagnosis"
      :disabled="disabled"
      label="出院诊断"
      :select-options="strDiagnoseDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写出院诊断' }]"
    >
    </med-radio-select-field>
    <med-list-select-field
      v-if="data.diagnosis == 6"
      v-model="data.nonAcsType"
      @confirm="onChanged"
      label="非ACS心源性胸痛类型"
      :disabled="disabled"
      :select-options="strNonAcsTypeDic"
      required
      :rules="[{ required: true, message: '请填写非ACS心源性胸痛类型' }]"
    />
    <med-list-select-field
      v-if="data.diagnosis == 7"
      v-model="data.otherAcsType"
      @confirm="onOtherAcsTypeChanged"
      label="其它非心源性胸痛类型"
      :disabled="disabled"
      :select-options="strOtherAcsTypeDic"
      :other.sync="data.nccpOtherContents"
      required
      :rules="[{ required: true, message: '请填写其它非心源性胸痛类型' }]"
    />
    <med-date-picker
      v-model="data.diagnosisTime"
      label="确诊时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写确诊时间' }]"
    />
    <med-radio-select-field
      v-model="data.covid19"
      :disabled="disabled"
      label="COVID-19"
      :select-options="strCOVID19Dic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-radio-button-field
      v-model="data.isHeartFailure"
      :disabled="disabled"
      label="院内新发心力衰竭"
      :select-options="yesOrNoDic"
      v-if="data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写院内新发心力衰竭' }]"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-model="data.nyhaLevel"
      :disabled="disabled"
      label="心功能分级"
      :select-options="strNyhaLevelDic"
      v-if="
        (data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3) &&
          data.isHeartFailure == 1
      "
      required
      :rules="[{ required: true, message: '请填写心功能分级' }]"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-radio-button-field
      v-model="data.arni"
      :disabled="disabled"
      label="ARNI"
      :select-options="yesOrNoDic"
      v-if="data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写ARNI' }]"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-model="data.takingFrequency"
      @confirm="onChanged"
      label="服用频次"
      :disabled="disabled"
      :select-options="strTakingFrequencyDic"
      v-if="
        (data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3) &&
          data.arni == 1
      "
      required
      :rules="[{ required: true, message: '请填写服用频次' }]"
    />
    <med-radio-select-field
      v-model="data.takingFrequencyRange"
      @confirm="onChanged"
      label="服用间隔"
      :disabled="disabled"
      :select-options="strTakingFrequencyRangeDic"
      v-if="
        (data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3) &&
          data.arni == 1
      "
      required
      :rules="[{ required: true, message: '请填写服用间隔' }]"
    />
    <med-number-field
      v-if="
        (data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3) &&
          data.arni == 1
      "
      :disabled="disabled"
      v-model="data.singleDose"
      label="单次剂量"
      unit="mg"
      required
      :maxlength="11"
      v-float="{ scale: 2, min: 0, max: 99999999 }"
      @confirm="onChanged"
      :rules="[{ required: true, message: '请填写单次剂量' }]"
    >
    </med-number-field>
    <med-check-select-field
      v-model="data.complication"
      @confirm="onChanged"
      label="住院期间并发症"
      :disabled="disabled"
      :select-options="strComplicationDic"
      v-if="data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3"
      required
      :rules="[{ required: true, message: '请填写住院期间并发症' }]"
      non-code="00"
    />
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Diagnosis',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataMain: {
      required: true,
      type: Object
    },
    dataRegist: {
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
      strDiagnoseDic: [],
      strCOVID19Dic: [],
      strTakingFrequencyDic: [],
      strComplicationDic: [],
      strNyhaLevelDic: [],
      strTakingFrequencyRangeDic: [],
      strNonAcsTypeDic: [],
      strOtherAcsTypeDic: []
    }
  },
  computed: {
    ...mapGetters(['configure']),
    showAdmissionNo() {
      if (
        this.dataRegist.infoComingType === '4' ||
        this.dataRegist.infoComingType === '0'
      ) {
        return false
      } else return true
    }
  },
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
        this.strDiagnoseDic = result[dicConstant.dischargeDiagnosisCode]
        this.strCOVID19Dic = result[dicConstant.covid19Code]
        this.strTakingFrequencyDic = result[dicConstant.rateCountCode]
        this.strNonAcsTypeDic = result[dicConstant.nacsTypeCode]
        this.strOtherAcsTypeDic = result[dicConstant.nccpTypeCode]
        this.strTakingFrequencyRangeDic = result[dicConstant.rateTimeCode]
        this.strComplicationDic = result[dicConstant.outcomeComplicationCode]
        this.strNyhaLevelDic = result[dicConstant.heartFailureNyhaLevelCode]
      })
    },
    showimport() {
      if (this.disabled || !this.dataRegist.emId) return
      this.$emit('showimport', '-4')
    },
    onOtherAcsTypeChanged(item) {
      this.data.otherAcsType = item.selectedOptions
      this.data.nccpOtherContents = item.other
      this.$emit('change', 'discharge')
    },
    onChanged() {
      this.$emit('change', 'discharge')
    },
    onMainChanged() {
      this.$emit('change', 'main')
    }
  }
}
</script>

<style lang="less" scoped></style>
