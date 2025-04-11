<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.isCardiolohyConsultant"
      :disabled="disabled"
      label="是否会诊"
      :select-options="yesOrNoDic"
      @confirm="onCardiolohyConsultantChanged"
      required
      :rules="[{ required: true, message: '请填写是否会诊' }]"
    >
    </med-radio-button-field>
    <div v-if="data.isCardiolohyConsultant == '1'">
      <med-radio-button-field
        v-model="data.consultantType"
        :disabled="disabledConsultant"
        label="会诊类型"
        :select-options="mdtTypeDic"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写会诊类型' }]"
      >
      </med-radio-button-field>
      <med-date-picker
        v-model="data.noticeConsultantTime"
        label="通知会诊时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabledConsultant"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写通知会诊时间' }]"
      />
      <med-date-picker
        v-model="data.consultantTime"
        label="会诊时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabledConsultant"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写会诊时间' }]"
      />
    </div>
    <med-radio-button-field
      v-model="data.isBypassEm"
      :disabled="disabled"
      v-if="showPassEmrgency"
      label="绕行急诊"
      :select-options="yesOrNoDic"
      @confirm="onBypassEmChanged"
      required
      :rules="[{ required: true, message: '请填写绕行急诊' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isBypassCcu"
      :disabled="disabled"
      label="绕行CCU"
      :select-options="yesOrNoDic"
      @confirm="onPassCCUChanged"
      v-if="showPassCCU"
      required
      :rules="[{ required: true, message: '请填写绕行CCU' }]"
    >
    </med-radio-button-field>
  </div>
</template>

<script>
import { urlToHttpOptions } from 'url'
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'CMdt',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataAdmission: {
      required: true,
      type: Object
    },
    dataPreHospital: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    },
    hasFirstAid: {
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
      mdtTypeDic: [],
      codeList: [dicConstant.yesOrNoCode, dicConstant.consultationTypeCode]
    }
  },
  computed: {
    disabledConsultant() {
      // if (this.hasFirstAid || this.disabled) {
      //   return true
      // }
      return this.disabled
    },
    showPassEmrgency() {
      if (this.dataAdmission.comeType === '3') {
        return false
      }
      return true
    },
    showPassCCU() {
      if (
        this.dataAdmission.comeType === '1' ||
        this.dataAdmission.comeType === '2' ||
        this.dataAdmission.comeType === '4' ||
        this.data.diagnosis === '1' ||
        this.data.diagnosis === '2' ||
        this.data.diagnosis === '3'
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
        this.mdtTypeDic = result[dicConstant.consultationTypeCode]
      })
    },
    onChanged() {
      this.$emit('change', 'inspection')
    },
    onCardiolohyConsultantChanged() {
      if (
        (this.dataAdmission.comeType === '1' ||
          this.dataAdmission.comeType === '2') &&
        this.dataPreHospital.isBypassCcu === '1' &&
        this.dataPreHospital.isBypassEm === '1'
      ) {
        if (
          this.data.isCardiolohyConsultant !==
          this.dataPreHospital.isCardiolohyConsultant
        ) {
          this.$notify({ type: 'warning', message: '院前已填远程会诊' })
        }
      }
      this.$emit('change', 'inspection')
    },
    onBypassEmChanged() {
      if (
        (this.dataAdmission.comeType === '1' ||
          this.dataAdmission.comeType === '2') &&
        this.dataPreHospital.isBypassCcu === '1' &&
        this.dataPreHospital.isBypassEm === '1'
      ) {
        if (this.data.isBypassEm !== this.dataPreHospital.isBypassEm) {
          this.$notify({ type: 'warning', message: '院前已填绕行急诊' })
        }
      }
      this.$emit('change', 'inspection')
    },
    onPassCCUChanged() {
      if (
        (this.dataAdmission.comeType === '1' ||
          this.dataAdmission.comeType === '2') &&
        this.dataPreHospital.isBypassCcu === '1' &&
        this.dataPreHospital.isBypassEm === '1'
      ) {
        if (this.data.isBypassCcu !== this.dataPreHospital.isBypassCcu) {
          this.$notify({ type: 'warning', message: '院前已填绕行CCU' })
        }
      }
      this.$emit('change', 'inspection')
    }
  }
}
</script>

<style lang="less" scoped></style>
