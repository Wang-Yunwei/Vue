<template>
  <div class="mini">
    <med-radio-select-field
      v-model="data.strategy"
      @confirm="onChanged"
      label="策略"
      required
      :rules="[{ required: true, message: '请填写策略' }]"
      :disabled="disabled"
      :select-options="strategyDic"
    />
    <med-radio-select-field
      v-model="data.invasiveStrategy"
      @confirm="onChanged"
      label="侵入性策略"
      required
      :rules="[{ required: true, message: '请填写侵入性策略' }]"
      :disabled="disabled"
      :select-options="invasiveStrategyDic"
      v-if="data.strategy === '2'"
    />
    <med-date-picker
      v-model="data.actualTime"
      label="实际介入治疗时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写实际介入治疗时间' }]"
      @confirm="onChanged"
      v-if="data.invasiveStrategy === '2' && data.strategy === '2'"
    />
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'Reperfusion',
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
      codeList: [
        dicConstant.yesOrNoCode,
        dicConstant.perfusionMeasureCode,
        dicConstant.reperfusionMeasureCode
      ],
      yesOrNoDic: [],
      nonreperfusionReasonDic: [],
      reperfusionTypeDic: [],
      strategyDic: [
        { label: '保守治疗(仅药物治疗)', value: '1' },
        { label: '侵入性策略', value: '2' }
      ],
      invasiveStrategyDic: [
        { label: '2h紧急介入治疗', value: '1' },
        { label: '24h内介入治疗', value: '2' },
        { label: '72h内介入治疗', value: '3' },
        { label: '择期介入治疗', value: '4' },
        { label: 'CABG', value: '5' }
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
        this.nonreperfusionReasonDic = result[dicConstant.perfusionMeasureCode]
        this.reperfusionTypeDic = result[dicConstant.reperfusionMeasureCode]
      })
    },
    onChanged() {
      this.$emit('change', 'treatment')
    }
  }
}
</script>

<style lang="less" scoped></style>
