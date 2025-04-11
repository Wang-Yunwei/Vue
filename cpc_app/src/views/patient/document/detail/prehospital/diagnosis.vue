<template>
  <div>
    <med-radio-select-field
      v-model="data.diagnosis"
      :disabled="disabled"
      label="诊断"
      :select-options="diagCodeDic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-date-picker
      v-model="data.diagnosisTime"
      label="诊断时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'Diagnosis',
  components: {},
  props: {
    data: {
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
      diagCodeDic: [],
      codeList: [dicConstant.diagnosisCode]
    }
  },
  computed: {},
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.diagCodeDic = result[dicConstant.diagnosisCode]
      })
    },
    onChanged() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped></style>
