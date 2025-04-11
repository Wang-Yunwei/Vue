<template>
  <div class="mini">
    <med-date-picker
      v-model="data.cscNoticeTime"
      label="通知心外科会诊时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-date-picker
      v-model="data.cscTime"
      label="心外科会诊时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-radio-button-field
      v-model="data.interlayerType"
      :disabled="disabled"
      label="夹层类型"
      :select-options="interlayerTypeDic"
      required
      :rules="[{ required: true, message: '请填写夹层类型' }]"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-model="data.treatmentStrategy"
      label="治疗策略"
      :disabled="disabled"
      :select-options="strategyCodeDic"
      required
      :rules="[{ required: true, message: '请填写治疗策略' }]"
      @confirm="onChanged"
    />
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'CureAd',
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
      yesOrNoDic: [],
      interlayerTypeDic: [],
      strategyCodeDic: [],
      codeList: [
        dicConstant.yesOrNoCode,
        dicConstant.interlayerTypeCode,
        dicConstant.treatmentStrategyCode
      ]
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
        this.interlayerTypeDic = result[dicConstant.interlayerTypeCode]
        this.strategyCodeDic = result[dicConstant.treatmentStrategyCode]
      })
    },
    onChanged() {
      this.$emit('change', 'inspection')
    }
  }
}
</script>

<style lang="less" scoped></style>
