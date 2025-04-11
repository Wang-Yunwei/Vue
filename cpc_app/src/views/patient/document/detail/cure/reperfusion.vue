<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.isReperfusion"
      :disabled="disabled"
      label="是否再灌注"
      :select-options="yesOrNoDic"
      @confirm="onReperfusionChanged"
      required
      :rules="[{ required: true, message: '请填写是否再灌注' }]"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-if="data.isReperfusion == '0'"
      v-model="data.noReperfusionMeasure"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写无再灌注原因' }]"
      label="无再灌注原因"
      :select-options="nonreperfusionReasonDic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <div v-if="data.isReperfusion == '1'">
      <med-radio-select-field
        v-model="data.reperfusionMeasure"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写再灌注措施' }]"
        label="再灌注措施"
        :select-options="reperfusionTypeDic"
        @confirm="onReperfusionChanged"
      >
      </med-radio-select-field>
    </div>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'

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
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      yesOrNoDic: [],
      nonreperfusionReasonDic: [],
      reperfusionTypeDic: [],
      postRsTypeDic: [
        { value: '21', label: '补救PCI' },
        { value: '22', label: '溶栓后介入' }
      ],
      timiLevelDic: []
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
        this.timiLevelDic = result[dicConstant.timiLevelCode]
        // this.postRsTypeDic = result[dicConstant.reperfusionMeasureRsCode]
      })
    },
    onChanged() {
      this.$emit('change', 'treatment')
    },
    onReperfusionChanged() {
      this.$emit('onReperfusionChanged')
    }
  }
}
</script>

<style lang="less" scoped></style>
