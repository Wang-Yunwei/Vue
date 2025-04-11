<template>
  <div>
    <med-radio-button-field
      v-model="data.isCardiolohyConsultant"
      :disabled="disabled"
      label="心内科会诊"
      :select-options="yesOrNoDic"
      required
      :rules="[{ required: true, message: '请填写心内科会诊' }]"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <div v-if="data.isCardiolohyConsultant == 1">
      <med-date-picker
        v-model="data.noticeConsultantTime"
        label="通知会诊时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabled"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写通知会诊时间' }]"
      />
      <med-date-picker
        v-model="data.consultantTime"
        label="会诊时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabled"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写会诊时间' }]"
      />
    </div>
    <med-radio-button-field
      v-model="data.isBypassEm"
      :disabled="disabled"
      label="绕行急诊"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写绕行急诊' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isBypassCcu"
      :disabled="disabled"
      label="绕行CCU"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写绕行CCU' }]"
    >
    </med-radio-button-field>
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'Mdt',
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
      yesOrNoDic: []
    }
  },
  computed: {},
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
      })
    },
    onChanged() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped></style>
