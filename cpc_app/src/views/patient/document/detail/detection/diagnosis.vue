<template>
  <div class="mini">
    <med-radio-select-field
      v-model="data.diagnosis"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写诊断' }]"
      label="诊断"
      :select-options="diagCodeDic"
      @confirm="onDiagnosisChanged"
    >
    </med-radio-select-field>
    <med-date-picker
      v-model="data.diagnosisTime"
      label="诊断时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写诊断时间' }]"
      @confirm="onDiagnosisTimeChanged"
    />
    <med-text-field
      v-model="data.diagnosisDoctor"
      :disabled="disabled"
      label="诊断医生"
      :select-options="doctorsSetting"
      @confirm="onChanged"
    />
    <div v-if="isAcs">
      <med-radio-select-field
        v-model="data.killipLevel"
        :disabled="disabled"
        :required="data.diagnosis === '1' || data.diagnosis === '2'"
        :rules="[
          {
            required: data.diagnosis === '1' || data.diagnosis === '2',
            message: '请填写心功能分级'
          }
        ]"
        label="心功能分级"
        :select-options="killipLevelDic"
        @confirm="onChanged"
      >
      </med-radio-select-field>
    </div>
    <div v-if="isNonacs">
      <med-list-select-field
        v-model="data.nacsType"
        :disabled="disabled"
        :select-options="nonacsDic"
        label="非ACS心源性胸痛类型"
        show-mode="popup"
        required
        :rules="[{ required: true, message: '请填写非ACS心源性胸痛类型' }]"
        @confirm="onNacsTypeChanged"
      />
    </div>
    <div v-if="isNoncardiogenic">
      <med-list-select-field
        v-model="data.nccpType"
        :disabled="disabled"
        :select-options="noncardiogenicDic"
        label="其它非心源性胸痛类型"
        :has-other="false"
        :other.sync="data.nccpOtherContents"
        required
        :rules="[{ required: true, message: '请填写其它非心源性胸痛类型' }]"
        @confirm="onNccpTypeChanged"
      />
    </div>
    <div v-if="showMeasure">
      <med-radio-select-field
        v-model="data.handleWay"
        :disabled="disabled"
        label="处理措施"
        :select-options="measuresDic"
        required
        :rules="[{ required: true, message: '请填写处理措施' }]"
        @confirm="onChanged"
      >
      </med-radio-select-field>
    </div>
    <med-radio-button-field
      v-model="data.isGiveupTreatment"
      :disabled="disabled"
      label="患者自愿放弃后续治疗"
      :select-options="yesOrNoDic"
      @confirm="onGiveupChanged"
      required
      :rules="[{ required: true, message: '请填写患者自愿放弃后续治疗' }]"
    >
    </med-radio-button-field>
    <van-cell v-show="data.isGiveupTreatment === '1'">
      <div class="message">
        此选择表示胸痛诊疗结束,不再继续跟踪患者的救治情况!
      </div>
    </van-cell>
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'
import { mapGetters } from 'vuex'
export default {
  name: 'Diagnosis',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataPrehospital: {
      required: true,
      type: Object
    },
    dataAdmission: {
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
      diagCodeDic: [],
      killipLevelDic: [],
      nonacsDic: [],
      noncardiogenicDic: [],
      measuresDic: []
    }
  },
  computed: {
    ...mapGetters(['doctorsSetting']),
    titleDesc() {
      if (
        this.dataPrehospital.isBypassEm === '1' &&
        this.dataPrehospital.isBypassCcu === '1'
      ) {
        return '初步诊断'
      } else {
        return '院内初步诊断'
      }
    },
    isAcs() {
      return (
        this.data.diagnosis === '1' ||
        this.data.diagnosis === '2' ||
        this.data.diagnosis === '3'
      )
    },
    isNonacs() {
      return this.data.diagnosis === '6'
    },
    isNoncardiogenic() {
      return this.data.diagnosis === '7'
    },
    showMeasure() {
      return (
        this.isNonacs || this.isNoncardiogenic || this.data.diagnosis === '9'
      )
    }
  },
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
        this.diagCodeDic = result[dicConstant.diagnosisCode]
        this.killipLevelDic = result[dicConstant.killipLevelCode]
        this.nonacsDic = result[dicConstant.nacsTypeCode]
        this.noncardiogenicDic = result[dicConstant.nccpTypeCode]
        this.measuresDic = result[dicConstant.handleWayCode]
      })
    },
    onDiagnosisTimeChanged() {
      if (
        (this.dataAdmission.comeType === '1' ||
          this.dataAdmission.comeType === '2') &&
        this.dataPrehospital.isBypassCcu === '1' &&
        this.dataPrehospital.isBypassEm === '1'
      ) {
        if (this.data.diagnosisTime !== this.dataPrehospital.diagnosisTime) {
          this.$notify({ type: 'warning', message: '院前已填诊断时间' })
        }
      }
      this.$emit('change', 'inspection')
    },
    onDiagnosisChanged() {
      this.$emit('onDiagnosisChanged')
    },
    onChanged() {
      this.$emit('change', 'inspection')
    },
    onNccpTypeChanged(item) {
      this.data.nccpType = item.selectedOptions
      this.data.nccpOtherContents = item.other
      this.$emit('change', 'inspection')
    },
    onNacsTypeChanged(item) {
      this.data.nacsType = item.selectedOptions
      this.$emit('change', 'inspection')
    },
    onGiveupChanged() {
      this.$emit('giveUpChange')
    }
  }
}
</script>

<style lang="less" scoped>
.message {
  color: red;
}
</style>
