<template>
  <div class="mini">
    <med-radio-select-field
      v-model="data.lumenImage"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写腔内影像' }]"
      label="腔内影像"
      :select-options="intracavityImagingDic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-radio-select-field
      v-model="data.functionTest"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写功能检测' }]"
      label="功能检测"
      :select-options="functionTestDic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <van-field
      v-model="data.functionTestValue"
      v-if="
        data.functionTest === '1' ||
          data.functionTest === '2' ||
          data.functionTest === '3'
      "
      :disabled="disabled"
      type="number"
      input-align="left"
      @blur="onFunctionTestValueChanged"
      label="数值"
      placeholder="请输入数值"
      required
      v-float="{ scale: 2, min: 0, max: 1 }"
      :rules="[{ required: true, message: '请填写数值' }]"
    >
    </van-field>
    <med-radio-button-field
      v-model="data.iabp"
      :disabled="disabled"
      label="IABP"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写IABP' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.temporaryPacemaker"
      :disabled="disabled"
      label="临时起搏器"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写临时起搏器' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.ecmo"
      :disabled="disabled"
      label="ECMO"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写ECMO' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.leftAssistDevice"
      :disabled="disabled"
      label="左心室辅助装置"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写左心室辅助装置' }]"
    >
    </med-radio-button-field>
    <med-list-select-field
      v-model="data.complication"
      @confirm="onChanged"
      label="术中并发症"
      :disabled="disabled"
      :select-options="pciComplicationDic"
      required
      :rules="[{ required: true, message: '请填写术中并发症' }]"
      :hasOther="false"
      non-code="00"
    />
    <med-text-field
      label="填写人员"
      v-model="data.createBy"
      placeholder="请填写填写人员姓名"
      @confirm="onChanged"
    />
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'Instruments',
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
      codeList: [
        dicConstant.yesOrNoCode,
        dicConstant.intracavityImageCode,
        dicConstant.functionTestCode,
        dicConstant.pciComplicationCode
      ],
      yesOrNoDic: [],
      intracavityImagingDic: [],
      functionTestDic: [],
      pciComplicationDic: []
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
        this.intracavityImagingDic = result[dicConstant.intracavityImageCode]
        this.functionTestDic = result[dicConstant.functionTestCode]
        this.pciComplicationDic = result[dicConstant.pciComplicationCode]
      })
    },
    onChanged() {
      this.$emit('change', 'treatmentPci')
    },
    onFunctionTestValueChanged() {
      if (this.data.functionTestValue > 1) {
        this.$notify({ type: 'warning', message: '数值不能超过1' })
        this.data.functionTestValue = ''
        return
      }
      this.$emit('change', 'treatmentPci')
    }
  }
}
</script>

<style lang="less" scoped></style>
