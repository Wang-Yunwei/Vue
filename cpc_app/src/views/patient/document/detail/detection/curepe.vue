<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.pulmonaryLevel"
      :disabled="disabled"
      label="危险分层"
      :select-options="riskLevelDic"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <med-date-picker
      v-model="data.anticoagulationTime"
      label="开始抗凝治疗时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-radio-select-field
      v-model="data.rsScreen"
      @confirm="onChanged"
      label="溶栓筛查"
      :disabled="disabled"
      :select-options="screenList"
      required
      :rules="[{ required: true, message: '请填写溶栓筛查' }]"
    ></med-radio-select-field>
    <div v-if="data.rsScreen == '1'">
      <med-radio-button-field
        v-model="data.hasContraindication"
        :disabled="disabled"
        label="存在禁忌症"
        :select-options="yesOrNoDic"
        required
        :rules="[{ required: true, message: '请填写存在禁忌症' }]"
        @confirm="onChanged"
      >
      </med-radio-button-field>
    </div>
    <div v-if="data.rsScreen == '2'">
      <med-radio-button-field
        v-model="data.isRs"
        :disabled="disabled"
        label="溶栓治疗"
        :select-options="haveOrNotDict"
        required
        :rules="[{ required: true, message: '请填写有无溶栓' }]"
        @confirm="onChanged"
      >
      </med-radio-button-field>
    </div>
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'CurePe',
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
      haveOrNotDict: [],
      yesOrNoDic: [],
      riskLevelDic: [],
      screenList: [],
      codeList: [
        dicConstant.yesOrNoCode,
        dicConstant.highriskLaminationCode,
        dicConstant.thrombolyticScreeningCode
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
        this.riskLevelDic = result[dicConstant.highriskLaminationCode]
        this.screenList = result[dicConstant.thrombolyticScreeningCode]
        this.haveOrNotDict = result[dicConstant.haveOrNotCode]
      })
    },
    onChanged() {
      this.$emit('change', 'inspection')
    }
  }
}
</script>

<style lang="less" scoped></style>
