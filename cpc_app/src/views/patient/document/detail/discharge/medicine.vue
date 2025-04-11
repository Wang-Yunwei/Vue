<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.isIndrugs"
      :disabled="disabled"
      label="是否有住院期间用药"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写是否有住院期间用药' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isJtyw"
      :disabled="disabled"
      label="降糖药物"
      :select-options="yesOrNoDic"
      v-if="data.isIndrugs == 1"
      @confirm="onChooseJtywChanged"
      required
      :rules="[{ required: true, message: '请填写降糖药物' }]"
    >
    </med-radio-button-field>
    <med-check-select-field
      v-if="data.isIndrugs == 1 && data.isJtyw == 1"
      v-model="data.jtyw.arrayName"
      @confirm="onJtywChanged"
      label="降糖药物名称"
      :disabled="disabled"
      :select-options="strJtywDic"
      required
      :rules="[{ required: true, message: '请填写降糖药物名称' }]"
    ></med-check-select-field>
    <med-radio-button-field
      v-model="data.isKnyw"
      :disabled="disabled"
      label="口服抗凝药物"
      :select-options="yesOrNoDic"
      v-if="data.isIndrugs == 1"
      @confirm="onChooseKnywChanged"
      required
      :rules="[{ required: true, message: '请填写口服抗凝药物' }]"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-if="data.isIndrugs == 1 && data.isKnyw == 1"
      v-model="data.knyw.name"
      @confirm="onKnywChanged"
      label="口服抗凝药物名称"
      :disabled="disabled"
      :select-options="strKnywDic"
      required
      :rules="[{ required: true, message: '请填写口服抗凝药物名称' }]"
    ></med-radio-select-field>
    <med-radio-button-field
      v-model="data.isPcsk9"
      :disabled="disabled"
      label="PCSK9"
      :select-options="yesOrNoDic"
      v-if="data.isIndrugs == 1"
      @confirm="onChoosePcsk9Changed"
      required
      :rules="[{ required: true, message: '请填写PCSK9' }]"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-model="data.pcsk9.name"
      :disabled="disabled"
      label="PCSK9名称"
      @confirm="onPcsk9Changed"
      :select-options="strPcsk9Dic"
      v-if="data.isIndrugs == 1 && data.isPcsk9 == 1"
      required
      :rules="[{ required: true, message: '请填写PCSK9名称' }]"
    >
    </med-radio-select-field>
    <med-number-field
      v-if="data.isIndrugs == 1 && data.isPcsk9 == 1"
      v-model="data.pcsk9.value"
      :disabled="disabled"
      label="PCSK9剂量"
      unit="mg"
      @confirm="onPcsk9Changed"
      required
      :rules="[{ required: true, message: '请填写PCSK9剂量' }]"
    >
    </med-number-field>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'

export default {
  name: 'Medicine',
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
      strJtywDic: [],
      strKnywDic: [],
      strPcsk9Dic: []
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
        this.strJtywDic = result[dicConstant.ohaCode]
        this.strKnywDic = result[dicConstant.noacCode]
        this.strPcsk9Dic = result[dicConstant.pck9Code]
      })
    },
    onChanged() {
      console.log('medicine changed')
      this.$emit('change', 'discharge')
    },
    onJtywChanged() {
      this.$emit('change', 'jtyw')
    },
    onChooseJtywChanged() {
      this.$emit('change', 'discharge')
      this.$emit('change', 'jtyw')
    },
    onKnywChanged() {
      this.$emit('change', 'knyw')
    },
    onChooseKnywChanged() {
      this.$emit('change', 'discharge')
      this.$emit('change', 'knyw')
    },
    onPcsk9Changed() {
      this.$emit('change', 'pcsk9')
    },
    onChoosePcsk9Changed() {
      this.$emit('change', 'discharge')
      this.$emit('change', 'pcsk9')
    }
  }
}
</script>

<style lang="less" scoped></style>
